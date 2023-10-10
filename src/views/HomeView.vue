<script setup>
import { onMounted, onUpdated, ref, watch } from 'vue';
import { convertKevinToCelcius, convertKevinToFahrenheit } from '../assets/convert';
import { getDailyRecord, getForecastByCoords, getForecastByCity, getSuggestedDropDown } from '../assets/utils';
import CurrentStatView from '../components/CurrentStatView.vue';
import CurrentOtherStatView from '../components/CurrentOtherStatView.vue';
import DailyContainerView from '../components/DailyContainerView.vue';
import HourlyContainerView from '../components/HourlyContainerView.vue'
import TempChart from '../components/charts/TempChart.vue'
import SearchBoxView from '../components/SearchBoxView.vue';
import DisplayToggle from '../components/DisplayToggle.vue';

const location = ref({});
const region = ref('')
const forecast = ref([]);
const dailyRecord = ref([]);
const displayTemp = ref("frahrenheit");
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
      region.value = [city.name, city.country, city.timezone];
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

onUpdated(() => console.log("update" + displayTemp))

onMounted(() => {
  if (("geolocation" in navigator)) {
    navigator.geolocation.getCurrentPosition(success, error);
  };
  getCustomRegion();
})

function getCustomRegion() {
  if (searchTerm.value) {
    return getForecastByCity(searchTerm.value)
      .then(({city, record}) => {
          forecast.value = record;
          region.value = [city.name, city.country, city.timezone];
        })
      .then(()=>dailyRecord.value = getDailyRecord(forecast.value))
  }
}

</script>

<template>
  <main>
    <p class="warning">{{ errorMsg }}</p>
    <section class="setting">
      <DisplayToggle :displayTemp="displayTemp" @toggle="(display)=>displayTemp=display" />
      <SearchBoxView>
        <form
        @submit.prevent="getCustomRegion"
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
    <TempChart :forecast="forecast.slice(0,8).map(f=>({time: f.datetime.substring(5), temp: f.temp}))"/>
    <div class="daily_list">
      <h3>5 day forecast</h3>
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

  @media (min-width: 900px) {
    text-align: left;
  }
}
.setting {
  position: absolute;
  top: 0;
  right: 0;
  margin-block: 1.25em;
  margin-inline-end: 1em;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.search_form {
  display: grid;
  width: 200px;
  margin-block: 1.5em;
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
}
</style>