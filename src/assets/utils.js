import { 
  convertKevinToCelcius,
  convertKevinToFahrenheit,
  convertToDateString,
  convertToLocalTime, normaliseConvertedHours, formatTime } from '../assets/convert';

export function getTemps(list) {
  return list.map((e) => e.temp);
}

export function getHighestTempByDay(list) {
  return Math.max(...list);
}

export function getLowestTempByDay(list) {
  return Math.min(...list);
}

export function getMostFrequentWeather(list) {
  const record = list.reduce((history, curr) => {
    history[curr] = history[curr] + 1 || 1;
    return history
  }, {});
  return Object.entries(record).sort((a,b) => b[1] - a[1])[0][0];
}

export function formatTemp(temp, format) {
  return format == 'celcius' ?
  convertKevinToCelcius(temp) + 'C°' :
  convertKevinToFahrenheit(temp) + 'F°'
}

export async function getForecastByCoords(location) {
  return getForecast('coords', location)
}

export async function getForecastByCity(location) {
  return getForecast('city', location)
}

export function getFilteredCities(list, str) {
  return list.filter(result => {
    return (
      result.properties.result_type == "city" &&
      result.properties.address_line1.toLowerCase().startsWith(str.toLowerCase())
    )
  })
}

export function getDailyRecord(list) {
  const record = {};
  let tempRange = [];
  let weatherRange = [];
  let pressureRange = [];
  let timeslots = 0;

  for (let i=0; i<list.length; i++) {
    if (i == 0) {
      timeslots++;
      tempRange.push(list[i].temp);
      weatherRange.push(list[i].weather.icon);
      pressureRange.push(list[i].pressure);

    } else if (list[i].datetime.substring(5, 15) == list[i-1].datetime.substring(5, 15)) {
      timeslots++;
      tempRange.push(list[i].temp);
      weatherRange.push(list[i].weather.icon);
      pressureRange.push(list[i].pressure);

    } else if (list[i].datetime.substring(5, 15) != list[i-1].datetime.substring(5, 15)) {
      record[list[i].datetime.substring(0, 15)] = {
        weather_range: [...weatherRange],
        most_frequent_weather: getMostFrequentWeather([...weatherRange]),
        temp_range: [...tempRange],
        pressure_average: +(pressureRange.reduce((sum, elem) => sum + elem) / timeslots).toFixed(2)
      };

      timeslots = 1;
      tempRange = [list[i].temp];
      weatherRange = [list[i].weather.icon];
      pressureRange = [list[i].pressure];
    }
  }
  console.log(record)
  return record;
}

export async function getForecast(type, location) {
  let query = '';
  if (type == 'coords') query = `lat=${location.latitude}&lon=${location.longitude}`
  if (type == 'city') query = `q=${location}`

  let url = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${process.env.VITE_OPENWEATHER_API}`

  return fetch(url)
  .then((res) => res.json())
  .then((d) => ({city: d.city, record: d.list}))
  .then(({city, record}) => {
    return getCountryByCode(city.country)
    .then(country => {
      record = record.map((e) => ({
        datetime: `${convertToDateString(convertToLocalTime(e.dt_txt, city.timezone))}`,
        temp: +e.main.temp,
        feels_like: +e.main.feels_like,
        humidity: +e.main.humidity,
        weather: {
          icon: 'https://openweathermap.org/img/wn/' + e.weather[0].icon + '@2x.png',
          main: e.weather[0].main,
        },
        pressure: +e.main.pressure,
        wind: {
          speed: +e.wind.speed,
          deg: +e.wind.deg
        }
      }));
      return {
        city: {...city, country},
        record
      }
    })
  })
  .catch((error) => console.warn(error));
}

export async function getSuggestedDropDown(str) {
  return fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${str}&type=city&apiKey=${process.env.VITE_GEOAPIFY_API}`)
  .then(res => res.json())
  .then((data) => {
    if (data.features?.length > 0) return getFilteredCities(data.features, data.query.text) 
  })
  .then(list => {
    if (list) list.map(e => e.properties.city)
  })
  .catch((error) => console.warn(error))
}

export async function getCountryByCode(code) {
  return fetch(`https://api.worldbank.org/v2/country/${code}?format=json`)
  .then(res => res.json())
  .then(d => d[1][0])
  .then(result => result.name)
  .catch((error) => console.warn(error));
}

export function getLocalTime(offsetHour) {
  const currentTime = new Date();
  const UTCHour = currentTime.getUTCHours();
  const localHour = normaliseConvertedHours(UTCHour + offsetHour)[1];

  const minutes = currentTime.getUTCMinutes();
  console.log(offsetHour)
  return formatTime(localHour, minutes);
}