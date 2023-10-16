<template>
  <main class="about">
    <h2>About Weathering (Vue)</h2>
    <p>
      Weathering with vue is a web application free for the public to provide regional weather forecast supported by OpenAPI.</p>
    <p>In weathering with vue, users can authorize the access right of GPS to get the information for the current geographical location or type in any places in the search box which provides also keyword suggestions. Display can be switched between Celcius and Fahrenheit. The entire application is built with Vue3.
    </p>
    <p>
      For developers, weathering with vue is an open source project and you are welcomed to visit the repository in Github and raise any issues :)
    </p>
  </main>
</template>

<style scoped>

.about {
  text-align: left;

  h2, p {
    padding-bottom: 1.5em;
  }


  @media (min-width: 1024px) {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: start;
  }
}
</style>
