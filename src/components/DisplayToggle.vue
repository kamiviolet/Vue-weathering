<script setup>
import { ref } from 'vue';

const props = defineProps({
  displayTemp: String
})

const emit = defineEmits(["toggle"])
const display = ref(props.displayTemp)
emit("toggle", display)

function toggleDisplay() {
  display.value = display.value == "celcius"? "frahrenheit" : "celcius"
}
</script>

<template>
  <div class="display_switch_wrapper">
    <button
    class="display_toggle"
    @click.prevent="toggleDisplay"
    >
      {{ display == "celcius" ? "F°" : "C°"}}
    </button>
  </div>
</template>

<style>
.display_switch_wrapper {
    display: flex;
    align-items: center;
    width: 250px;
    justify-content: end;
}
.display_stat {
  text-transform: capitalize;
}

.display_toggle {
  background: rgba(255, 226, 132, 0.89);
  padding: 4px 8px;
  border-radius: 12px;
}
</style>