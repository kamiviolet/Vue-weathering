<script setup>
import HourlyView from '../components/HourlyView.vue';
import { convertKevinToCelcius, convertKevinToFahrenheit } from '../assets/convert';

const props = defineProps({
  displayTemp: String,
  forecast: {
    temp: Number,
    feels_like: Number,
    humidity: Number,
    weather: {
      icon: String,
      main: String,
    },
    pressure: Number,
    wind: {
      speed: Number,
      deg: Number
    }
  }
})
</script>

<template>
  <div
    v-if="forecast.length != 0"
    v-for="timeslot of forecast.slice(0, 8)"
    class="hourly_card">
    <HourlyView>
      <template #time>
        <p>
          {{ timeslot.datetime.split(", ")[2] + ":00" }}
        </p>
      </template>
      <template #newday>
        <p>
          {{
            timeslot.datetime.split(", ")[2] == "00" ?
            timeslot.datetime.split(", ")[1].substring(0, 5) :
            ""
          }}
        </p>
      </template>
      <template #weather class="weather">
        <img :src=timeslot.weather.icon :alt=timeslot.weather.main />
      </template>
      <template #temp>
        <p>
          {{
          displayTemp == 'celcius'?
          convertKevinToCelcius(timeslot.temp) + 'C°' :
          convertKevinToFahrenheit(timeslot.temp) + 'F°'
          }}
        </p>
      </template>
    </HourlyView>
  </div>
</template>

<style>
.hourly_card {
  background-color: lightblue;
  border-radius: 16px;
  width: auto;
  height: 175px;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 1fr 4fr 1fr;
  margin-inline: .75em;
  padding-block: .25em;
}

.weather {
  grid-row: 3/4;
}
</style>