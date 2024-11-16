// Allow 2 players to play chess
// Reference: chessboardjs.com/examples

class ChessAI {

  WHITE = 'w';
  BLACK = 'b';

  pgn = null;
  move_count = 0;
  game_is_over = false;
  current_turn = 'w';
  w_check_data = {};  // Set flag:'true' when WHITE is in Check
  b_check_data = {};  // Set flag:'true' when BLACK is in Check
  human = 'w';  // Keep track of the human user's color
  compy_plays = true; // By default you're playing the computer
  promotionPiece = 'Q';

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

  knightArray = [-33, -31, -18, -14, 14, 18, 31, 33];

  bishopArray = [[15, 30, 45, 60, 75, 90, 105],
                 [-15, -30, -45, -60, -75, -90, -105],
                 [17, 34, 51, 68, 85, 102, 119],
                 [-17, -34, -51, -68, -85, -102, -119]];

  rookArray = [[1, 2, 3, 4, 5, 6, 7],
               [-1, -2, -3, -4, -5, -6, -7],
               [16, 32, 48, 64, 80, 96, 112],
               [-16, -32, -48, -64, -80, -96, -112]];

  queenArray = [[15, 30, 45, 60, 75, 90, 105],
                [-15, -30, -45, -60, -75, -90, -105],
                [17, 34, 51, 68, 85, 102, 119],
                [-17, -34, -51, -68, -85, -102, -119],
                [1, 2, 3, 4, 5, 6, 7],
                [-1, -2, -3, -4, -5, -6, -7],
                [16, 32, 48, 64, 80, 96, 112],
                [-16, -32, -48, -64, -80, -96, -112]];

  constructor() {
    // Nothing yet. This could initialize settings, such as the type of game you want to play.
  }

  deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
  }

  start() {
    this.resetDefaults();
    this.current_board = this.deepCopy(this.DEFAULT_BOARD);
    this.current_turn = this.deepCopy(this.WHITE);
  }

  clear() {
    this.current_board = {};
    this.resetDefaults();
  }

  resetDefaults() {
    // Reset the defaults
    this.move_count = 0;
    this.game_is_over = false;
    this.current_turn = this.WHITE;
    this.w_check_data = {};
    this.b_check_data = {};
    this.human = this.WHITE;
    this.compy_plays = true;
    this.promotionPiece = this.QUEEN;
  }

  debug_start(debug_board) {
    this.resetDefaults();
    this.current_board = this.deepCopy(debug_board);
    this.current_turn = this.deepCopy(this.WHITE);
  }

  set_orientation(orientation) {
    console.log('Now setting orientation to: ' + orientation)
    this.human = orientation;
  }

  game_over() {
    return this.game_is_over;
  }

  updatePromoPiece(piece) {
    this.promotionPiece = piece;
  }

  is_check(all_moves_me, them, do_alert) {
    // Take all your moves, and the color of your opponent. Have you put them in Check?
    // Examples:
    //    var check_me = this.is_check(all_moves_them, me, false); // am I in check?
    //    var check_them = this.is_check(all_moves_me, them, true); // are THEY in check?

    var default_check = {flag: false, from:"", to:""}

    // Get the location of your King
    var king_location = null;
    for(var spot in this.SQUARES) {
      // Check if there's something in this spot
      var piece = this.current_board[spot];
      if (piece === null) {
        continue;
      }

      if (piece.search(this.KING) > 0) {
        // What color is this King?
        var color = this.WHITE;
        if (piece.search(this.WHITE) === -1) {
          color = this.BLACK;
        }
        // Only check moves against the other color
        if (color !== them) { continue; }

        king_location = spot;
        //console.log(color + " king_location = " + king_location)
        break;
      }
    }

    // This should never happen, I'm only doing this as an error check
    if (king_location === null) {return default_check}

    // Do any of my allowed moves END on their King?
    // TODO it could be possible to have *multiple* moves put them in Check, we could
    // find all of them and have a way to return a list of every check move.
    for (var potentialMove of all_moves_me) {
      if (potentialMove.to === king_location) {
        if (do_alert) {alert('123 Check! ' + potentialMove.from + ":" + potentialMove.to);}
        console.log('Check! ' + potentialMove.from + ":" + potentialMove.to);
        return {flag:true, to:potentialMove.to, from:potentialMove.from}
      }
    }
    return default_check;
  }

  is_checkmate_or_draw() {
    var me = this.WHITE;
    var them = this.BLACK;
    if (this.current_turn === this.BLACK) {
      me = this.BLACK;
      them = this.WHITE;
    }

    var all_moves_me = this.generate_moves(me, null);
    var all_moves_them = this.generate_moves(them, null);
    var num_moves_left_me = all_moves_me.length;
    var num_moves_left_them = all_moves_them.length;
    console.log('# moves left me/them (' + me + '/' + them + ') = ' +
    	num_moves_left_me + "/" + num_moves_left_them);

    //TODO update these 'quiet' flags ...
    var check_me = this.is_check(all_moves_them, me, true); // am I in check?
    var check_them = this.is_check(all_moves_me, them, true); // are THEY in check?
    if (me === this.WHITE) {
      this.w_check_data = check_me;
      this.b_check_data = check_them;
      console.log('Check status (#1) for W/B: ' + check_me.flag + '/' + check_them.flag);
    } else {
      this.w_check_data = check_them;
      this.b_check_data = check_me;
      console.log('Check status (#2) for W/B: ' + check_them.flag + '/' + check_me.flag);
    }

    if(this.is_checkmate(num_moves_left_me, check_me)) {return {res:"checkmate", who:me}}
    if(this.is_checkmate(num_moves_left_them, check_them)) {return {res:"checkmate", who:them}}
    if(this.is_draw(num_moves_left_them, check_them)) {return {res:"draw", who:null}}
    if(check_me.flag) {return {res:"check", who:me}}
    if(check_them.flag) {return {res:"check", who:them}}

    return {res:"", who:null}
  }

  is_checkmate(moves_left, check) {
    var checkmate = false;
    if (check && moves_left === 0) {
      checkmate = true;
      alert('Checkmate!');
    }
    this.game_is_over = checkmate;
    return checkmate;
  }

  is_draw(moves_left, check) {
    var draw = false;
    if (!check && moves_left === 0) {
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

  resetCheckFlag() {
    // This function should be called after the computer generates its possible moves,
    // in order to prevent issues during other attempts to generate possible moves.
    if (this.human === this.WHITE) {this.b_check_data.flag = false;}
    else {this.w_check_data.flag = false;}
  }

  outOfBounds(new_spot) {
    return (
    	new_spot < this.SQUARES.a8 || 
    	new_spot > this.SQUARES.h1 ||
    	(new_spot % 16) >= 8) ? true : false;
  }

  generateScore(myPiece, opponent) {
    /*
    	Give a better score if we're taking a piece, even higher depending on the utility
    	of said piece.
    	Otherwise just give 0.5 for a King's movement, and 1.0 for any other piece's
    	random movement.
    */

    if (opponent !== null) {
      var value;
      switch(opponent.charAt(1)) {
        case this.PAWN:
          value = this.POINTS[this.PAWN];
          break;
        case this.KNIGHT:
          value = this.POINTS[this.KNIGHT];
          break;
        case this.BISHOP:
          value = this.POINTS[this.BISHOP];
          break;
        case this.ROOK:
          value = this.POINTS[this.ROOK];
          break;
        case this.QUEEN:
          value = this.POINTS[this.QUEEN];
          break;
        default:
          value = -6;
      }
      return value + 4.9;
    }

    if (myPiece === this.KING) {return 0.5;}
    return 1;
  }

  generate_moves(for_this_color, bypass_check_filter) {
    /*
    	for_this_color: 	 optionally we can generate moves for a specific color,
    						 default to the current turn if null
    	bypass_check_filter: optionally we can bypass filtering our moves based on if
    						 we're in check or not
    */

    if (for_this_color === null) {for_this_color = this.current_turn}
    if (bypass_check_filter === null) {bypass_check_filter = false}
    console.log("Now generating moves for color " + for_this_color +
    	"; bypass_check_filter=" + bypass_check_filter)

    var allMoves = [];
    var piece = null;
    var color = null;
    var value = null;
    var blah = null;
    var tmp = null;
    var space = null;
    var newSpace = null;
    var pawnScore = null;
    var new_value = null;

    var multiplier = 1;
    if (for_this_color === this.WHITE) multiplier = -1;

    for (var spot in this.SQUARES) {
      // Filter out the built-in key-value pairs that have meta information
      if (!this.SQUARES.hasOwnProperty(spot)) continue;

      // Check if there's something in this spot
      piece = this.current_board[spot];
      if (piece === null) continue;

      // Color for this piece
      color = this.WHITE;
      if (piece.search(this.WHITE) === -1) color = this.BLACK;

      // Only generate moves for the correct turn
      if (color !== for_this_color) continue;

      // Numeric index [0:119] for this spot
      value = this.SQUARES[spot];

      // Is it a pawn?
      if (piece.search(this.PAWN) > 0) {
        // Allowed moves are [15, 16, 17, 32] ...
        // they're negative for WHITE & positive for BLACK

        // Only allow forward move if unoccupied
        if (this.current_board[this.SQUARES2[16*multiplier + value]] === null) {
          tmp = 16*multiplier + value;
          if (! this.outOfBounds(tmp)) {
            pawnScore = ((tmp < 8) || (tmp > 111)) ? 6 : 1;
            allMoves.push({from:spot, to:this.SQUARES2[tmp], score:pawnScore})
          }

          // Only allow +2 move if in opening positions (and that spot is unoccupied)
          tmp = 32*multiplier + value;
          if (this.current_board[this.SQUARES2[tmp]] === null && ! this.outOfBounds(tmp)) {
            if (this.SQUARES2[value].search('2') !== -1 && color === this.WHITE) {
              allMoves.push({from:spot, to:this.SQUARES2[tmp], score:1.5})
            } else if (this.SQUARES2[value].search('7') !== -1 && color === this.BLACK) {
              allMoves.push({from:spot, to:this.SQUARES2[tmp], score:1.5})
            }
          }
        }

        // Only allow diagonal move if taking a piece of a different color
        for (var mvmt of [15, 17]) {
          tmp = mvmt*multiplier + value;
          blah = this.current_board[this.SQUARES2[tmp]];
          if (blah !== null && typeof blah !== "undefined") {
            if (color !== blah.charAt(0) && !this.outOfBounds(tmp)) {
              pawnScore = ((tmp < 8) || (tmp > 111)) ? 6 : 1;
              allMoves.push({from:spot, to:this.SQUARES2[tmp], score:(pawnScore+1)})
            }
          }
        }

        // Pawn En passant
        space = this.SQUARES[spot];
        if ((color === this.WHITE && space>47 && space<56)) {
          for (n of [1, -1]) {
            newSpace = space+n;
            blah = this.current_board[this.SQUARES2[newSpace]];

            // Is there a pawn next to it?
            if(!this.outOfBounds(newSpace) && blah !== null 
            	&& typeof blah !== "undefined" && blah === 'bP')
            {
              console.log('En passant piece is '+blah)

              //TODO must also check if the opponent's pawn had made a double move
              console.log('TODO! Candidate for Pawn En passant move.' + spot);
              
              // Add the move behind it, which also negates the
              //TODO should have an En passant flag attached to the move...
              //allMoves.push({from:spot, to:this.SQUARES2[newSpace+16], 2}) //TODO 
            }
          }
        } else if ((color === this.BLACK && space>79 && space<88)) {
          for (n of [1, -1]) {
            newSpace = space+n;
            blah = this.current_board[this.SQUARES2[newSpace]];

            // Is there a pawn next to it?
            if(!this.outOfBounds(newSpace) && blah !== null && 
            	typeof blah !== "undefined" && blah === 'bP')
            {
              console.log('En passant piece is '+blah)

              //TODO must also check if the opponent's pawn had made a double move
              console.log('TODO! Candidate for Pawn En passant move.' + spot);
              
              // Add the move behind it, which also negates the
              //TODO should have an En passant flag attached to the move...
              //allMoves.push({from:spot, to:this.SQUARES2[newSpace+16], 2}) //TODO
            }
          }
        }
      }

      // Is it a Knight?
      else if (piece.search(this.KNIGHT) > 0) {
        for (var mvmt of this.knightArray) {
          new_value = mvmt + value;
          if (this.outOfBounds(new_value)) continue;
          allMoves.push({
          	from:spot,
          	to:this.SQUARES2[new_value],
          	score:this.generateScore(
          		this.KNIGHT,
          		this.current_board[this.SQUARES2[new_value]]
          	)
          })

          // Don't let Knight land on it's own color
          if (this.current_board[this.SQUARES2[new_value]] !== null) {
            if (color === this.current_board[this.SQUARES2[new_value]].charAt(0)) {allMoves.pop();}
          }
        }
      }

      // Is it a Bishop?
      else if (piece.search(this.BISHOP) > 0) {
        for (var array of this.bishopArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            allMoves.push({
            	from:spot,
            	to:this.SQUARES2[new_value],
            	score:this.generateScore(
            		this.BISHOP,
            		this.current_board[this.SQUARES2[new_value]]
            	)
            })

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              if (color === this.current_board[this.SQUARES2[new_value]].charAt(0)) {allMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a Rook?
      else if (piece.search(this.ROOK) > 0) {
        for (var array of this.rookArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            allMoves.push({
            	from:spot,
            	to:this.SQUARES2[new_value],
            	score:this.generateScore(
            		this.ROOK,
            		this.current_board[this.SQUARES2[new_value]]
            	)
            })

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              if (color === this.current_board[this.SQUARES2[new_value]].charAt(0)) {allMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a Queen?
      else if (piece.search(this.QUEEN) > 0) {
        for (var array of this.queenArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            allMoves.push({
            	from:spot,
            	to:this.SQUARES2[new_value],
            	score:this.generateScore(
            		this.QUEEN,
            		this.current_board[this.SQUARES2[new_value]]
            	)
            })

            // Stop once you find a piece here, can't "jump over" it
            if (this.current_board[this.SQUARES2[new_value]] !== null) {
              if (color === this.current_board[this.SQUARES2[new_value]].charAt(0)) {allMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a King?
      else if (piece.search(this.KING) > 0) {
		// Allowed moves are +- 1, 15 16, 17
		for (var mvmt of [1, -1, 15, -15, 16, -16, 17, -17]) {
			new_value = mvmt + value;
			if (this.outOfBounds(new_value)) continue;

    		// If there's a piece here, it must be a different color for the King to move there
			if (this.current_board[this.SQUARES2[new_value]] !== null) {
				if (color === this.current_board[this.SQUARES2[new_value]].charAt(0)) continue;
        	}
			allMoves.push({
				from:spot,
          		to:this.SQUARES2[new_value],
          		score:this.generateScore(
          	 		this.KING,
					this.current_board[this.SQUARES2[new_value]]
          		)
			})
        }
      }
    }

    // Optionally bypass keeping Check moves
    if (bypass_check_filter) {return allMoves;}

    // If I am in check, only keep the moves that protect me
    if(
    	(this.w_check_data.flag && (for_this_color === this.WHITE)) || 
    	(this.b_check_data.flag && (for_this_color === this.BLACK)))
    {
      var checkMoves = [];
      var check_from = (for_this_color === this.WHITE) ? this.w_check_data.from : this.b_check_data.from;
      var check_to = (for_this_color === this.WHITE) ? this.w_check_data.to : this.b_check_data.to;
      console.log("We're in check... from " + check_from + " to " + check_to);

      for (var m of allMoves) {
        // First, allow any move that takes out the opponent's pressure piece
        if (m.to === check_from) {
          m.score = 20;
          checkMoves.push(m);
        }

        // Next, allow any move of the King *out* of the bad spot
        else if (m.from === check_to) {
          m.score = 18;
          checkMoves.push(m);
        }
      }

      // Lasty, calculate any other spots between the from:to, *unless* the From is a
      // Knight or Pawn, or the From is adjacent to the King
      var fromPiece = this.current_board[check_from];
      var delta = this.SQUARES[check_from] - this.SQUARES[check_to];
      var adjacentValues = [1, -1, 15, 16, 17, -15, -16, -17];
      console.log("Check;  fromPiece=" + fromPiece + " delta="+delta)
      if (
      		fromPiece !== null &&
      		((fromPiece.search(this.KNIGHT) === -1) || (fromPiece.search(this.PAWN) === -1))
      		&& !adjacentValues.includes(delta))
      	{
        console.log("Calculating intercept moves now...");
        var potentials = [];

        // Intercept a Bishop
        if (fromPiece.search(this.BISHOP) > 0) {
          if(delta < 0) {
            if(delta % 15 === 0) {
              // Bishop is above and to the right
              for (var i of [-15, -30, -45, -60, -75, -90, -115]) {
                var n = this.SQUARES[check_from] - i;
                //console.log("5 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
                if (n === this.SQUARES[check_to]) break;
                potentials.push(n);
              }
            } else {
              // Bishop is above and to the left
              for (var i of [-17, -34, -51, -68, -85, -102, -119]) {
                var n = this.SQUARES[check_from] - i;
                //console.log("6 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
                if (n === this.SQUARES[check_to]) break;
                potentials.push(n);
              }
            }
          }
          else {
            if(delta % 15 === 0) {
              // Bishop is below and to the left
              for (var i of [15, 30, 45, 60, 75, 90, 115]) {
                var n = this.SQUARES[check_from] - i;
                //console.log("7 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
                if (n === this.SQUARES[check_to]) break;
                potentials.push(n);
              }
            } else {
              // Bishop is below and to the right
              for (var i of [17, 34, 51, 68, 85, 102, 119]) {
                var n = this.SQUARES[check_from] - i;
                //console.log("8 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
                if (n === this.SQUARES[check_to]) break;
                potentials.push(n);
              }
            }
          }
          console.log('Bishop intercept potentials: ' + potentials)
        }

        // Intercept a Rook
        else if (fromPiece.search(this.ROOK) > 0) {
          if (delta < -15) {
            // approaching from top down
            for (var i of [-16, -32, -48, -64, -80, -96]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("1 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta < 0) {
            // approaching from the left
            for (var i of [-1, -2, -3, -4, -5, -6]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("2 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta < 8) {
            // approaching from the right
            for (var i of [1, 2, 3, 4, 5, 6]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("3 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta > 16) {
            // approaching from bottom up
            for (var i of [16, 32, 48, 64, 80, 96]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("4 i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else { console.error("[Rook] This isn't possible!"); }
          console.log('Rook intercept potentials: ' + potentials)
        }

        // Intercept a Queen
        else if (fromPiece.search(this.QUEEN) > 0) {
          console.log('Intercepting the Queen! delta='+delta)

          if (delta % 15 === 0) {
            // Queen is angled above and to the right
            for (var i of [-15, -30, -45, -60, -75, -90, -115]) {
              var mult = 1;
              if (delta > 0) mult=-1;
              var n = this.SQUARES[check_from] - mult*i;
              //console.log("5) i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta % 17 === 0){
            // Queen is angled above and to the left
            for (var i of [-17, -34, -51, -68, -85, -102, -119]) {
              var mult = 1;
              if (delta > 0) mult=-1;
              var n = this.SQUARES[check_from] - mult*i;
              //console.log("6) i="+i+"    "+this.SQUARES[check_from]+"    n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta < -15) {
            // approaching from top down
            for (var i of [-16, -32, -48, -64, -80, -96]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("1) i="+i+"    "+this.SQUARES[check_from]+" n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta < 0) {
            // approaching from the left
            for (var i of [-1, -2, -3, -4, -5, -6]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("2) i="+i+"    "+this.SQUARES[check_from]+" n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta < 8) {
            // approaching from the right
            for (var i of [1, 2, 3, 4, 5, 6]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("3) i="+i+"    "+this.SQUARES[check_from]+" n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else if (delta > 16) {
            // approaching from bottom up
            for (var i of [16, 32, 48, 64, 80, 96]) {
              var n = this.SQUARES[check_from] - i;
              //console.log("4) i="+i+"    "+this.SQUARES[check_from]+" n="+n)
              if (n === this.SQUARES[check_to]) break;
              potentials.push(n);
            }
          } else {console.error("[Queen] This isn't possible!");}
          console.log('Queen intercept potentials: ' + potentials)
        }

        // Now include the potentials
        var new_potential = null;
        for (var p of potentials) {
          if (this.outOfBounds(p)) continue;

          new_potential = this.SQUARES2[p];
          //console.log('new_potential = ' + new_potential);
          for (var m of allMoves) {
            // Don't let the King intercept itself
            if (this.current_board[m.from].search(this.KING) > 0) continue;

            if (m.to === new_potential) {
              m.score = 19;
              checkMoves.push(m);
              console.log('potential interception: ' + m.from + ":" + m.to + ";" + m.score)
            }
          }
        }
        //console.log('Done pushing all potentials.')
      }

      // Do not keep any move that places our own King into Check
      var s = "";
      for (var q of checkMoves) {s = s + "["+q.from+":"+q.to+";"+q.score+"], ";}
      console.log('In check, these are the moves to assess:  ' + s);
      return this.scrubMoves(checkMoves, this.deepCopy(this.current_board), for_this_color);
    }

    // Do not keep any move that places our own King into Check
    return this.scrubMoves(allMoves, this.deepCopy(this.current_board), for_this_color);
  }

  scrubMoves(potentialMoves, currentBoard, us) {
    // Scrub these potential moves to see if we're putting ourself into check ...
    // if so, that isn't allowed!
    console.log('>>>Scrubbing moves. There are ' + potentialMoves.length + ' to assess.');

	// First, skip this entire thing if we only have 1 potential move
	if (potentialMoves.length < 2) {return potentialMoves;}

    var okMoves = [];

    var them = this.WHITE;
    if (us === this.WHITE) them = this.BLACK;

    for (var pMove of potentialMoves) {
        // Apply this move to the current map (use a new variable, since we don't want it
        // to persist through every iteration of the for loop)
        var newBoard = this.deepCopy(currentBoard);
        newBoard[pMove.to] = newBoard[pMove.from];
        newBoard[pMove.from] = null;

        // Now make all potential moves for our opponent, based on if we made this
        // specific potential move out of all the potential ones we could've done.
        var opponentMoves = this.genOpponentMoves(newBoard, us, them);

		// Check if we are immediately in check or not
		// This would mean that our opponent would be able to take our King
		var weAreNowInCheck = false;

		// Which space is my King in?
		var king_location = null;
    	for(var spot in this.SQUARES) {
      		// Check if there's something in this spot
      		var piece = newBoard[spot];
      		if (piece === null) {
        		continue;
      		}

			if (piece.search(this.KING) > 0) {
        		// What color is this King that we just found?
        		var kingColor = this.WHITE;
        		if (piece.search(this.WHITE) === -1) {
          			kingColor = this.BLACK;
        		}
        		// While simulating opponents moves, we need to look for my King (which
        		// is their -theirs- King)
        		if (kingColor !== us) { continue; }

        		king_location = spot;
        		console.log("   " + kingColor + " HYPOTHETICAL King location: " + king_location)
        		break;
			}
		}

		// If any opponent move lands on my King, they got me.
		// So don't allow this potential move if so.
        for (var oMove of opponentMoves) {
        	if (oMove.to === king_location) {
        		weAreNowInCheck = true;
        		break;
        	}
        }

        // Only keep this move if it does NOT put us in check
        if (weAreNowInCheck) {
        	// Do not keep this move
        } else {
        	okMoves.push(pMove);
        }
    }
    console.log('>>>After the scrub, there are now ' + okMoves.length + " moves available.")
    return okMoves
  }

  genOpponentMoves (newBoard, them, us) {
    //TODO merge this function with `generate_moves()` using the `bypass_check_filter` flag

    var myMoves = [];
    var piece = null;
    var color = null;
    var value = null;
    var blah = null;
    var tmp = null;
    var new_value = null;

    var multiplier = 1;
    if (us === this.WHITE) multiplier = -1;

    for (var spot in this.SQUARES) {
      // Filter out the built-in key-value pairs that have meta information
      if (!this.SQUARES.hasOwnProperty(spot)) continue;

      // Check if there's something in this spot
      piece = newBoard[spot];
      if (piece === null) continue;

      // Color for this piece
      color = this.WHITE;
      if (piece.search(this.WHITE) === -1) color = this.BLACK;

      // Only generate moves for the correct turn
      if (color !== us) continue;

      // Numeric index [0:119] for this spot
      value = this.SQUARES[spot];

      // Is it a pawn?
      if (piece.search(this.PAWN) > 0) {
        // Allowed moves are [15, 16, 17, 32] ... they're negative for WHITE & positive for BLACK

        // Only allow forward move if unoccupied
        if (newBoard[this.SQUARES2[16*multiplier + value]] === null) {
          if (! this.outOfBounds(16*multiplier + value)) {
            myMoves.push({from:spot, to:this.SQUARES2[16*multiplier + value], score:1})
          }

          // Only allow +2 move if in opening positions (and that spot is unoccupied)
          tmp = 32*multiplier + value;
          if (newBoard[this.SQUARES2[tmp]] === null && ! this.outOfBounds(tmp)) {
            if (this.SQUARES2[value].search('2') !== -1 && color === this.WHITE) {
              myMoves.push({from:spot, to:this.SQUARES2[tmp], score:1})
            } else if (this.SQUARES2[value].search('7') !== -1 && color === this.BLACK) {
              myMoves.push({from:spot, to:this.SQUARES2[tmp], score:1})
            }
          }
        }

        // Only allow diagonal move if taking a piece of a different color
        for (var mvmt of [15, 17]) {
          tmp = mvmt*multiplier + value;
          blah = newBoard[this.SQUARES2[tmp]];
          if (blah !== null && typeof blah !== "undefined") {
            if (color !== blah.charAt(0) && !this.outOfBounds(tmp)) {
              myMoves.push({from:spot, to:this.SQUARES2[tmp], score:1})
            }
          }
        }
      }

      // Is it a Knight?
      else if (piece.search(this.KNIGHT) > 0) {
        for (var mvmt of this.knightArray) {
          new_value = mvmt + value;
          if (this.outOfBounds(new_value)) continue;
          myMoves.push({from:spot, to:this.SQUARES2[new_value], score:1})

          // Don't let Knight land on it's own color
          if (newBoard[this.SQUARES2[new_value]] !== null) {
            if (color === newBoard[this.SQUARES2[new_value]].charAt(0)) {myMoves.pop();}
          }
        }
      }

      // Is it a Bishop?
      else if (piece.search(this.BISHOP) > 0) {
        for (var array of this.bishopArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            myMoves.push({from:spot, to:this.SQUARES2[new_value], score:1})

            // Stop once you find a piece here, can't "jump over" it
            if (newBoard[this.SQUARES2[new_value]] !== null) {
              if (color === newBoard[this.SQUARES2[new_value]].charAt(0)) {myMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a Rook?
      else if (piece.search(this.ROOK) > 0) {
        for (var array of this.rookArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            myMoves.push({from:spot, to:this.SQUARES2[new_value], score:1})

            // Stop once you find a piece here, can't "jump over" it
            if (newBoard[this.SQUARES2[new_value]] !== null) {
              if (color === newBoard[this.SQUARES2[new_value]].charAt(0)) {myMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a Queen?
      else if (piece.search(this.QUEEN) > 0) {
        for (var array of this.queenArray) {
          for (var mvmt of array) {
            new_value = mvmt + value;
            if (this.outOfBounds(new_value)) break;
            myMoves.push({from:spot, to:this.SQUARES2[new_value], score:1})

            // Stop once you find a piece here, can't "jump over" it
            if (newBoard[this.SQUARES2[new_value]] !== null) {
              if (color === newBoard[this.SQUARES2[new_value]].charAt(0)) {myMoves.pop();}
              break;
            }
          }
        }
      }

      // Is it a King?
      else if (piece.search(this.KING) > 0) {
        // Allowed moves are +- 1, 15 16, 17
        for (var mvmt of [1, -1, 15, -15, 16, -16, 17, -17]) {
          new_value = mvmt + value;
          if (this.outOfBounds(new_value)) continue;

          // If there's a piece here, it must be a different color for the King to move there
          if (newBoard[this.SQUARES2[new_value]] !== null) {
            if (color === newBoard[this.SQUARES2[new_value]].charAt(0)) continue;
          }
          myMoves.push({from:spot, to:this.SQUARES2[new_value], score:0.5})
        }
      }
    }

    return myMoves
  }

  move(this_move) {

	var color_moved = this.current_board[this_move.from].charAt(0);

	console.log(
  		'<><><><><><><><><><><><><><><><><><><>\n' +
  		'   This is the start of a new turn! \n' +
  		'           for... ' + color_moved + '\n' +
  		'<><><><><><><><><><><><><><><><><><><>')
    console.log("Attempted move   " + this_move.from + " : " + this_move.to);

    // First check if this move is for the correct color
    if (this.current_turn !== color_moved) {
      return null;
    }

    // Check if the move was in-place, or off the board
    if (this_move.from === this_move.to || this_move.to === 'offboard') {
      return null;
    }

    // Do not allow a move onto your own piece
    if (this.current_board[this_move.to] !== null && 
    	this.current_board[this_move.to].charAt(0) === color_moved) {
		return null;
    }

    // A valid move will be included in the moves generated
    var is_valid = false;
    var current_moves = this.generate_moves(null, null);
    for (var a_move of current_moves) {
      if (a_move.from === this_move.from && a_move.to === this_move.to) {
        is_valid = true;
        break;
      }
    }

    // If this move is *not* valid, return null
    if (is_valid === false) {
      return null;
    }

    // Check if Pawn needs promotion (assume to Queen)
    var promotion = this.promotionPiece;  //TODO Allow the user to choose the promotion piece
    var do_promotion = null;
    if (this.current_board[this_move.from].charAt(1) === this.PAWN) {
      // White pawn promotion
      if (this_move.to.charAt(1) === '8' && color_moved === this.WHITE) {
        console.log('White Pawn Promotion!');
        do_promotion = true;
      }

      // Black pawn promotion
      else if (this_move.to.charAt(1) === '1' && color_moved === this.BLACK) {
        console.log('Black Pawn Promotion!');
        do_promotion = true;
      }
    }

    //TODO Check for castling

    //TODO Check for Pawn En passant

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
      console.log('doing a promotion: ' + color_moved + promotion);
    }
    return true;
  }

  fen() {
    // Forsyth-Edwards Notation
    // Returns a string of the current board

    var empty = 0;
    var new_fen = '';

    for (var i = this.SQUARES.a8; i <= this.SQUARES.h1; i++) {
        if (this.current_board[this.SQUARES2[i]] == null) {
            empty++;
        } else {
            if (empty > 0) {
                new_fen += empty;
                empty = 0;
            }
            var color = this.current_board[this.SQUARES2[i]].charAt(0);
            var piece = this.current_board[this.SQUARES2[i]].charAt(1);

            new_fen += (color === this.WHITE) ?
                piece.toUpperCase() : piece.toLowerCase();
        }

        if ((i + 1) & 0x88) {
            if (empty > 0) {
                new_fen += empty;
            }

            if (i !== this.SQUARES.h1) {
                new_fen += '/';
            }

            empty = 0;
            i += 8;
        }
    }
    console.log("fen: " + new_fen);
    return new_fen;
  }
}

/*
 * *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
 * *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
 * *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
 */

var board = null
var game = new ChessAI()
var $status = $('#status')
//var $fen = $('#fen')
//var $pgn = $('#pgn')

function randomMove(possibleMoves) {
	console.log('Now choosing a random valid move.');
	var randomIdx = Math.floor(Math.random() * possibleMoves.length)
	game.move(possibleMoves[randomIdx])
	var newMove = possibleMoves[randomIdx].from + ":" + 
  		possibleMoves[randomIdx].to + ";" + possibleMoves[randomIdx].score
	return newMove
}

function rankMoves(possibleMoves) {
  // Get the move with the highest score, unless all are weighted low (then choose random)
  var bestMove = null;
  var bestScore = -1;
  var compyMove = null;

  for (var m of possibleMoves) {
    //console.log('possible move... ' + m.from + ":" + m.to + ";" + m.score)
    if (m.score >= bestScore) {
      bestMove = m;
      bestScore = m.score;
    }
  }

  var tieMoves = [];
  for (var m of possibleMoves) {
    if (m.score === bestScore) {tieMoves.push(m);}
  }

  if ((bestMove === null) || (bestScore === 1)) {
    // Just choose random if none are any better than the rest
    compyMove = randomMove(possibleMoves);
  } else if (tieMoves.length > 1) {
    // Choose randomly out of the tie
    console.log('Tie for compy move with ' + tieMoves.length +
    	' moves available, all are scored ' + bestScore + '.');
    compyMove = randomMove(tieMoves);
  } else {
    compyMove = bestMove.from + ":" + bestMove.to + ";" + bestMove.score;
    game.move(bestMove);
  }

  return compyMove;
}

function computerMove(difficulty) {
  /*
   * difficulty
   *    0 = Random
   *    1 = Prioritize taking pieces; deprioritize moving the King
   *    2 = TBD
   */
  returnString = null;

  var possibleMoves = game.generate_moves(null, null)

  // Now that the compy has generated all of its possible moves, reset its Check flag
  game.resetCheckFlag()

  // Game over
  if (possibleMoves.length === 0) {
    //TODO make sure this is handled & displayed to the user somehow
    returnString = 'Warning! No possible computer moves';
    return returnString
  }

  var compyMove = "N/A";

  switch(difficulty) {
    case 0:
      compyMove = randomMove(possibleMoves);
      break;
    case 1:
      compyMove = rankMoves(possibleMoves);
      break;
    case 2:
      //TODO
      returnString = "Error: difficult '2' not yet implemented";
      return returnString;
    default:
      compyMove = randomMove(possibleMoves);
      break;
  }

  // Update the UI
  board.position(game.fen())

  updateStatus()

  returnString = "#=" + possibleMoves.length + "  " + compyMove;
  return returnString;
}

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

    // Try to wait a little so it doesn't go too fast, but not sure this actually works.
    burnCycles();
    sleep(1000);

    responseString = computerMove(1);
    if(responseString) console.log('Computer Response String: ' + responseString);
  }
}

// Update the board position after the piece snap
function onSnapEnd () {
  board.position(game.fen())
  return true
}

function updateStatus () {
  var status = ""

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // Checkmate or Draw?
  var moveResult = game.is_checkmate_or_draw();
  switch(moveResult.res) {
    case "checkmate":
      console.log('Checkmate status achieved')
      var team = 'White';
      if (moveResult.who !== null && moveResult.who === this.BLACK) team = "Black";
      status = 'Game over, ' + team + ' is in checkmate.';
      break;
    case "draw":
      console.log('Draw status achieved')
      status = 'Game over, drawn position.';
      break;
    case "check":
      var checkColor = 'White';
      console.log('Check: ' + moveResult.res + " " + moveResult.who)
      if (moveResult.who === game.BLACK) {
        checkColor = 'Black';
      }
      status = moveColor + ' to move, ' + checkColor + ' is in check.';
      break;
    default:
      status = moveColor + ' to move';
      break;
  }

  console.log('Updating status for ' + moveColor + ': ' + status)
  var display = "Status: ";
  $status.html(display.bold() + status)
  //$fen.html(game.fen())
  //$pgn.html(game.pgn())
}

function do_start () {
	console.log(
		'======================================\n' +
  		'    User clicked Start vs Computer \n' +
		'======================================')
	board.start()
	game.start()
	$status.html("White to move first. Good luck player 1!")
}
function do_user_start () {
	console.log(
		'======================================\n' +
		'      User clicked Start vs User \n' +
		'======================================')
	board.start()
	game.compy_plays = false;
	game.start()
	$status.html("White to move first.")
}
function do_clear () {
	console.log(
		'======================================\n' +
		'           User clicked Clear \n' +
		'======================================')
	board.clear()
	game.clear()
	$status.html("Hit 'Start' to create a new game!")
}

function do_debug1 () {
  console.log('+++++++++++++++++++++++\n  User clicked Debug1 \n+++++++++++++++++++++++')
  var posi = {
    a7: 'wB',
    d3: 'wQ',
    e5: 'bK',
    e3: 'wK'
  };
  var config2 = {
    draggable: true,
    position: posi,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard("customBoard", config2)

  var debug_board = {
    a8: null, b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
    a7: 'wB', b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: null,
    a5: null, b5: null, c5: null, d5: null, e5: 'bK', f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: 'wQ', e3: 'wK', f3: null, g3: null, h3: null,
    a2: null, b2: null, c2: null, d2: null, e2: null, f2: null, g2: null, h2: null,
    a1: null, b1: null, c1: null, d1: null, e1: null, f1: null, g1: null, h1: null
  };

  game.debug_start(debug_board)
  $status.html("This is debug #1...")
}

function do_debug2 () {
  console.log('+++++++++++++++++++++++\n  User clicked Debug2 \n+++++++++++++++++++++++')
  var posi = {
    a2: 'wP',
    a5: 'bQ',
    d1: 'bQ',
    e5: 'bK',
    e3: 'wK'
  };
  var config2 = {
    draggable: true,
    position: posi,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard("customBoard", config2)

  var debug_board = {
    a8: null, b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
    a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: null,
    a5: 'bQ', b5: null, c5: null, d5: null, e5: 'bK', f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: null, e3: 'wK', f3: null, g3: null, h3: null,
    a2: 'wP', b2: null, c2: null, d2: null, e2: null, f2: null, g2: null, h2: null,
    a1: null, b1: null, c1: null, d1: 'bQ', e1: null, f1: null, g1: null, h1: null
  };

  game.debug_start(debug_board)
  $status.html("This is debug #2...")
}

function do_debug3 () {
  console.log('+++++++++++++++++++++++\n  User clicked Debug3 \n+++++++++++++++++++++++')
  var posi = {
    a8: 'wR',
    e5: 'bK',
    e2: 'wK',
    h6: 'bP'
  };
  var config3 = {
    draggable: true,
    position: posi,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard("customBoard", config3)

  var debug_board = {
    a8: 'wR', b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
    a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: 'bP',
    a5: null, b5: null, c5: null, d5: null, e5: 'bK', f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
    a2: null, b2: null, c2: null, d2: null, e2: 'wK', f2: null, g2: null, h2: null,
    a1: null, b1: null, c1: null, d1: null, e1: null, f1: null, g1: null, h1: null
  };

  game.debug_start(debug_board)
  $status.html("This is debug #3...")
}

function do_debug4 () {
  // In this one, white (user) is about to get black (computer) in Checkmate
  console.log('+++++++++++++++++++++++\n  User clicked Debug4 \n+++++++++++++++++++++++')
  var posi = {
    a8: 'wR',
    e5: 'bK',
    e2: 'wK',
    h6: 'bP'
  };
  var config4 = {
    draggable: true,
    position: posi,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard("customBoard", config4)

  var debug_board = {
    a8: 'wR', b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
    a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: 'bP',
    a5: null, b5: null, c5: null, d5: null, e5: 'bK', f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
    a2: null, b2: null, c2: null, d2: null, e2: 'wK', f2: null, g2: null, h2: null,
    a1: null, b1: null, c1: null, d1: null, e1: null, f1: null, g1: null, h1: null
  };

  game.debug_start(debug_board)
  $status.html("This is debug #4...")
}

function do_debug5 () {
  // In this one, it's white's turn but black (computer) is about to put them in Checkmate
  console.log('+++++++++++++++++++++++\n  User clicked Debug5 \n+++++++++++++++++++++++')
  var posi = {
    a3: 'bR',
    c1: 'bQ',
    e5: 'bK',
    e2: 'wK',
    g5: 'bR',
    h5: 'wP',
    h6: 'bP'
  };
  var config5 = {
    draggable: true,
    position: posi,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }
  board = Chessboard("customBoard", config5)

  var debug_board = {
    a8: null, b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
    a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: 'bP',
    a5: null, b5: null, c5: null, d5: 'bR', e5: null, f5: null, g5: 'bK', h5: 'wP',
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: 'bR', b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
    a2: null, b2: null, c2: null, d2: null, e2: 'wK', f2: null, g2: null, h2: null,
    a1: null, b1: null, c1: 'bQ', d1: null, e1: null, f1: null, g1: null, h1: null
  };

  game.debug_start(debug_board)
  $status.html("This is debug #5...")
}

function set_orientation (orientation) {
  game.set_orientation(orientation)
  if (orientation === 'white' || orientation === 'black') {
    board.orientation(orientation)
  }
}

function burnCycles() {
  let iterations = 500;
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }
  return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

// Exporting variables and functions
//export { board };
