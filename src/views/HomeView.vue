<script setup>
import { ref, watch } from 'vue';
import { convertKevinToCelcius, convertKevinToFahrenheit, convertToDateString } from '../assets/convert';
import { getDailyRecord } from '../assets/utils';
import CurrentStatView from '../components/CurrentStatView.vue';
import CurrentOtherStatView from '../components/CurrentOtherStatView.vue';
import DailyContainerView from '../components/DailyContainerView.vue';
import HourlyContainerView from '../components/HourlyContainerView.vue'

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
  localStorage.setItem("location", location.value)
}

const error = (error) => {
  gettingLocation.value = false;
  errorMsg.value = error.message;
}

watch(location, () => {
  getForecast(location.value)
    .then(() => dailyRecord.value = getDailyRecord(forecast.value))
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
      forecast.value.push(...record);
      region.value = d.city.name;
    })
    .catch((error) => console.warn(error));
}

</script>

<template>
  <main>
    <p class="warning">{{ errorMsg }}</p>
    <CurrentStatView
      v-if="forecast"
      :region="region"
      :temp="displayTemp == 'celcius' ?
      convertKevinToCelcius(forecast[0].temp) + 'C°' :
      convertKevinToFahrenheit(forecast[0].temp) + 'F°'"
      :weather="forecast[0].weather"
      :feels_like="displayTemp == 'celcius' ?
      convertKevinToCelcius(forecast[0].feels_like) + 'C°' :
      convertKevinToFahrenheit(forecast[0].feels_like) + 'F°'"
      :display="displayTemp" class="current" />
    <div class="summary">
      <CurrentOtherStatView
        v-if="forecast"
        :humidity="forecast[0].humidity"
        :pressure="forecast[0].pressure"
        :wind="forecast[0].wind"
        class="current_other_stat" />
      <div class="hourly_list">
        <HourlyContainerView
          :forecast="forecast"
          :displayTemp="displayTemp" />
      </div>
    </div>
    <div class="daily_list">
      <DailyContainerView
        :dailyRecord="dailyRecord"
        :displayTemp="displayTemp" />
    </div>
  </main>
</template>

<style>
main {
  padding-block: 1em;
  place-self: baseline;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
}

h2 {
  padding-block: .5em;
}

.summary {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-self: baseline;

  @media (width > 1024px) {
    grid-template-columns: 1fr 3fr;
  }
}

.current_other_stat {
  grid-column-start: 1;
  grid-column-end: 2;
  margin-block: 1em;
  text-align: left;
  width: 100px;
}

.daily_list {
  width: 80%;
  margin-block: 1em;
}

.hourly_list {
  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  margin-block: 1em;
}
</style>