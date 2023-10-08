<template>
  <main class="about">
    <h2>About Weathering (Vue)</h2>
    <p>
      Weathering is a web application free for the public to provide regional weather forecast supported by OpenAPI. Users can authorize the access right of GPS to get the information for the current geographical location or type in any places in the search box which provides also keyword suggestions. Display can be switched between Celcius and Fahrenheit. The entire application is built with Vue3.
    </p>
  </main>
</template>

<style scoped>

.about {
  text-align: left;

  @media (min-width: 1024px) {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: start;
  }
}
</style>
