<script setup>
const props = defineProps({
  text: String
})
</script>

<template>
  <footer>
    {{ text }}
  </footer>
</template>

<style>
footer {
  text-align: center;
  font-size: .85em;
}
</style>