class Piece {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  white() {
    this.color = 'white';
    return this;
  }

  black() {
    this.color = 'black';
    return this;
  }

  class() {
    return this.name + ' ' + this.color;
  }
}

const PIECES = {
  pawn: function () {
    return new Piece('pawn', 1);
  },
  knight: function () {
    return new Piece('knight', 3);
  },
  bishop: function () {
    return new Piece('bishop', 3);
  },
  rook: function () {
    return new Piece('rook', 5);
  },
  queen: function () {
    return new Piece('queen', 9);
  },
  king: function () {
    return new Piece('king', -1);
  },
};

const DEFAULT_SETUP = [
  [PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn],
  [PIECES.rook, PIECES.knight, PIECES.bishop, PIECES.queen, PIECES.king, PIECES.bishop, PIECES.knight, PIECES.rook]
]

var DEFAULT_BOARD = [];
for (var i = 0; i < 8; i++) {
  DEFAULT_BOARD[i] = [];
}
for (var i = 0; i < 8; i++) {
  DEFAULT_BOARD[0][i] = DEFAULT_SETUP[1][i]().black();
  DEFAULT_BOARD[1][i] = DEFAULT_SETUP[0][i]().black();
  DEFAULT_BOARD[6][i] = DEFAULT_SETUP[0][i]().white();
  DEFAULT_BOARD[7][i] = DEFAULT_SETUP[1][i]().white();
}
Object.freeze(DEFAULT_BOARD);

export default class Board {
  constructor() {
    this.board = [];
    for (var i = 0; i < 8; i++) {
      this.board.push([]);
      for (var j = 0; j < 8; j++) {
        this.board[i].push(DEFAULT_BOARD[i][j]);
      }
    }
  }

  movePiece(start, dest) {
    if (this.board[dest.row][dest.col] === undefined) {
      this.board[dest.row].splice(dest.col, 1, this.board[start.row][start.col]);
      this.board[start.row].splice(start.col, 1, undefined);
    }
  }

  getPiece(row, col) {
    return this.board[row][col];
  }
}
