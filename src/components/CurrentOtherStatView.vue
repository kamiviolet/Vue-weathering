<script setup>
import { convertDegToDirection } from '../assets/convert';
const props = defineProps({
  humidity: Number,
  pressure: Number,
  wind: {
    speed: Number,
    deg: Number
  }
})
</script>

<template>
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
</template>

<style>
.current_other_stat {
  grid-column-start: 1;
  grid-column-end: 2;
  margin-block: 1em;
  text-align: left;
  width: 100%;
  align-self: center;
}

.sub_stat {
  display: grid;
  grid-template-columns: 45px auto;
  margin-block: 1em;
  align-items: center;
}

.icon {
  width: 35px;
  height: auto;
}
</style>