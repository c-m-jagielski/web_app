# Web Application
This is my first web application. I'm adding a chess module from [chessboardjs.com](chessboardjs.com).

The code is released under the [MIT License](https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md).

# HTML files
My main web app is `chess01.html`. It uses the functionality in `Algorithm.js`.

The code in `tmp.html` is an example I borrowed as a starting point.

The file `MyHtml.html` uses the functions in `Hello.js`.
It was my first web page, to learn the basics of javascript.

# Known bugs
* No castling
* Checkmate doesn't work
* AI doesn't correctly move to get out of Check
* AI might put itself into Check with its move
* Does not work in Safari (I've been testing with Chrome)
* The 'check' popup appears too early, before the piece is dropped so it's confusing
* Game doesn't end after checkmate, let's you keep on playing
* Does not prevent user from placing King in a takeaway spot; same for computer, too?

If you find more please let me know.

# To-do list
* Add test boards to load in to make testing easier, so you don't have to play a full game
* Fix all bugs! ;)
* Incorporate database on host to store game history
