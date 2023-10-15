<script setup>
</script>

<template>
  <div class="day">
    <slot name="day"></slot>
  </div>
  <div class="date">
    <slot name="date"></slot>
  </div>
  <div class="weather">
    <slot name="weather"></slot>
  </div>
  <div class="temp_range">
    <slot name="highestTemp"></slot>
    <slot name="lowestTemp"></slot>
  </div>
</template>

<style scoped>
.day {
  justify-self: first baseline;

  font-weight: 700;
  font-size: 2em;
}

.date{
  justify-self: first baseline;
  grid-column: 1/2;
  grid-row: 2/3;
  @media (width > 480px) {
    grid-column: 2/3;
    grid-row: 1/2;
  }
}
.weather {
  justify-self: end;
  grid-row: 1/3;
  @media (width > 480px) {
    grid-column: 3/4;
    grid-row: 1/2;
  }
}

.temp_range {
  justify-self: end;
  grid-row: 1/3;
  @media (width > 480px) {
    grid-column: 4/5;
    grid-row: 1/2;
  }
}
</style>