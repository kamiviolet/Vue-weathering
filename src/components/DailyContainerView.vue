<script setup>
import DailyView from '../components/DailyView.vue';

const props = defineProps({
  dailyRecord: {
    date: String,
    weather_range: [String],
    temp_range: [Number],
    pressure_range: [Number],
    most_frequent_weather: String,
    max_temp_formatted: String,
    min_temp_formatted: String
  },
})
</script>

<template>
  <div v-if="dailyRecord.length != 0" v-for="day of dailyRecord" class="daily_row">
    <DailyView>
      <template #day>
        {{ day.date.substring(0, 3) }}
      </template>
      <template #date>
        {{ day.date.substring(5, 10) }}
      </template>
      <template #weather>
        <img :src="day.most_frequent_weather" />
      </template>
      <template #highestTemp>
        <p class="max_temp">Max {{ day.max_temp_formatted }}</p>
      </template>
      <template #lowestTemp>
        <p class="min_temp">Min {{ day.min_temp_formatted }}</p>
      </template>
    </DailyView>
  </div>
</template>

<style scoped>
.daily_row {
  display: grid;
  width: 100%;
  height: auto;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  padding-inline: 1.25em;
  border-bottom: 2px solid #666666;
  align-self: center;
  place-items: center;
  @media (width > 480px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.daily_row:last-of-type {
  border-bottom: unset;
}

.daily_row img {
  width: 75px;
}

.max_temp,
.min_temp {
  margin-inline: .5em;
}
</style>