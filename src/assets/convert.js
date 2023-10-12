export function convertKevinToCelcius(deg) {
  return Math.round(+((deg - 273).toFixed(2)));
}

export function convertKevinToFahrenheit(deg) {
  return Math.round(+(1.8 * +(deg - 273) + 32).toFixed(2));
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

export function convertToLocalTime(str, timezoneOffset) {
  const localTime = str.split(" ")
  let date = localTime[0];
  let time = localTime[1];
  time = +time.substring(0,2) + convertTimezoneToHours(timezoneOffset);
  let [normalisedDate, normalisedTime] = normaliseConvertedHours(time, date);
  normalisedTime += ":00:00"

  return [normalisedDate, normalisedTime].join(" ")
}

export function convertTimezoneToHours(second) {
  return second / 60 /60
}

export function normaliseConvertedHours(hour, date="1970-10-10") {
  let [year, month, day] = date.split("-")
  if (hour >= 24) {
    if (hour > 24) {
      hour -= 24;
    } else {
      hour = 0;
    }
    day = +day + 1;
  } else if (hour < 0) {
    hour = 24 + hour;
    day = +day - 1;
  } 
  return [[year, month, day].join("-"), hour]
}

export function convertDegToDirection(deg) {
  let direction = "";
  if (deg > 336 || deg <= 23) direction = "N";
  if (deg > 24 || deg <= 68) direction = "NE";
  if (deg > 69 || deg <= 113) direction = "E";
  if (deg > 114 || deg <= 158) direction = "SE";
  if (deg > 159 || deg <= 203) direction = "S";
  if (deg > 204 || deg <= 248) direction = "SW";
  if (deg > 249 || deg <= 293) direction = "W";
  if (deg > 294 || deg <= 336) direction = "SW";
  return direction;
}

export function formatTime(hour, minute) {
  let session = "";
  
  if (hour > 12) {
    hour -= 12;
    session = "PM";
  } else if (hour == 12) {
    session = "PM";
  } else {
    session = "AM";
  }
  
  hour = (hour < 10)? "0" + hour: hour;
  minute = (minute < 10)? "0" + minute: minute;

  return `${hour}: ${minute} ${session}`;
}