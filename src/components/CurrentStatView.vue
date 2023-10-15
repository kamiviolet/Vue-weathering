<script setup>
import LocalTimeView from './LocalTimeView.vue';
import { convertDegToDirection } from '../assets/convert';

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
  humidity: Number,
  pressure: Number,
  wind: {
    speed: Number,
    deg: Number
  }
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
      <p class="value">{{ temp_format }}</p>
      <p>
        <span class="label">Feels like </span>
        <span class="value">{{ feels_like }}</span>
      </p>
    </div>
    <div class="current_other_stat">
    <div class="sub_stat">
      <img class="icon" src="/humidity.svg">
      <span>{{ humidity }}%</span></div>
    <div class="sub_stat">
      <img class="icon" src="/pressure.svg">
      <span>{{ pressure }} mmHg</span>
    </div>
    <div class="sub_stat">
      <img class="icon" src="/wind.svg">
      <p>
        <span>{{ wind.speed }} m/s </span>
        <span>{{ convertDegToDirection(wind.deg) }}</span>
      </p>
    </div>
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
  background: #cacacab0;
  border-radius: 12px;
  color: black;

  h1 {
    font-size: 2.85em;
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
    
  p, span {
      font-weight: 700;
    }

  p {
    font-size: 1.25em;
  }

  .current_other_stat {
    grid-column-start: 1;
    grid-column-end: 3;
    margin-block: 1em;
    text-align: left;
    width: 100%;
    align-self: center;
    display: flex;
    justify-content: space-around;
  }

.sub_stat {
  display: grid;
  grid-template-columns: 45px auto;
  margin-block: 1em;
  align-items: center;

  span, p {
    font-size: .85em;
    font-weight: 600;
  }
}

.icon {
  width: 35px;
  height: auto;
}

  @media (width > 768px) {
    grid-template-columns: auto auto auto auto;
    grid-template-rows: 1fr 1fr;
    padding: 1em 2em;

    .location {
      grid-column: 1/2;
      grid-row: 1/3;
    }

    .weather  {
      grid-column: 2/3;
      grid-row: 1/3;
    }

    .temp {
      grid-column: 3/4;
      grid-row: 1/3;

      span {
        font-size: .75em;
        font-weight: 700;
      }
    }

    .current_other_stat {
      grid-column: 4/5;
      grid-row: 1/3;
      display: block;
      width: max-content;
    }

    .temp {
      font-size: 1.5em;
    }


  }
}

</style>