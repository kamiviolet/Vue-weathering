<script setup>
const props = defineProps({
  region: String,
  temp: String,
  weather: {
    icon: String,
    main: String
  },
  feels_like: String,
  display: String,
})
</script>

<template>
  <div class="current_stat">
    <h2>{{ region }}</h2>
    <p>
      {{ temp }}
    </p>
    <img :src=weather.icon :alt=weather.main />
    <p>
      Feels like {{ feels_like }}
    </p>
  </div>
</template>

<style>
.current_stat {
  margin-block: 1em;
  text-align: center;
}
</style>