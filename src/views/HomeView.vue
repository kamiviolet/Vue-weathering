<script setup>
import { onMounted, ref, watch } from 'vue';
import { convertKevinToCelcius, convertKevinToFahrenheit } from '../assets/convert';
import { getDailyRecord, getForecastByCoords, getForecastByCity, getSuggestedDropDown } from '../assets/utils';
import CurrentStatView from '../components/CurrentStatView.vue';
import CurrentOtherStatView from '../components/CurrentOtherStatView.vue';
import DailyContainerView from '../components/DailyContainerView.vue';
import HourlyContainerView from '../components/HourlyContainerView.vue'
import SearchBoxView from '../components/SearchBoxView.vue';

const location = ref({});
const region = ref('')
const forecast = ref([]);
const dailyRecord = ref([]);
const displayTemp = ref("celcius");
const searchTerm = ref('');
const suggestedCities = ref([]);

const errorMsg = ref('');

const success = (position) => {
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
  getForecastByCoords(location.value)
    .then(({city, record}) => {
      forecast.value = record;
      region.value = city.name;
    })
    .then(()=>dailyRecord.value = getDailyRecord(forecast.value))
})

watch(searchTerm, ()=>{
  getSuggestedDropDown(searchTerm.value)
  .then(d => {
    if (d) {
      suggestedCities.value = d;
    }
  })
})

onMounted(() => {
  if (("geolocation" in navigator)) {
    navigator.geolocation.getCurrentPosition(success, error);
  };
  getCustomRegion();
})

function getCustomRegion() {
  return getForecastByCity(searchTerm.value)
  .then(({city, record}) => {
      forecast.value = record;
      region.value = city.name;
    })
  .then(()=>dailyRecord.value = getDailyRecord(forecast.value))
}

</script>

<template>
  <main>
    <p class="warning">{{ errorMsg }}</p>
    <SearchBoxView>
      <form
      @submit.prevent="getCustomRegion"
      class="searchbox"
      >
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Please enter the city name">
        <select
          v-model="searchTerm"
          class="suggestion_dropdown">
        <option
          v-for="city of suggestedCities">
          <span>{{ city.name }}</span>
        </option>
        </select>
        <button type="submit">Search</button>
      </form>
    </SearchBoxView>
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
        :wind="forecast[0].wind" />
      <div class="hourly_wrapper">
        <div class="hourly_list">
        <HourlyContainerView
          :forecast="forecast"
          :displayTemp="displayTemp" />
        </div>
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

  @media (min-width: 900px) {
    text-align: left;
  }
}

h2 {
  padding-block: .5em;
}

.summary {
  display: grid;
  grid-template-columns: minmax(50px, auto) auto;
  align-self: baseline;
  overflow: hidden;
  gap: 1em;
}

.hourly_wrapper {
  width: auto;
  overflow-x: scroll;
}

.daily_list {
  width: 100%;
  margin-block: 1em;
}

.hourly_list {
  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  margin-block: 1em;
}
</style>