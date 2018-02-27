<template>
<div class="board" id="board">
  <div class="row" v-for="(a, i) in 8">
    <div class="space" v-bind:id="spaceId(i, j)" v-for="(b, j) in 8">
      <span class="piece" v-bind:class="getPiece(i, j)"></span>
    </div>
  </div>
</div>
</template>

<script>
const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

import Board from "@/lib/board.js"
export default {
  name: 'Board',
  data() {
    return {
      board: new Board()
    }
  },
  methods: {
    spaceId: function(row, col) {
      col = COLS[col]
      row = row + 1;
      return col + row;
    },
    coords: function(string) {
      col = COLS.findIndex((item) => item === string[0]);
      row = Number(string[1]) - 1;
      return { col: col, row: row };
    },
    getPiece: function(row, col) {
      if (this.board.getPiece(row, col) !== undefined)
        return this.board.getPiece(row, col).class();
      else return '';
    }
  }
}
</script>

<style>

</style>
