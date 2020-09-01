/*
 * *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
 */

var board = null
var game = new ChessAI()


function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) {
    alert('Game over - no more moves allowed.');
    return false
  }

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
  return true
}

function onDrop (source, target) {
  // See if the move is legal
  var move = game.move({
    from: source,
    to: target
  })

  // Illegal move
  if (move === null) return 'snapback'

  updateStatus()
  console.log('Human just moved: ' + source + ":" + target)

  // Computer's turn...
  if (game.compy_plays) {
    var responseString = null;
    //window.setTimeout(responseString = computerMove(0), 250); //TODO this throws an error in the console, not sure why
    responseString = computerMove(1);
    if(responseString) console.warn('Computer Response String: ' + responseString);
  }
}

// Update the board position after the piece snap
function onSnapEnd () {
  board.position(game.fen())
  return true
}

function do_tests() {
  console.log('User clicked Do Unit Tests')
  board.start()
  game.start()
}

board = Chessboard("customBoard", config)
