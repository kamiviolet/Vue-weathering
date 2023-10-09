import { convertToDateString, convertToLocalTime } from '../assets/convert';

export function getTemps(list) {
  return list.map((e) => e.temp);
}

export function getDailyRecord(list) {
  const record = {};
  let tempRange = [];
  let weatherRange = [];

  for (let i=0; i<list.length; i++) {
    if (i == 0) {
      tempRange.push(list[i].temp);
      weatherRange.push(list[i].weather.icon);

    } else if (list[i].datetime.substring(5, 15) == list[i-1].datetime.substring(5, 15)) {
      tempRange.push(list[i].temp);
      weatherRange.push(list[i].weather.icon);

    } else if (list[i].datetime.substring(5, 15) != list[i-1].datetime.substring(5, 15)) {
      record[list[i].datetime.substring(0, 15)] = {
        weather_range: [...weatherRange],
        temp_range: [...tempRange]
      };

      tempRange = [list[i].temp];
      weatherRange = [list[i].weather.icon];
    }
  }
  return record;
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

export async function getForecastByCoords(location) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.VITE_OPENWEATHER_API}`
  )
    .then((res) => res.json())
    .then((d) => {
      const record = d.list.map((e) => {
        return {
          datetime: convertToDateString(convertToLocalTime(e.dt_txt, d.city.timezone)),
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
        };
      });
      return {city: d.city, record: record}
    })
    .catch((error) => console.warn(error));
}

export async function getSuggestedDropDown(str) {
  return fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${str}&apiKey=${process.env.VITE_GEOAPIFY_API}`)
  .then(res => res.json())
  .then((data) => {
    if (data.features?.length > 0) {
      return getFilteredCities(data.features, data.query.text)
    } else {
      return;
    }
  })
  .then(list => {
    if (list) {
      return list.map(e => {
        return {
          name: e.properties.city,
          country: e.properties.country,
          country_code: e.properties.country_code,
          coordinates: e.geometry.coordinates
        }
      })
    }
  })
  .catch((error) => console.warn(error))
}

export function getFilteredCities(list, str) {
  return list.filter(result => {
    return (
      result.properties.result_type == "city" && result.properties.address_line1.toLowerCase().startsWith(str.toLowerCase())
      )
  })
}

export async function getForecastByCity(city) {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.VITE_OPENWEATHER_API}`)
  .then((res) => res.json())
  .then((d) => {
    const record = d.list.map((e) => {
      return {
        datetime: convertToDateString(convertToLocalTime(e.dt_txt, d.city.timezone)),
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
      };
    });
    return {city: d.city, record: record}
  })
  .catch((error) => console.warn(error));
}