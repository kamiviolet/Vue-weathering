export function convertKevinToCelcius(deg) {
  return Math.round(+((deg - 273).toFixed(2)));
}

export function convertKevinToFahrenheit(deg) {
  return Math.round(+(1.8 * +(deg - 273) + 32).toFixed(2));
}

export function getTemps(list) {
  return list.map((e) => e.temp);
}

export function convertToDateString(dt_str) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric"
  };
  return new Date(dt_str).toLocaleDateString("en-GB", options);
}

export function getDailyRecord(list) {
  const record = {};
  let datePeriod = [];
  for (let i=0; i<list.length; i++) {
    if (i == 0) {
      datePeriod.push(list[i].temp)
    } else if (list[i].datetime.substring(5, 15) == list[i-1].datetime.substring(5, 15)) {
      datePeriod.push(list[i].temp);
    } else if (list[i].datetime.substring(5, 15) != list[i-1].datetime.substring(5, 15)) {
      record[list[i].datetime.substring(5, 15)] = [...datePeriod];
      datePeriod = [list[i].temp];
    }
  }
  return record;
}

export function getHighestTempByDay(list) {
  return;
}
