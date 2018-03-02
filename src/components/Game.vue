<template>
  <div class="game">
    <div class="table">
      <div class="prison">
        <span class="piece" v-for="piece in game.board.whiteCaptured" v-bind:class="piece.class()"></span>
      </div>
      <div class="board" id="board">
        <div class="row" v-for="(a, i) in 8">
          <div class="space" v-bind:id="toPos(i, j)" v-for="(b, j) in 8"
               v-bind:class="{highlight: isHighlighted(i, j), highlightGreen: isRecentMove(i, j)}"
               v-on:click="selectSquare(i, j)">
            <span class="piece" v-bind:class="getPiece(i, j)"></span>
          </div>
        </div>
      </div>
      <div class="prison">
        <span class="piece" v-for="piece in game.board.blackCaptured" v-bind:class="piece.class()"></span>
      </div>
      <div class="promotion" v-if="promoteWindow">
        <p>Promote to what?</p>
        <span class="piece" v-for="piece in promoteOptions" v-bind:class="piece.class()" v-on:click="promote(piece)"></span>
      </div>
    </div>
    <div class="controls">
      <div class="turn">{{turnReadable}}'s turn</div>
      <button v-on:click="restart()">Restart</button>
    </div>
  </div>
</template>

<script>
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  import Game from "@/lib/game.js"

  export default {
    name: 'Board',
    data() {
      return {
        game: new Game(),
        highlight: [],
        selected: undefined,
        promoteWindow: false,
        promoteOptions: [],
        lastStart: {},
        lastDest: {}
      }
    },
    created: function () {
      for (let i = 0; i < 8; i++) {
        this.highlight.push([]);
        for (let j = 0; j < 8; j++) {
          this.highlight[i].push(false);
        }
        this.game.setPromotionListener(this.promotionListener);
      }
    },
    methods: {
      restart: function () {
        this.game.restart();
      },
      toPos: function (row, col) {
        return Game.toPos({row: row, col: col});
      },
      getPiece: function (row, col) {
        let pos = Game.toPos({row: row, col: col});
        if (this.game.getPiece(pos) !== undefined)
          return this.game.getPiece(pos).class();
        else return '';
      },
      promotionListener: function () {
        this.promoteWindow = true;
        this.promoteOptions = this.game.getPromoteOptions();
        debugger;
      },
      promote: function (piece) {
        this.game.promote(this.lastDest, piece);
        this.promoteOptions = [];
        this.promoteWindow = false;
      },
      selectSquare: function (row, col) {
        let coords = {row: row, col: col};
        let pos = Game.toPos(coords);
        if (this.promoteWindow)
          return false;
        if (this.isHighlighted(row, col)) {
          this.game.movePiece(this.selected, pos);
          this.lastStart = this.selected;
          this.lastDest = pos;
          this.resetHighlight();
        } else {
          if (this.game.hasTurn(pos)) {
            this.selected = pos;
            this.resetHighlight();
            this.game.validMoves(pos).forEach((move) => {
              this.highlight[move.row].splice(move.col, 1, true);
            });
          } else return false;
        }
      },
      resetHighlight: function () {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            this.highlight[i].splice(j, 1, false);
          }
        }
      },
      isHighlighted: function (row, col) {
        return this.highlight[row][col];
      },
      isRecentMove: function (row, col) {
        let pos = Game.toPos({row: row, col: col});
        if (this.lastStart === pos)
          return true;
        else if (this.lastDest === pos)
          return true;
        return false;
      }
      ,
    },
    computed: {
      turnReadable: function () {
        if (this.game.turn === 'white') return 'White';
        if (this.game.turn === 'black') return 'Black';
        return '';
      }
    }
  }
</script>

<style scoped>
  .game {
    width: 100%;
  }

  .controls {
    box-sizing: border-box;
    color: white;
    text-align: center;
    background-color: #763B10;
    padding: 1rem;
    border-radius: 1.5rem;
    width: 100%;
    margin-top: 1rem;
  }

  .controls > * {
    margin-bottom: 1rem;
  }

  .table {
    width: 30rem;
    background-color: #763B10;
    margin: 0 auto;
    border-radius: 2rem;
    position: relative;
  }

  .prison {
    height: 3rem;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    line-height: 3rem;;
  }

  .board {
    margin: 0 auto;
  }

  .promotion {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10rem;
    height: 6rem;
    margin-left: -5rem;
    margin-top: -3rem;
    background-color: #763B10;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
    text-align: center;
    color: white;
  }

  @media only screen and (min-width: 720px) {
    .game {
      display: flex;
      width: 40rem;
      margin: 0 auto;
    }

    .controls {
      flex: 1;
      margin-top: 0;
      margin-left: 1rem;
    }
  }
</style>
