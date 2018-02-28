<template>
  <div class="game">
    <div class="turn">{{turn}}'s turn</div>
    <div class="table">
      <div class="prison">
        <span class="piece" v-for="piece in board.whiteCaptured" v-bind:class="piece.class()"></span>
      </div>
      <div class="board" id="board">
        <div class="row" v-for="(a, i) in 8">
          <div class="space" v-bind:id="spaceId(i, j)" v-for="(b, j) in 8"
               v-bind:class="{highlight: isHighlighted(i, j), highlightGreen: isRecentMove(i, j)}"
               v-on:click="selectSquare(i, j)">
            <span class="piece" v-bind:class="getPiece(i, j)"></span>
          </div>
        </div>
      </div>
      <div class="prison">
        <span class="piece" v-for="piece in board.blackCaptured" v-bind:class="piece.class()"></span>
      </div>
    </div>
    <div class="promotion" v-if="promoteWindow">
      <p>Promote to what?</p>
      <span class="piece knight" v-bind:class="promoteColor" v-on:click="promote(pieces.knight())"></span>
      <span class="piece bishop" v-bind:class="promoteColor" v-on:click="promote(pieces.bishop())"></span>
      <span class="piece rook" v-bind:class="promoteColor" v-on:click="promote(pieces.rook())"></span>
      <span class="piece queen" v-bind:class="promoteColor" v-on:click="promote(pieces.queen())"></span>
    </div>
  </div>
</template>

<script>
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  import Board from "@/lib/board.js"
  import PIECES from "@/lib/pieces.js"

  export default {
    name: 'Board',
    data() {
      return {
        board: new Board(),
        highlight: [],
        selected: undefined,
        turn: 'white',
        promoteWindow: false,
        lastStart: {},
        lastDest: {},
        pieces: PIECES
      }
    },
    created: function () {
      for (let i = 0; i < 8; i++) {
        this.highlight.push([]);
        for (let j = 0; j < 8; j++) {
          this.highlight[i].push(false);
        }
        this.board.promotionListener = this.promotionListener;
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
        if (this.promoteWindow)
          return false;
        if (this.isHighlighted(row, col)) {
          this.board.movePiece({row: this.selected.row, col: this.selected.col}, {row: row, col: col});
          this.lastStart = {row: this.selected.row, col: this.selected.col};
          this.lastDest = {row: row, col: col};
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
      isRecentMove: function (row, col) {
        if (this.lastDest.row === row && this.lastDest.col === col) {
          console.log(row, col);
          console.log(this.lastDest);
          return true;
        }
        else if (this.lastStart.row === row && this.lastStart.col === col)
          return true;
        return false;
      },
      promotionListener: function () {
        this.promoteWindow = true;
        this.promoteColor = this.turn;
      },
      promote: function (piece) {
        this.board.promote(this.lastDest.row, this.lastDest.col, piece);
        this.promoteWindow = false;
      }
    },
  }
</script>

<style scoped>
  .table {
    width: 30rem;
    background-color: #763B10;
    margin: 0 auto;
    border-radius: 2rem;
  }

  .prison {
    height: 3rem;
    width: 100%;
    margin: 0 auto;
  }

  .board {
    margin: 0 auto;
  }
</style>
