import PIECES from './pieces.js'

const DEFAULT_SETUP = [
  [PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn, PIECES.pawn],
  [PIECES.rook, PIECES.knight, PIECES.bishop, PIECES.queen, PIECES.king, PIECES.bishop, PIECES.knight, PIECES.rook]
];

let DEFAULT_BOARD = [];
for (let i = 0; i < 8; i++) {
  DEFAULT_BOARD[i] = [];
}
for (let j = 0; j < 8; j++) {
  DEFAULT_BOARD[0][j] = DEFAULT_SETUP[1][j]().black();
  DEFAULT_BOARD[1][j] = DEFAULT_SETUP[0][j]().black();
  DEFAULT_BOARD[6][j] = DEFAULT_SETUP[0][j]().white();
  DEFAULT_BOARD[7][j] = DEFAULT_SETUP[1][j]().white();
}
Object.freeze(DEFAULT_BOARD);

export default class Board {
  constructor() {
    this.board = [];
    this.blackCaptured = [];
    this.whiteCaptured = [];
    this.promotionListener = (coords) => {};
    for (let i = 0; i < 8; i++) {
      this.board.push([]);
      for (let j = 0; j < 8; j++) {
        this.board[i].push(DEFAULT_BOARD[i][j]);
      }
    }
  }

  movePiece(start, dest, special) {
    if (special === 'castle') {
      if (!this.isValidCastle(start, dest))
        return false;

      if (dest.col === 1)
        this.movePiece({row: start.row, col: 0}, {row: start.row, col: 2});
      else if (dest.col === 6)
        this.movePiece({row: start.row, col: 7}, {row: start.row, col: 5});
    }

    if (this.canCapture(this.board[start.row][start.col], dest) !== false) {
      if (this.board[dest.row][dest.col] !== undefined) {
        if (this.board[dest.row][dest.col].color === 'white')
          this.whiteCaptured.push(this.board[dest.row][dest.col]);
        else
          this.blackCaptured.push(this.board[dest.row][dest.col]);
      }
      this.board[start.row][start.col].hasMoved = true;
      this.board[dest.row].splice(dest.col, 1, this.board[start.row][start.col]);
      this.board[start.row].splice(start.col, 1, undefined);
      let piece = this.board[dest.row][dest.col];
      if (piece.name === 'pawn') {
        if (piece.color === 'white' && dest.row === 0)
          this.promotionListener(dest.row, dest.col);
        else if (piece.color === 'black' && dest.row === 7)
          this.promotionListener(dest.row, dest.col);
      }
    }
  }

  promote(coords, piece) {
    if (coords.row !== 0 && coords.row !== 7)
      return false;
    let original = this.board[coords.row][coords.col];
    original.name = piece.name;
    original.value = piece.value;
    original.moves = piece.moves;
  }

  getPiece(coords) {
    return this.board[coords.row][coords.col];
  }

  canCapture(piece, coords) {
    if (this.getPiece(coords) === undefined)
      return undefined;
    return this.getPiece(coords).color !== piece.color;
  }

