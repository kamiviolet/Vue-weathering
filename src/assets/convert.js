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