<script setup>
import LocalTimeView from './LocalTimeView.vue';

const props = defineProps({
  region: {
    name: String,
    city: String,
    timezone: Number
  },
  temp_format: String,
  weather: {
    icon: String,
    main: String
  },
  feels_like: String,
})
</script>

<template>
  <div class="current_stat">
    <div class="location">
      <h1>{{ region.name }}</h1>
      <span>{{ region.country }}</span>
      <LocalTimeView :timezone="region.timezone"/>
    </div>
    <div class="weather">
      <img :src=weather.icon :alt=weather.main />
    </div>
    <div class="temp">
      <p class="label">Temperature</p>
      <p class="value">{{ temp_format }}</p>
    </div>
    <div class="feels_like">
      <p class="label">Feels like</p>
      <p class="value">{{ feels_like }}</p>
    </div>
  </div>
</template>

<style scoped>
.current_stat {
  margin-block: 1em;
  display: grid;
  grid-template-columns: auto auto;
  place-items: center;
  text-align: center;
  width: 100%;
  justify-self: center;
  padding-inline: .5em;


  h1 {
    font-size: 2.75em;
    font-weight: 700;
    justify-self: first baseline;
    letter-spacing: 1px;
    grid-row: 1/3;
    grid-column: 1/2;
  }

  .location {
    grid-row: 1/4;
  }

  .temp, .feels_like, .weather {
    grid-column: 2/3;
  }

  .temp > .label {
    display: none;
  }

  .feels_like > p {
      display: inline;
      margin-inline: .25em;
    }
    
  p {
      font-weight: 700;
      font-size: 1.25em;
    }

  @media (width > 640px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .location, .temp, .feels_like, .weather {
      grid-column: unset;
      grid-row: unset;
    }

    .temp > .label {
      display: block;
    }

    .feels_like > p {
      display: block;
    }
  }
}

</style>