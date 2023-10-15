<script setup>
import HourlyView from '../components/HourlyView.vue';

const props = defineProps({
  forecast: {
    temp: Number,
    temp_format: String,
    feels_like: String,
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
  v-for="(timeslot, index) of forecast.slice(0, 8)"
  class="hourly_card">
    <HourlyView>
      <template #time>
        <p>
          {{ timeslot.datetime.split(", ")[2] + ":00" }}
        </p>
      </template>
      <template #newday>
        <p v-if="index !== forecast.length">
          {{
            forecast[index].datetime.split(", ")[0] != forecast[index+1].datetime.split(", ")[0] ?
            forecast[index+1].datetime.substring(0, 7) :
            "--"
          }}
        </p>
      </template>
      <template #weather class="weather">
        <img :src="timeslot.weather.icon" :alt="timeslot.weather.main" />
      </template>
      <template #temp>
        <p class="temp">
          {{ timeslot.temp_format }}
        </p>
      </template>
    </HourlyView>
  </div>
</template>

<style scoped>
.hourly_card {
  display: grid;
  text-align: center;
  margin-block: .5em;
  padding: .25em;
  line-height: auto;
  grid-template-rows: 1fr 1fr 2fr 1fr;
  font-size: small;
  justify-content: center;

  .temp {
    font-weight: 700;
  }

  img {
    height: 45px;
    width: 45px;
  }

  @media (width > 768px) {
    margin-inline: 0.5em;
    grid-template-rows: 1fr 1fr 4fr 1fr;
    font-size: medium;
    padding: unset;

    &:first-of-type {
    margin-inline-start: 0;
  }
    &:last-of-type {
      margin-inline-end: 0;
    }

    img {
      height: 100px;
      width: 100px;
    }
  }
}

.weather {
  grid-row: 3/4;
}
</style>