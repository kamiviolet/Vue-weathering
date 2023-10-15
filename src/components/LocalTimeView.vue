<script setup>
import { onMounted, ref } from 'vue';
import { getLocalTime } from '../assets/utils';
const props = defineProps({
  offset: Number
})
const localTime = ref("");

onMounted(() => {
  getCurrTime()
})

function getCurrTime() {
  localTime.value = getLocalTime(props.offset)
  setTimeout(getCurrTime, 60000);
}
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