<template>
  <div id="app">
    <router-view/>
    <footer><a href="https://github.com/nschulzke/chess">Repository</a></footer>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body, #app {
    width: 100%;
    margin: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
  footer {
    text-align: center;
    padding: 1rem;
  }
</style>
