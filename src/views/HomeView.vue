<script setup>
import { ref, watch } from 'vue';
import { convertToDateString, convertKevinToCelcius, convertKevinToFahrenheit, getDailyRecord } from '../assets/utils';

const location = ref({});
const region = ref("")
const forecast = ref([]);
const dailyRecord = ref([]);
const gettingLocation = ref(false);
const displayTemp = ref("celcius");
const errorMsg = ref('');

gettingLocation.value = true;

const success = (position) => {
  gettingLocation.value = false;
  location.value = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  };
}

const error = (error) => {
  gettingLocation.value = false;
  errorMsg.value = error.message;
}

watch(location, () => {
  getForecast(location.value)
  .then(()=> dailyRecord.value = getDailyRecord(forecast.value))
})

if (("geolocation" in navigator)) {
  navigator.geolocation.getCurrentPosition(success, error);
}

async function getForecast(location) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.VITE_OPENWEATHER_API}`
  )
    .then((res) => res.json())
    .then((d) => {
      const record = d.list.map((e) => {
        return {
          datetime: convertToDateString(e.dt_txt),
          temp: e.main.temp,
          celcius: convertKevinToCelcius(e.main.temp),
          fahrenheit: convertKevinToFahrenheit(e.main.temp),
          feels_like_kelvins: e.main.feels_like,
          humidity: e.main.humidity,
          weather: e.weather[0].main,
        };
      });
      forecast.value.push(...record);
      region.value = d.city.name;
    })
    .catch((error) => console.warn(error));
}

</script>

<template>
  <main>
    <p class="warning">{{ errorMsg }}</p>
    <p>{{ region }}</p>
    <p>{{ displayTemp == "celcius"? forecast[0].celcius : forecast[0].fahrenheit }}</p>
    <p>{{ forecast[0].weather }}</p>
    <p v-if="displayTemp == 'celcius'">Feels like {{ convertKevinToCelcius(forecast[0].feels_like_kelvins) }}</p>
    <p v-else>Feels like {{ convertKevinToFahrenheit(forecast[0].feels_like_kelvins) }}</p>
    <!-- 
      <div v-if="forecast.length != 0" v-for="timeslot of forecast">
        {{ timeslot }}
      </div>
      <p>{{ dailyRecord }}</p>
    -->
  </main>
</template>

<style>
main {
  place-self: baseline;
}
</style>