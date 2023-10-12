<script setup>
import { onMounted, reactive, ref, watch, computed, onBeforeMount } from 'vue';
import {
  getDailyRecord,
  getForecastByCoords,
  getForecastByCity,
  getSuggestedDropDown,
  formatTemp } from '../assets/utils';
import CurrentStatView from '../components/CurrentStatView.vue';
import CurrentOtherStatView from '../components/CurrentOtherStatView.vue';
import DailyContainerView from '../components/DailyContainerView.vue';
import HourlyContainerView from '../components/HourlyContainerView.vue'
import TempChart from '../components/charts/TempChart.vue'
import SearchBoxView from '../components/SearchBoxView.vue';
import DisplayToggle from '../components/DisplayToggle.vue';
import Background from '../components/Background.vue';

const location = ref({});
const customRegion = ref("");
const forecast = reactive({
  region: {
    name: "",
    country: "",
    timezone: 0
  },
  totalList: [],
  dailyRecord: {
    weather_range: [],
    temp_range: [],
    most_frequent_weather: "",
    max_temp_formatted: "",
    min_temp_formatted: ""
  },
  displayTemp: 'celcius',
})
const searchTerm = ref('');
const suggestedCities = ref([]);
const errorMsg = ref('');
const loading = ref(false);

onBeforeMount(() => {
  loading.value = true;
})

onMounted(() => {
  if (("geolocation" in navigator)) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loading.value = false;

        location.value = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        };
      }, 
      (error) => {
        errorMsg.value = error.message;
      }
  )};
  setCustomRegion();
})

watch(location, () => {
  loading.value = true;

  getForecastByCoords(location.value)
    .then(({city, record}) => {
      loading.value = false;

      forecast.totalList = record.map((e) => ({
        ...e,
        temp_format: computed(() => formatTemp(e.temp, forecast.displayTemp)),
        feels_like: computed(() => formatTemp(e.feels_like, forecast.displayTemp)),
      }));
      forecast.region = {
        name: city.name,
        country: city.country,
        timezone: city.timezone
      };
    })
    .then(()=>forecast.dailyRecord = getDailyRecord(forecast.totalList))
})

watch(customRegion, ()=>{
  loading.value = true;

  getForecastByCity(customRegion.value)
    .then(({city, record}) => {
      loading.value = false;

      forecast.totalList = record.map((e) => ({
        ...e,
        temp_format: computed(() => formatTemp(e.temp, forecast.displayTemp)),
        feels_like: computed(() => formatTemp(e.feels_like, forecast.displayTemp)),
      }));
      forecast.region = {
        name: city.name,
        country: city.country,
        timezone: city.timezone
      };
    })
      .then(()=>forecast.dailyRecord = getDailyRecord(forecast.totalList))
})

watch(searchTerm, ()=>{
  getSuggestedDropDown(searchTerm.value)
  .then(d => {
    if (d) {
      suggestedCities.value = d;
    }
  })
})

const formattedDailyRecord = computed(() => {
  return Object.fromEntries(
    Object.entries(forecast.dailyRecord).map(([k,v]) => {
      v = {
        ...v,
        max_temp_formatted: formatTemp(
          Math.max(...v?.temp_range), forecast.displayTemp),
        min_temp_formatted: formatTemp(
          Math.min(...v?.temp_range), forecast.displayTemp),
      }
      return [k,v];
    })
  )
})

function setCustomRegion() {
  customRegion.value = searchTerm.value
  searchTerm.value = ""
}
</script>

<template>
  <Background
  :currentTime="parseInt(forecast.totalList[0].datetime.split(', ')[2])" />
  <h2 v-if="loading" class="loading">loading...</h2>
  <main v-else>
    <p class="warning">{{ errorMsg }}</p>
    <section class="setting">
      <DisplayToggle
      :displayTemp="forecast.displayTemp"
      @toggle="(display)=>forecast.displayTemp=display" />
      <SearchBoxView>
        <form
        @submit.prevent="setCustomRegion"
        class="search_form"
        >
          <input
            v-model="searchTerm"
            class="textbox"
            placeholder="Please enter a city name"
          />
          <button
            type="submit"
            class="submit_btn"
            >
            &#x1F50E
          </button>
        </form>
      </SearchBoxView>
    </section>

    <CurrentStatView
      v-if="location"
      :region="forecast.region"
      :temp_format="forecast.totalList[0].temp_format"
      :weather="forecast.totalList[0].weather"
      :feels_like="forecast.totalList[0].feels_like"
      class="current" />
    <div class="summary">
      <CurrentOtherStatView
        v-if="forecast"
        :humidity="forecast.totalList[0].humidity"
        :pressure="forecast.totalList[0].pressure"
        :wind="forecast.totalList[0].wind" />
      <div class="hourly_wrapper">
        <div class="hourly_list">
        <HourlyContainerView
          :forecast="forecast.totalList" />
        </div>
      </div>
    </div>
    <TempChart
    :forecast="forecast.totalList.slice(0, 8)"
    :displayTemp="forecast.displayTemp"/>
    <div class="daily_list">
      <h3>5 day forecast</h3>
      <DailyContainerView
        :dailyRecord="formattedDailyRecord" />
    </div>
  </main>
</template>

<style>
main {
  padding-block: 1em;
  place-self: baseline;
  text-align: center;
  width: 100%;
  position: relative;
  padding-inline: 0.75em;
  @media (min-width: 900px) {
    text-align: left;
  }
}

.loading {
  font-size: 4em;
  text-align: center;
}

.setting {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  transform: translateY(-6.5em);
  padding-inline: .75em;
}

.search_form {
  display: grid;
  width: 200px;
  height: 55px;
  grid-template-columns: 150px auto;
  justify-items: first baseline;
  align-items: center;
  font-size: .9em;
  button {
    justify-self: last baseline;
  }
}

.textbox {
  max-width: 90%;
  width:200px;
  border: unset;
  padding: .25em;
  border-bottom: 1px black solid;
}

.submit_btn {
  max-width: 90%;
  width:50px;
  padding: .25em;
  margin-block: 1.5em;
  background-color: whitesmoke;
  border-radius: 16px;

  @media (width> 1024px) {
    margin: 0;
  }
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
  font-weight: 600;
  color: black;
}

h3 {
  text-transform: capitalize;
  font-weight: 600;
  font-size: 1.5em;
  margin-block: 1em;
}

.hourly_list {
  grid-column-start: 2;
  grid-column-end: 3;
  display: flex;
  margin-block: 1em;
  color: black;
}
</style>