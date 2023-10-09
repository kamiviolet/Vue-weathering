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
      <template #day>
        {{ date.substring(0,3) }}
      </template>
      <template #date>
        {{ date.substring(5,10) }}
      </template>
      <template #weather>
        <img :src=getMostFrequentWeather(day.weather_range) />
      </template>
      <template #highestTemp>
        <p class="max_temp">Max 
        {{
          displayTemp == 'celcius'?
          convertKevinToCelcius(getHighestTempByDay(day.temp_range)) + 'C°':
          convertKevinToFahrenheit(getHighestTempByDay(day.temp_range)) + 'F°'
        }}
        </p>
      </template>
      <template #lowestTemp>
        <p class="min_temp">Min 
        {{
          displayTemp == 'celcius'?
          convertKevinToCelcius(getLowestTempByDay(day.temp_range)) + 'C°':
          convertKevinToFahrenheit(getLowestTempByDay(day.temp_range)) + + 'F°'
        }}
        </p>
      </template>
    </DailyView>
  </div>
</template>

<style>
  .daily_row {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    padding-inline: 1.25em;
    background-color: rgba(135, 206, 235, 0.65);
    margin-block: 2em;
    border-radius: 16px;
    align-items: center;
    text-align: center;

    @media (width > 900px) {
      grid-template-columns: 1fr 1fr 2fr 1fr;
      grid-template-rows: auto;
      text-align: left;

    }
  }

.max_temp, .min_temp {
  margin-inline: .5em;
  @media (width > 480px) {
    display: inline;
  }
}
</style>