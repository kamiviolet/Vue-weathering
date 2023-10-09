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
    <div>
      <h1>{{ region }}</h1>
      <span></span>
    </div>
    <div>
      <p>
        {{ temp }}
      </p>
      <img :src=weather.icon :alt=weather.main />
      <p>
        Feels like {{ feels_like }}
      </p>
    </div>
  </div>
</template>

<style>
.current_stat {
  margin-block: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
  justify-self: center;
}

h1 {
  font-size: 3em;
  font-weight: 700;
  justify-self: first baseline;
  padding-inline: 1em;
  letter-spacing: 1px;
}
</style>