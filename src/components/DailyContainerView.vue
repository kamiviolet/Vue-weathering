<script setup>
import DailyView from '../components/DailyView.vue';
import { 
  getHighestTempByDay,
  getLowestTempByDay,
  getMostFrequentWeather,
} from '../assets/utils';
import { convertKevinToCelcius, convertKevinToFahrenheit } from '../assets/convert';

const props = defineProps({
  dailyRecord: {
    weather_range: [Number],
    temp_range: [Number]
  },
  displayTemp: String
})
</script>

<template>
  <div
    v-if="dailyRecord.length != 0"
    v-for="(day, date) of dailyRecord"
    class="daily_row"
    >
    <DailyView>
      <template #date>
        <p>{{ date.substring(0,5) }}</p>
      </template>
      <template #weather>
        <img :src=getMostFrequentWeather(day.weather_range) />
      </template>
      <template #highestTemp>
        {{
          displayTemp == 'celcius'?
          convertKevinToCelcius(getHighestTempByDay(day.temp_range)) + 'C°':
          convertKevinToFahrenheit(getHighestTempByDay(day.temp_range)) + 'F°'
        }}
      </template>
      <template #lowestTemp>
        {{
          displayTemp == 'celcius'?
          convertKevinToCelcius(getLowestTempByDay(day.temp_range)) + 'C°':
          convertKevinToFahrenheit(getLowestTempByDay(day.temp_range)) + + 'F°'
        }}
      </template>
    </DailyView>
  </div>
</template>

<style>
  .daily_row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-inline: 1em;
    background-color: skyblue;
    margin-block: 2em;
    height: 75px;
    border-radius: 16px;
    align-items: center;
  }
</style>