  validMoves(coords) {
    let row = coords.row;
    let col = coords.col;
    let movePush = (array, moveRow, moveCol, special) => {
      let row = coords.row;
      let col = coords.col;
      return array.push({
        row: row + moveRow,
        col: col + moveCol,
        special: special
      });
    };

    let contPush = (array, row, col) => {
      coords = {row: row, col: col};
      if (row < 0 || col < 0 || row > 7 || col > 7)
        return false;
      if (this.canCapture(piece, coords) !== false)
        array.push(coords);
      else return false;
      return this.getPiece(coords) === undefined;
    };

    let piece = this.getPiece(coords);
    let moves = piece.moves;
    let ret = [];
    moves.forEach((move) => {
      if (move.hasMoved === false && piece.hasMoved === true)
        return;

      let all = [];
      if (move.type === 'diagonal') {
        if (move.range === -1) {
          for (let r = row - 1, c = col - 1; r >= 0, c >= 0; r--, c--) {
            if (!contPush(all, r, c)) break;
          }
          for (let r = row + 1, c = col - 1; r <= 7, c >= 0; r++, c--) {
            if (!contPush(all, r, c)) break;
          }
          for (let r = row + 1, c = col + 1; r <= 7, c <= 7; r++, c++) {
            if (!contPush(all, r, c)) break;
          }
          for (let r = row - 1, c = col + 1; r >= 0, c <= 7; r--, c++) {
            if (!contPush(all, r, c)) break;
          }
        } else {
          if (move.back === false) {
            if (piece.color === 'black') {
              movePush(all, move.range, move.range);
              movePush(all, move.range, -move.range);
            } else if (piece.color === 'white') {
              movePush(all, -move.range, move.range);
              movePush(all, -move.range, -move.range);
            }
          } else {
            movePush(all, move.range, move.range);
            movePush(all, -move.range, move.range);
            movePush(all, move.range, -move.range);
            movePush(all, -move.range, -move.range);
          }
        }
      } else if (move.type === 'straight') {
        if (move.range === -1) {
          for (let r = row - 1; r >= 0; r--) {
            if (!contPush(all, r, col)) break;
          }
          for (let r = row + 1; r <= 7; r++) {
            if (!contPush(all, r, col)) break;
          }
          for (let c = col - 1; c >= 0; c--) {
            if (!contPush(all, row, c)) break;
          }
          for (let c = col + 1; c <= 7; c++) {
            if (!contPush(all, row, c)) break;
          }
        } else {
          if (move.back === false) {
            if (piece.color === 'black') {
              movePush(all, move.range, 0);
            } else if (piece.color === 'white') {
              movePush(all, -move.range, 0);
            }
          } else {
            movePush(all, move.range, 0);
            movePush(all, 0, move.range);
            movePush(all, 0, -move.range);
            movePush(all, -move.range, 0);
          }
        }
      } else if (move.type === 'knight') {
        movePush(all, move.range[0], move.range[1]);
        movePush(all, -move.range[0], move.range[1]);
        movePush(all, -move.range[0], -move.range[1]);
        movePush(all, move.range[0], -move.range[1]);
        movePush(all, move.range[1], move.range[0]);
        movePush(all, -move.range[1], move.range[0]);
        movePush(all, -move.range[1], -move.range[0]);
        movePush(all, move.range[1], -move.range[0]);
      } else if (move.type === 'castle' && piece.hasMoved === false) {
        let left = {row: coords.row, col: 1, special: 'castle'};
        let right = {row: coords.row, col: 6, special: 'castle'};
        if (this.isValidCastle(coords, left))
          all.push(left);
        if (this.isValidCastle(coords, right))
          all.push(right);
      }
      all = all.filter((m) => {
        if (m.row < 0 || m.col < 0)
          return false;
        if (m.row > 7 || m.col > 7)
          return false;
        if (move.capture === false && this.canCapture(piece, m) === true)
          return false;
        if (move.move === false && !this.canCapture(piece, m) === true)
          return false;
        if (this.canCapture(piece, m) === false)
          return false;
        return true;
      });
      ret = ret.concat(all);
    });

    console.log(ret);
    return ret;
  }

  isValidCastle(start, dest) {
    if (start.row !== dest.row)
      return false;

    let rookCol;
    if (dest.col === 1)
      rookCol = 0;
    else if (dest.col === 6)
      rookCol = 7;
    else return false;
    let rookCoords = {row: dest.row, col: rookCol};

    let king = this.getPiece(start);
    let rook = this.getPiece(rookCoords);
    if (king === undefined || rook === undefined)
      return false;
    if (rook.name !== 'rook' || king.name !== 'king')
      return false;
    if (king.hasMoved || rook.hasMoved)
      return false;

    let clear = true;
    if (dest.col === 1) {
      for (let c = dest.col; c < start.col; c++)
        if (this.getPiece({row: start.row, col: c})) clear = false;
    } else if (dest.col === 6) {
      for (let c = dest.col; c > start.col; c--)
        if (this.getPiece({row: start.row, col: c})) clear = false;
    }
    return clear;
  }
}
