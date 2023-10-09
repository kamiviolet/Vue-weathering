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
  text-align: center;
  margin-block: 1em;
  
  @media (width> 900px) {
    text-align: left;
  }
}
</style>
