<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderView from './components/HeaderView.vue';
import FooterView from './components/FooterView.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderView msg="Weathering" />
      <nav>
        <RouterLink to="/">Main</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <!-- <RouterLink to="/favourite">Favourite</RouterLink> -->
      </nav>
    </div>
  </header>
  <RouterView />
  <FooterView text="Created and designed by Kami Lam, 2023" />
</template>

<style scoped>
header {
  line-height: 1.5;
  width: 100%;
  padding-block: .75em;
  color: gray;
  font-weight: 700;
}

nav {
  width: 100%;
  text-align: left;
  margin-top: .5em;
  font-size: 1rem;
  color: black;
  background: rgba(255, 255, 255, 0.5);
  padding: .75em 0;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
