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
    <p>{{ humidity }}%</p>
    <p>{{ pressure }} mmHg</p>
    <p>
      <span>{{ wind.speed }} m/s </span>
      <span>{{ convertDegToDirection(wind.deg) }}</span>
    </p>
  </div>
</template>