import Board from './board.js'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default class Game {
  constructor() {
    this.restart();
  }

  restart() {
    this.board = new Board();
  }

  getPiece(pos) {
    return this.board.getPiece(Game.toCoords(pos));
  }

  movePiece(start, dest) {
    return this.board.movePiece(Game.toCoords(start), Game.toCoords(dest));
  }

  validMoves(pos) {
    return this.board.validMoves(Game.toCoords(pos));
  }

  setPromotionListener(listener) {
    this.board.promotionListener = listener;
  }

  promote(pos, piece) {
    let coords = Game.toCoords(pos);
    this.board.promote(coords, piece);
  }

  static toPos(coords) {
    let col = COLS[coords.col];
    let row = coords.row + 1;
    return col + row;
  }

  static toCoords(pos) {
    let col = COLS.findIndex((item) => item === pos[0]);
    let row = Number(pos[1]) - 1;
    return {col: col, row: row};
  }
}
