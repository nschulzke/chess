class Piece {
  constructor(name, value, moves) {
    this.name = name;
    this.value = value;
    this.moves = moves;
    this.hasMoved = false;
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
    return new Piece('pawn', 1, [
      {
        type: 'diagonal',
        range: 1,
        move: false,
        back: false
      },
      {
        type: 'straight',
        range: 1,
        capture: false,
        back: false
      },
      {
        type: 'straight',
        range: 2,
        capture: false,
        hasMoved: false,
        back: false
      }
    ]);
  },
  knight: function () {
    return new Piece('knight', 3, [
      {
        type: 'knight',
        range: [1, 2]
      }
    ]);
  },
  bishop: function () {
    return new Piece('bishop', 3, [
      {
        type: 'diagonal',
        range: -1
      }
    ]);
  },
  rook: function () {
    return new Piece('rook', 5, [
      {
        type: 'straight',
        range: -1
      }
    ]);
  },
  queen: function () {
    return new Piece('queen', 9, [
      {
        type: 'straight',
        range: -1
      },
      {
        type: 'diagonal',
        range: -1
      }
    ]);
  },
  king: function () {
    return new Piece('king', -1, [
      {
        type: 'straight',
        range: 1
      },
      {
        type: 'diagonal',
        range: 1
      }
    ]);
  },
};

export default PIECES;
