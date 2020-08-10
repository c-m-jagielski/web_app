// Allow 2 players to play chess
// Reference: chessboardjs.com/examples

class ChessAI {

  fen = null;
  pgn = null;

  constructor() {
    // Nothing yet. This could initialize settings, such as the type of game you want to play.
  }

  game_over() {
    //TODO add logic for this
    return false;
  }

  is_check() {
    //TODO determine status
    var check = false;
    if (check) {
      alert('Check!');
    }
    return check;
  }

  is_checkmate() {
    //TODO determine status
    var checkmate = false;
    if (checkmate) {
      alert('Checkmate!');
    }
    return checkmate;
  }

  is_draw() {
    //TODO determine status
    var draw = false;
    if (draw) {
      alert('Draw!');
    }
    return draw;
  }

  move(a, b) {
    //alert(a);
    //alert(b);

    //TODO Is this a valid move?

    //TODO check if Pawn needs promotion (to Queen)

    return true
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
  var status = "You're up!"

  var moveColor = 'White'
  /*if (game.turn() === 'b') {
    moveColor = 'Black'
  }*/

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
    if (game.is_check()) {
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

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard("customBoard", config)

updateStatus()
