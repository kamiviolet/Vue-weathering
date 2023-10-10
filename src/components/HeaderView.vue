<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h2 class="green">{{ msg }}</h2>
  </div>
</template>

<style scoped>
.greetings {
  margin-block: 1em;
  text-align: left;
}
</style>
