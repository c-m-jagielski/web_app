// Allow 2 players to play chess
// Reference: chessboardjs.com/examples

class ChessAI {

  WHITE = 'w';
  BLACK = 'b';

  fen = null;
  pgn = null;
  move_count = 0;
  game_on = true;
  current_turn = 'w';
  human = 'w';  // Keep track of the human user's color
  DEFAULT_BOARD = {
    a8: 'bR', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bR',
    a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: null,
    a5: null, b5: null, c5: null, d5: null, e5: null, f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
    a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
    a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wR'
  };  // Keep track of where every piece is

  PAWN = 'P';
  KNIGHT = 'N';
  BISHOP = 'B';
  ROOK = 'R';
  QUEEN = 'Q';
  KING = 'K';
  PIECES = ['P', 'N', 'B', 'R', 'Q', 'K'];

  //TODO update points based on relative positions of the pieces,
  //     e.g. a pawn about to be promoted is worth much more
  POINTS = {
    'P': 1,
    'N': 3,
    'B': 3,
    'R': 5,
    'Q': 9,
  };

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
  SQUARES2 = {
      0:   'a8', 1:   'b8', 2:   'c8', 3:   'd8', 4:   'e8', 5:   'f8', 6:   'g8', 7:   'h8',
      16:  'a7', 17:  'b7', 18:  'c7', 19:  'd7', 20:  'e7', 21:  'f7', 22:  'g7', 23:  'h7',
      32:  'a6', 33:  'b6', 34:  'c6', 35:  'd6', 36:  'e6', 37:  'f6', 38:  'g6', 39:  'h6',
      48:  'a5', 49:  'b5', 50:  'c5', 51:  'd5', 52:  'e5', 53:  'f5', 54:  'g5', 55:  'h5',
      64:  'a4', 65:  'b4', 66:  'c4', 67:  'd4', 68:  'e4', 69:  'f4', 70:  'g4', 71:  'h4',
      80:  'a3', 81:  'b3', 82:  'c3', 83:  'd3', 84:  'e3', 85:  'f3', 86:  'g3', 87:  'h3',
      96:  'a2', 97:  'b2', 98:  'c2', 99:  'd2', 100: 'e2', 101: 'f2', 102: 'g2', 103: 'h2',
      112: 'a1', 113: 'b1', 114: 'c1', 115: 'd1', 116: 'e1', 117: 'f1', 118: 'g1', 119: 'h1'
  };

  constructor() {
    // Nothing yet. This could initialize settings, such as the type of game you want to play.
  }

  deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
  }

  start() {
    this.current_board = this.deepCopy(this.DEFAULT_BOARD);
    this.current_turn = this.deepCopy(this.WHITE);
  }

  clear() {
    this.current_board = {};
  }

  game_over() {
    return this.game_on;
  }

  is_check(quiet) {
    //TODO determine status - if any possible move of the opponent can take your King

    // First generate your opponent's possible moves
    // Get the location of your King
    // Do any allowed moves END on your King?

    var check = false;
    if (check && !quiet) {
      alert('Check!');
    }
    return check;
  }

  is_checkmate(moves_left) {
    var checkmate = false;
    if (this.is_check(true) && moves_left === 0) {
      checkmate = true;
      alert('Checkmate!');
    }
    this.game_on = checkmate;
    return checkmate;
  }

  is_draw(moves_left) {
    var draw = false;
    if (!this.is_check(true) && moves_left === 0) {
      alert('Draw!');
    }
    return draw;
  }

  turn() {
    return this.current_turn;
  }

  update_turn() {
    this.current_turn = this.current_turn === this.WHITE ? this.BLACK : this.WHITE;
  }

  outOfBounds(new_spot) {
    return (new_spot < this.SQUARES.a8 || new_spot > this.SQUARES.h1 || (new_spot % 16) > 8) ? true : false;
  }

  generate_moves() {
    var allMoves = [];

    for (var spot in this.SQUARES) {
      if (!this.SQUARES.hasOwnProperty(spot)) {
        // Filter out the built-in key-value pairs that have meta information
        continue;
      }

      // Check if there's something in this spot
      var piece = this.current_board[spot];
      if (piece === null) {
        continue;
      }

      // Color for this piece
      var color = this.WHITE;
      if (piece.search(this.WHITE) === -1) {
        color = this.BLACK;
      }

      // Only generate moves for the current turn
      if (color !== this.current_turn) {
        continue;
      }

      // Numeric index [0:119] for this spot
      var value = this.SQUARES[spot];

      // Is it a pawn?
      if (piece.search(this.PAWN) > 0) {
        // Allowed moves for BLACK are + 15, 16, 17, 32
        // Allowed moves for WHITE are - 15, 16, 17, 32
        var multiplier = 1;
        if (color === this.WHITE) {
          multiplier = -1;
        }

        var allowed_array = [];

        // Only allow forward move if unoccupied
        var forward_allowed = false;
        if (this.current_board[this.SQUARES2[16*multiplier + value]] === null) {
          allowed_array.push(16);

          // Only allow +2 move if in opening positions
          if (this.SQUARES2[value].search('2') !== -1 && color === this.WHITE) {
            allowed_array.push(32);
          } else if (this.SQUARES2[value].search('7') !== -1 && color === this.BLACK) {
            allowed_array.push(32);
          }
        }
        // Only allow diagonal move if taking a piece
        if (this.current_board[this.SQUARES2[15*multiplier + value]] !== null) {
          allowed_array.push(15);
        }
        if (this.current_board[this.SQUARES2[17*multiplier + value]] !== null) {
          allowed_array.push(17);
        }

        for (var mvmt of allowed_array) {
          var new_value = mvmt*multiplier + value;
          if (this.outOfBounds(new_value)) continue;
          allMoves.push({from:spot, to:this.SQUARES2[new_value]})
        }
      }

      // Is it a Knight?
      else if (piece.search(this.KNIGHT) > 0) {
        var allowed_array = [-33, -31, -18, -14, 14, 18, 31, 33];

        for (var mvmt of allowed_array) {
          var new_value = mvmt + value;
          if (this.outOfBounds(new_value)) continue;
          allMoves.push({from:spot, to:this.SQUARES2[new_value]})
        }
      }

      // Is it a Bishop?
      else if (piece.search(this.BISHOP) > 0) {
        var allowed_array = [[15, 30, 45, 60, 75, 90, 105],
                             [-15, -30, -45, -60, -75, -90, -105],
                             [17, 34, 51, 68, 85, 102, 119],
                             [-17, -34, -51, -68, -85, -102, -119]];

        for (var array of allowed_array) {
          for (var mvmt of array) {
            var new_value = mvmt + value;
            if (this.outOfBounds(new_value)) continue;
            allMoves.push({from:spot, to:this.SQUARES2[new_value]})

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              break;
            }
          }
        }
      }

      // Is it a Rook?
      else if (piece.search(this.ROOK) > 0) {
        var allowed_array = [[1, 2, 3, 4, 5, 6, 7],
                             [-1, -2, -3, -4, -5, -6, -7],
                             [16, 32, 48, 64, 80, 96, 112],
                             [-16, -32, -48, -64, -80, -96, -112]];

        for (var array of allowed_array) {
          for (var mvmt of array) {
            var new_value = mvmt + value;
            if (this.outOfBounds(new_value)) continue;
            allMoves.push({from:spot, to:this.SQUARES2[new_value]})

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              break;
            }
          }
        }
      }

      // Is it a Queen?
      else if (piece.search(this.QUEEN) > 0) {
        var allowed_array = [[15, 30, 45, 60, 75, 90, 105],
                             [-15, -30, -45, -60, -75, -90, -105],
                             [17, 34, 51, 68, 85, 102, 119],
                             [-17, -34, -51, -68, -85, -102, -119],
                             [1, 2, 3, 4, 5, 6, 7],
                             [-1, -2, -3, -4, -5, -6, -7],
                             [16, 32, 48, 64, 80, 96, 112],
                             [-16, -32, -48, -64, -80, -96, -112]];

        for (var array of allowed_array) {
          for (var mvmt of array) {
            var new_value = mvmt + value;
            if (this.outOfBounds(new_value)) continue;
            allMoves.push({from:spot, to:this.SQUARES2[new_value]})

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              break;
            }
          }
        }
      }

      // Is it a King?
      else if (piece.search(this.KING) > 0) {
        // Allowed moves are +- 1, 15 16, 17
        for (var mvmt of [1, -1, 15, -15, 16, -16, 17, -17]) {
          var new_value = mvmt + value;
          if (this.outOfBounds(new_value)) continue;

          allMoves.push({from:spot, to:this.SQUARES2[new_value]})

          // TODO Do not allow the King to place itself into Check
        }
      }
    }

    return allMoves;
  }

  move(this_move) {
    //alert(this_move.from + " : " + this_move.to);
    //alert(this.current_board[this_move.from] + " : " + this.current_board[this_move.to])

    var color_moved = this.current_board[this_move.from].charAt(0);

    // First check if this move is for the correct color
    if (this.current_turn !== color_moved) {
      return null;
    }

    // Check if the move was in-place, or off the board
    if (this_move.from === this_move.to || this_move.to === 'offboard') {
      return null;
    }

    // Do not allow a move onto your own piece
    if (this.current_board[this_move.to] !== null && this.current_board[this_move.to].charAt(0) === color_moved) {
      return null;
    }

    // A valid move will be included in the moves generated
    var is_valid = false;
    var current_moves = this.generate_moves();
    for (var a_move of current_moves) {
      if (a_move.from === this_move.from && a_move.to === this_move.to) {
        is_valid = true;
        break;
      }
    }
    //TODO remove this HACK once generate_moves() actually works...
    // *************
    //is_valid = true;
    // *************

    // If this move is *not* valid, return null
    if (is_valid === false) {
      return null;
    }

    // Check if Pawn needs promotion (assume to Queen)
    var promotion = this.QUEEN;  //TODO Allow the user to choose the promotion piece
    var do_promotion = null;
    if (this.current_board[this_move.from].charAt(1) === this.PAWN) {
      // White pawn promotion
      if (this_move.to.charAt(1) === '8' && color_moved === this.WHITE) {
        //alert('White Pawn Promotion!');
        do_promotion = true;
      }

      // Black pawn promotion
      else if (this_move.to.charAt(1) === '1' && color_moved === this.BLACK) {
        //alert('Black Pawn Promotion!');
        do_promotion = true;
      }
    }

    //TODO Check for castling

    // Change the color
    this.update_turn()

    // +1 for this move
    this.move_count = this.move_count + 1;

    // Update the board
    this.current_board[this_move.to] = this.current_board[this_move.from];
    this.current_board[this_move.from] = null;

    // Handle a potential pawn promotion
    if (do_promotion) {
      // Change the board
      this.current_board[this_move.to] = color_moved + promotion;
      //alert('doing a promotion: ' + color_moved + promotion);

      //TODO change the img used
    }

    return true;
  }

}

/*
 * *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
 */

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

  var blah = game.generate_moves();
  var moves_left = blah.length;

  // Checkmate?
  if (game.is_checkmate(moves_left)) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // Draw?
  else if (game.is_draw(moves_left)) {
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
  game.start()
  $status.html("White to move first.")
}
function do_clear () {
  board.clear()
  game.clear()
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
do_start()

updateStatus()
