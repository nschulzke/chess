<template>
  <div class="game">
    <div class="turn">{{turn}}'s turn</div>
    <div class="prison">
      <span class="piece" v-for="piece in board.whiteCaptured" v-bind:class="piece.class()"></span>
    </div>
    <div class="board" id="board">
      <div class="row" v-for="(a, i) in 8">
        <div class="space" v-bind:id="spaceId(i, j)" v-for="(b, j) in 8" v-bind:class="{highlight: isHighlighted(i, j)}"
             v-on:click="selectSquare(i, j)">
          <span class="piece" v-bind:class="getPiece(i, j)"></span>
        </div>
      </div>
    </div>
    <div class="prison">
      <span class="piece" v-for="piece in board.blackCaptured" v-bind:class="piece.class()"></span>
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
        board: new Board(),
        highlight: [],
        selected: undefined,
        turn: 'white'
      }
    },
    created: function () {
      for (let i = 0; i < 8; i++) {
        this.highlight.push([]);
        for (let j = 0; j < 8; j++) {
          this.highlight[i].push(false);
        }
      }
    },
    methods: {
      spaceId: function (row, col) {
        col = COLS[col];
        row = row + 1;
        return col + row;
      },
      coords: function (string) {
        col = COLS.findIndex((item) => item === string[0]);
        row = Number(string[1]) - 1;
        return {col: col, row: row};
      },
      getPiece: function (row, col) {
        if (this.board.getPiece(row, col) !== undefined)
          return this.board.getPiece(row, col).class();
        else return '';
      },
      resetHighlight: function () {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            this.highlight[i].splice(j, 1, false);
          }
        }
      },
      hasTurn: function (row, col) {
        let piece = this.board.getPiece(row, col);
        if (piece !== undefined)
          return piece.color === this.turn;
        else return false;
      },
      switchTurn: function () {
        this.turn = this.turn === 'white' ? 'black' : 'white';
      },
      selectSquare: function (row, col) {
        if (this.isHighlighted(row, col)) {
          this.board.movePiece({row: this.selected.row, col: this.selected.col}, {row: row, col: col});
          this.resetHighlight();
          this.switchTurn();
        } else {
          if (this.hasTurn(row, col)) {
            this.selected = {row: row, col: col};
            this.resetHighlight(row, col);
            this.board.validMoves(row, col).forEach((move) => {
              this.highlight[move.row].splice(move.col, 1, true);
            });
          } else return false;
        }
      },
      isHighlighted: function (row, col) {
        return this.highlight[row][col];
      },
    },
  }
</script>

<style scoped>
  .prison {
    height: 3rem;
  }
  .board {
    margin: 0 auto;
  }
</style>
