'use strict';

// @PARAMS current board configuration and which player's turn it is
// @RETURN a list of all moves the current player can make
var chess = function( currentPos, color ){

	// give chess pieces numerical values
	// define ranks and files
		var boardSquares = 120,
			chessPieces = { empty: 0, whitePawn: 1, whitekNight: 2, whiteBishop: 3, whiteRook: 4, whiteQueen: 5, whiteKing: 6,
						blackPawn: 7, blackkNight: 8, blackBishop: 9, blackRook: 10, blackQueen: 11, blackKing: 12 },
			colors = { white: 0, black: 1, both: 2 },
			defaultPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
			/*
			FEN: 6 sections, min of 4
			1; set up of board, back
			uppercase is white
			side
			then castle - doesnt matter for this
			en passent -doesnt matter
			 */
			files = { fileA: 0, fileB: 1, fileC: 2, fileD: 3, fileE: 4, fileF: 5, fileG: 6, fileH: 7, noFile: 8 },
			ranks = { rank1: 0, rank2: 1, rank3: 2, rank4: 3, rank5: 4, rank6: 5, rank7: 6, rank8: 7, noRank: 8 },
			keySquares = { a1: 21, b1: 22, c1: 23, d1: 24, e1: 25, f1: 26, g1: 27, h1: 28,
						a8: 91, b8: 92, c8: 93, d8: 94, e8: 95, f8: 96, g8: 97, h8: 98,
						noSquare: 99, offBoard: 100},
			maxDepth = 64, // max search depth
			maxMoves = 256, // max number of moves
			sideKey;

	// set up arrays
	var sixtyFourTo120 = new Array( boardSquares ),
		oneTwentyTo64 = new Array( 64 ),
		fileBoard = new Array( boardSquares ),
		rankBoard = new Array( boardSquares ),
		pieceKeys = new Array( 14 * boardSquares );

	// generate numbers based on file and rank
	// piece on square
	// keys for every piece on every square
	// piece on side
	//
	chess.fileRankSquare = function( file, rank ) {
		console.log('file rank square');
		return( (21 + file ) + (rank * 10) );
	};

	// generate random numbers
	chess.randoNums = function() {
		return ( Math.floor( ( Math.random() * 255 ) + 1 ) << 23 ) | ( Math.floor( ( Math.random() * 255 ) + 1 ) << 16 ) | ( Math.floor( ( Math.random() * 255 ) + 1 ) << 8 ) | Math.floor( ( Math.random() * 255 ) + 1 );
	};

	chess.squareSixtyFour = function( squareOneTwenty ) {
		return oneTwentyTo64[ squareOneTwenty ];
	};

	chess.squareOneTwenty = function( squareSixtyFour ) {
		return sixtyFourTo120[ squareSixtyFour ];
	};

	chess.initFileRankBoard = function() {
		var file = files.fileA,
			rank = ranks.rank1,
			square = keySquares.a1;

		for ( var i = 0; i < boardSquares; i++ ){
			fileBoard[i] = keySquares.offBoard;
			rankBoard[i] = keySquares.offBoard;
		}

		for ( rank = ranks.rank1; rank <= ranks.rank8; rank++ ){
			for( file = files.fileA; file <= files.fileH; file++ ){
				square = chess.fileRankSquare( file, rank );
				fileBoard[square] = file;
				rankBoard[square] = rank;
			}
		}
	};

	chess.initGameBoard = function() {
		// set up the game board

		var pieceIndex = function( piece, pieceNum ) {
			return ( piece * 10 + pieceNum );
		};

		var gameBoard = {
			hisPly: 0,
			material: new Array( 2 ),
			moveList: new Array( maxDepth * maxMoves ),
			moveListStart: new Array( maxDepth ),
			pieces: new Array( boardSquares ),
			pieceList: new Array( 14 *  10 ),
			pieceNum: new Array( 13 ),
			ply: 0,
			posKey: 0,
			side: colors.white
			// fiftymove: 0,
			// castling: 0
		};

		var generatePositionKey = function() {
			var finalKey = 0,
				piece = chessPieces.empty,
				sq = 0;

			for( sq; sq < boardSquares; sq++ ) {
				piece = gameBoard.pieces[sq];
				if( piece != chessPieces.empty && piece != keySquares.offBoard ) {
					finalKey ^= pieceKeys[ ( piece * 120 ) + sq ];
				}
			}

			if( gameBoard.side === colors.white ) {
				finalKey ^= sideKey;
			}

			return finalKey;
		};

		chess.resetBoard = function() {
			// reset outside squares to offboard
			for( var i = 0; i < boardSquares; i++ ) {
				gameBoard.pieces[i] = keySquares.offBoard;
			}

			console.log( 'OFFBOARD RESET: ' + gameBoard.pieces );

			// reset board squares to empty
			for( var s = 0; s < 64; s++ ) {
				gameBoard.pieces[ chess.squareOneTwenty(s) ] = chessPieces.empty;
			}
			console.log( 'PIECES RESET: ' + gameBoard.pieces );

			// reset chess pieces to empty
			for( var p = 0; p < 14 * 120; p++ ) {
				gameBoard.pieceList[p] = chessPieces.empty;
			}

			console.log( 'PIECELIST RESET: ' + gameBoard.pieceList );

			// reset the piece material
			for( var m = 0; m < 2; m++ ) {
				gameBoard.material[m] = 0;
			}

			console.log( 'MATERIAL RESET: ' + gameBoard.material );

			// reset number of pieces
			for( var n = 0; n < 13; n++ ) {
				gameBoard.pieceNum[n] = 0;
			}

			console.log( 'PIECENUM RESET: ' + gameBoard.pieceNum );

			gameBoard.side = colors.both;
			gameBoard.ply = 0;
			gameBoard.hisPly = 0;
			gameBoard.moveListStart[gameBoard.ply] = 0;
			gameBoard.posKey = 0;
		};

		chess.parsePosFEN = function( currentPos ) {
			var count = 0,
				fenCount = 0,
				file = files.fileA,
				piece = 0,
				rank = ranks.rank8,
				square120 = 0;

			chess.resetBoard();

			console.log( currentPos );

			if ( !currentPos ) {
				currentPos = defaultPosition;
				console.log( 'default currentPos' + currentPos );
			}
		};

	};

	chess.initPieceKeys = function(){
		for ( var i = 0; i < pieceKeys.length; i++ ) {
			pieceKeys[i] = chess.randoNums();
		}

		sideKey = chess.randoNums();
	};


	chess.init120squaresTo64 = function() {
		var file = files.fileA,
			rank = ranks.rank1,
			square = keySquares.a1,
			sq64 = 0;

		for ( var i = 0; i < boardSquares; i++ ) {
			// something off the 64 square board
			oneTwentyTo64[i] = 65;
		}

		for ( var j = 0; j < 64; j++ ) {
			sixtyFourTo120[j] = 120;
		}

		for( rank = ranks.rank1; rank <= ranks.rank8; rank++ ) {
			for( file = files.fileA; file <= files.fileH; file++ ) {
				square = chess.fileRankSquare( file, rank );
				sixtyFourTo120[sq64] = square;
				oneTwentyTo64[square] = sq64;
				sq64++;
			}
		}
	};

	chess.initFileRankBoard();
	chess.initPieceKeys();
};

var chessGame = new chess();
