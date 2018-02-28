<template>
  <div class="main">
    <h1>Chess</h1>
    <p>
      This is a simple chess game in Vue. It's not quite complete, because the project
      was bigger than I anticipated, but you can do most moves and play a simple game.

      Things that I'm going to do later:
    </p>
    <ul>
      <li>Check and checkmate detection</li>
      <li>Castling</li>
      <li>Timers</li>
      <li>en Passant capturing</li>
    </ul>
    <a href="#/game">Go to the game!</a>
  </div>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>

<style>
  .main {
    width: 40rem;
    margin: 0 auto;
  }
</style>
