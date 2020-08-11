// Allow 2 players to play chess
// Reference: chessboardjs.com/examples

class ChessAI {

  fen = null;
  pgn = null;
  current_turn = 'w';
  current_board = [];  // Keep track of where every piece is

  SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  constructor() {
    // Nothing yet. This could initialize settings, such as the type of game you want to play.
  }

  game_over() {
    //TODO add logic for this
    return false;
  }

  is_check(quiet) {
    //TODO determine status - if any possible move of the opponent can take your King
    var check = false;
    if (check && !quiet) {
      alert('Check!');
    }
    return check;
  }

  is_checkmate() {
    var checkmate = false;
    if (this.is_check(true) && this.generate_moves().length === 0) {
      checkmate = true;
      alert('Checkmate!');
    }
    return checkmate;
  }

  is_draw() {
    var draw = false;
    if (!this.is_check(true) && this.generate_moves().length === 0) {
      alert('Draw!');
    }
    return draw;
  }

  turn() {
    return this.current_turn;
  }

  update_turn() {
    if (this.current_turn === 'w') {
      this.current_turn = 'b';
    } else {
      this.current_turn = 'w';
    }
  }

  generate_moves() {
    var allMoves = [{'from':'qq', 'to':'qqq'}];

    /*for(var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      // Check if there's something in this spot
      ?
    }*/

    return allMoves;
  }

  move(this_move) {
    //alert(this_move.from);
    //alert(this_move.to);

    //TODO Is this a valid move? (return false if not)
    // A valid move will be included in the moves generated
    var is_valid = false;
    var current_moves = this.generate_moves();
    /*for (a_move in current_moves) { //this is not proper JS
      if (a_move === this_move) {
        is_valid = true;
        break;
      }
    }*/

    //TODO check if Pawn needs promotion (to Queen)
    //TODO check for castling

    this.update_turn()

    return true //is_valid
  }

}

var board = null
var game = new ChessAI()
var $status = $('#status')
//var $fen = $('#fen')
//var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) {
    alert('Game over - no more moves allowed.');
    return false
  }

  // only pick up pieces for the side to move
  /*if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }*/
  return true
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// TODO for castling, en passant, pawn promotion
function onSnapEnd () {
  //board.position(game.fen())
  return true
}

function updateStatus () {
  var status = ""

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // Checkmate?
  if (game.is_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // Draw?
  else if (game.is_draw()) {
    status = 'Game over, drawn position.'
  }

  // Otherwise we're still playing
  else {
    status = moveColor + ' to move'

    // check?
    if (game.is_check(false)) {
      status += ', ' + moveColor + ' is in check.'
    }
  }

  $status.html(status)
  //$fen.html(game.fen())
  //$pgn.html(game.pgn())
}

function do_start () {
  board.start()
  $status.html("White to move first.")
}
function do_clear () {
  board.clear()
  $status.html("Hit 'Start' to create a new game!")
}

function set_orientation (orientation) {
  if (orientation === 'white' || orientation === 'black') {
    board.orientation(orientation)
  }
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard("customBoard", config)

updateStatus()
