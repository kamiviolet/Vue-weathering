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
      record[list[i].datetime.substring(5, 15)] = {
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