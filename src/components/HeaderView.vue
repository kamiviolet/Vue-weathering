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
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>

<style scoped>
.greetings {
  text-align: center;
  margin-block: 1em;
  
  @media (min-width: 1024px) {
    .greetings {
      text-align: left;
    }
  }
}
</style>
