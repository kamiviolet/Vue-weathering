<script setup>

const props = defineProps({
  currentTime: Number,
})
</script>

<template>
  <div v-if="currentTime > 18 || currentTime <= 5" class="background night">
  </div>
  <div v-else-if="currentTime > 5 && currentTime <= 8" class="background sunrise">
  </div>
  <div v-else-if="currentTime > 15 && currentTime <= 18" class="background sunset">
  </div>
  <div v-else class="background light">
  </div>
</template>

<style>
  .background {
    width: 100vw;
    min-height: 100vh;
    height: 100%;
    position:absolute;
    top: 0;
    left: 0;
    z-index: -5;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(2px);
  }

  .light {
    background-image: url('/omar-ram-day-unsplash.jpg');
  }
  .sunrise {
    background-image: url('/paul-berthelon-bravo-sunrise-unsplash.jpg');
  }
  .night {
    background-image: url('/gregoire-jeanneau-night-unsplash.jpg');
  }
  .sunset {
    background-image: url('/dewang-gupta-sunset-unsplash.jpg');
  }

  .night ~ main {
    color: whitesmoke;

    h3 {
      color: whitesmoke;
    }
  }
  
  main {
    color: black;
  }
</style>