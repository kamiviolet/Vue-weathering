<script setup>
import { onMounted, reactive, ref, watch, computed, onBeforeMount } from 'vue';
import {
  getDailyRecord,
  getForecastByCoords,
  getForecastByCity,
  getSuggestedDropDown,
  formatTemp
} from '../assets/utils';
import CurrentStatView from '../components/CurrentStatView.vue';
import DailyContainerView from '../components/DailyContainerView.vue';
import HourlyContainerView from '../components/HourlyContainerView.vue'
import HourlyChart from '../components/charts/HourlyChart.vue'
import SearchBoxView from '../components/SearchBoxView.vue';
import DisplayToggle from '../components/DisplayToggle.vue';
import Background from '../components/Background.vue';
import DailyChart from '../components/charts/DailyChart.vue';
import { convertTimezoneToHours } from '../assets/convert';

const location = ref({});
const customRegion = ref("");
const forecast = reactive({
  region: {
    name: "",
    country: "",
    timezone: 0,
    offset: null
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
        loading.value = false;
      }
    )
  } else {
    loading.value = false;
  }
  setCustomRegion();
})

watch(location, () => {
  loading.value = true;

  getForecastByCoords(location.value)
    .then(({ city, record }) => {
      loading.value = false;

      forecast.totalList = record.map((e) => ({
        ...e,
        temp_format: computed(() => formatTemp(e.temp, forecast.displayTemp)),
        feels_like: computed(() => formatTemp(e.feels_like, forecast.displayTemp)),
      }));
      forecast.region = {
        name: city.name,
        country: city.country,
        timezone: city.timezone,
        offset: computed(() => convertTimezoneToHours(city.timezone)),
      };
    })
    .then(() => forecast.dailyRecord = getDailyRecord(forecast.totalList))
})

watch(customRegion, () => {
  loading.value = true;

  getForecastByCity(customRegion.value)
    .then(({ city, record }) => {
      loading.value = false;

      forecast.totalList = record.map((e) => ({
        ...e,
        temp_format: computed(() => formatTemp(e.temp, forecast.displayTemp)),
        feels_like: computed(() => formatTemp(e.feels_like, forecast.displayTemp)),
      }));
      forecast.region = {
        name: city.name,
        country: city.country,
        timezone: city.timezone,
        offset: computed(() => convertTimezoneToHours(city.timezone)),
      };
    })
    .then(() => forecast.dailyRecord = getDailyRecord(forecast.totalList))
})

watch(searchTerm, () => {
  getSuggestedDropDown(searchTerm.value)
    .then(d => {
      if (d) {
        suggestedCities.value = d;
      }
    })
})

const formattedDailyRecord = computed(() => {
  return Object.entries(forecast.dailyRecord).map(([k, v]) => {
      v = {
        ...v,
        date: k,
        max_temp_formatted: formatTemp(
          Math.max(...v?.temp_range), forecast.displayTemp),
        min_temp_formatted: formatTemp(
          Math.min(...v?.temp_range), forecast.displayTemp),
      }
      return v;
    })
})

function setCustomRegion() {
  customRegion.value = searchTerm.value
  searchTerm.value = ""
}
</script>

<template>
  <h2 v-if="loading" class="loading">loading...</h2>
  <Background v-if="forecast.region.name" :currentTime="parseInt(forecast.totalList[0].datetime.split(', ')[2])" />
  <main v-if="!loading">
    <p class="warning">{{ errorMsg }}</p>
    <section class="setting">
      <DisplayToggle :displayTemp="forecast.displayTemp" @toggle="(display) => forecast.displayTemp = display" />
      <SearchBoxView>
        <form @submit.prevent="setCustomRegion" class="search_form">
          <input v-model="searchTerm" class="textbox" placeholder="Please enter a city name" />
          <button type="submit" class="submit_btn">
            &#x1F50E
          </button>
        </form>
      </SearchBoxView>
    </section>
    <section v-if="forecast.region.name">
      <CurrentStatView :region="forecast.region" :temp_format="forecast.totalList[0].temp_format"
        :weather="forecast.totalList[0].weather" :feels_like="forecast.totalList[0].feels_like"
        :humidity="forecast.totalList[0].humidity" :pressure="forecast.totalList[0].pressure"
        :wind="forecast.totalList[0].wind" class="current" />
      <div class="hourly_wrapper">
        <div class="hourly_list">
          <HourlyContainerView :forecast="forecast.totalList" />
        </div>
      </div>
      <HourlyChart :forecast="forecast.totalList.slice(0, 8)" :displayTemp="forecast.displayTemp" />
      <h3>4/5 Day Forecast Chart</h3>
      <section class="daily_forecast">
        <div class="daily_list">
          <DailyContainerView :dailyRecord="formattedDailyRecord" />
        </div>
        <DailyChart :dailyRecord="formattedDailyRecord"  />
      </section>
    </section>
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

.warning {
  margin-block-end: 2em;
}

.loading {
  font-size: 4em;
  text-align: center;
}

.setting {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  align-items: end;
  justify-items: last baseline;
  transform: translateY(-6.5em);
  padding-inline: .75em;
  height: 5em;
  gap: .75em
}

.search_form {
  display: grid;
  width: 200px;
  justify-self: self-end;
  grid-template-columns: 150px auto;
  justify-items: first baseline;
  align-items: center;
  font-size: .9em;
}

.search_form button {
  justify-self: last baseline;
}

.textbox {
  max-width: 90%;
  width: 200px;
  border: unset;
  padding: .25em;
  border-bottom: 1px black solid;
}

.submit_btn {
  max-width: 90%;
  width: 50px;
  padding: .25em;
  background-color: whitesmoke;
  border-radius: 16px;

  @media (width> 1024px) {
    margin: 0;
  }
}

.hourly_wrapper {
  width: auto;
  overflow: auto;
}

.daily_forecast {
  display: grid;
  place-items: center;
  gap: 2em;
}

.daily_list {
  width: 100%;
  margin-block: 1em;
  font-weight: 600;
  color: black;
  background-color: #cacacab0;
  border-radius: 16px;
}

h3 {
  text-transform: capitalize;
  font-weight: 600;
  font-size: 1.5em;
  margin-block: 1em;
}

.hourly_list {
  display: flex;
  margin-block: 1em;
  color: black;
  justify-content: space-between;
  background: #cacacab0;
  border-radius: 16px;
  min-width: max-content;
  width: 100%;
}
</style>