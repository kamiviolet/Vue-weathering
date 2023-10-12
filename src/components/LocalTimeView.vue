<script setup>
import { onMounted, ref } from 'vue';
import { normaliseConvertedHours, formatTime, convertTimezoneToHours } from '../assets/convert';
const props = defineProps({
  timezone: Number
})
const offset = ref(null);
const localTime = ref('');


function getLocalTime() {
  const currentTime = new Date();
  const offsetHour = convertTimezoneToHours(props.timezone);

  offset.value = offsetHour;

  const UTCHour = currentTime.getUTCHours();
  const localHour = normaliseConvertedHours(UTCHour + offsetHour)[1];

  const minutes = currentTime.getUTCMinutes();

  localTime.value = formatTime(localHour, minutes);
  setTimeout(getLocalTime, 1000);
}
onMounted(() => {
  getLocalTime();
})
</script>

<template>
  <div class="clocks">
    <p>{{ localTime }} (UTC {{ offset > 0? "+" + offset : offset }})</p>
  </div>
</template>

<style>
.clocks {
  width: 100%;
  margin-block-start: 1em;
  text-align: center;
}
</style>