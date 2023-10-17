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
    <h2>{{ msg }}</h2>
  </div>
</template>

<style scoped>
.greetings {
  text-align: left;
  background-color: rgba(240, 248, 255, 0.75);
  border-radius: 0 16px 16px 0;
  color: black;
  width:min-content;
  padding-inline: 1em;
}
</style>
