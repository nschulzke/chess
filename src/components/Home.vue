<template>
  <div class="main">
    <h1>Chess</h1>
    <p>
      This is a simple chess game in Vue. It's not quite complete, because parts of the
      project were bigger than I anticipated, but you can do most moves and play a game
      with a friend.

      Things that I'm going to add later:
    </p>
    <ul>
      <li>Timers</li>
      <li>Check and checkmate detection</li>
      <li>Game history</li>
      <li>en Passant capturing (requires game history)</li>
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
