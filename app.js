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
		fileChars = 'abcdefgh', // characters to represent the file
		files = { fileA: 0, fileB: 1, fileC: 2, fileD: 3, fileE: 4, fileF: 5, fileG: 6, fileH: 7, noFile: 8 },
		keySquares = { a1: 21, b1: 22, c1: 23, d1: 24, e1: 25, f1: 26, g1: 27, h1: 28,
					a8: 91, b8: 92, c8: 93, d8: 94, e8: 95, f8: 96, g8: 97, h8: 98,
					noSquare: 99, offBoard: 100},
		maxDepth = 64, // max search depth
		maxMoves = 256, // max number of moves
		pieceChars = '.PNBRQKpnbrqk', //characters to represent the pieces
		rankChars = '12345678', //characters to represent the ranks
		ranks = { rank1: 0, rank2: 1, rank3: 2, rank4: 3, rank5: 4, rank6: 5, rank7: 6, rank8: 7, noRank: 8 },
		sideKey;

	// set up arrays
	var fileBoard = new Array( boardSquares ),
		oneTwentyTo64 = new Array( 64 ),
		pieceKeys = new Array( 14 * boardSquares ),
		rankBoard = new Array( boardSquares ),
		sixtyFourTo120 = new Array( boardSquares );

	// set up the game board
	var gameBoard = {
		hisPly: 0,
		// material: new Array( 2 ),
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

	// generate numbers based on file and rank
	// piece on square
	// keys for every piece on every square
	// piece on side
	//
	var fileRankSquare = function( file, rank ) {
		return( ( 21 + file ) + ( rank * 10 ) );
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

	var initFileRankBoard = function() {
		var file = files.fileA,
			rank = ranks.rank1,
			square = keySquares.a1;

		for ( var i = 0; i < boardSquares; i++ ){
			fileBoard[i] = keySquares.offBoard;
			rankBoard[i] = keySquares.offBoard;
		}

		for ( rank = ranks.rank1; rank <= ranks.rank8; rank++ ){
			for( file = files.fileA; file <= files.fileH; file++ ){
				square = fileRankSquare( file, rank );
				fileBoard[square] = file;
				rankBoard[square] = rank;
			}
		}
	};

	var initPieceKeys = function(){
		for ( var i = 0; i < pieceKeys.length; i++ ) {
			pieceKeys[i] = randoNums();
		}

		sideKey = randoNums();
	};

	var init120squaresTo64 = function() {
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
				square = fileRankSquare( file, rank );
				sixtyFourTo120[sq64] = square;
				oneTwentyTo64[square] = sq64;
				sq64++;
			}
		}
	};

	var parseColor = function( color ) {
		gameBoard.side = color === 'white' ? colors.white : colors.black;
		console.log('COLOR: ' + gameBoard.side );
	};

	var parsePosFEN = function( currentPos ) {
		var count = 0,
			fenCount = 0, // index in fen string
			file = files.fileA, // start at a
			piece = 0,
			rank = ranks.rank8, // and start at 8
			square120 = 0;

		resetBoard();

		console.log( currentPos );

		if ( !currentPos ) {
			currentPos = defaultPosition;
			console.log( 'default currentPos: ' + currentPos );
		}

		while ( rank >= ranks.rank1 && fenCount < currentPos.length ) {
			count = 1;

			switch( currentPos[fenCount] ) {
				case 'p':
					piece = chessPieces.blackPawn;
					break
				case 'r':
					piece = chessPieces.blackRook;
					break;
				case 'n':
					piece = chessPieces.blackkNight;
					break;
				case 'b':
					piece = chessPieces.blackBishop;
					break;
				case 'k':
					piece = chessPieces.blackKing;
					break;
				case 'q':
					piece = chessPieces.blackQueen;
					break;
				case 'P':
					piece = chessPieces.whitePawn;
					break;
				case 'R':
					piece = chessPieces.whiteRook;
					break;
				case 'N':
					piece = chessPieces.whitekNight;
					break;
				case 'B':
					piece = chessPieces.whiteBishop;
					break;
				case 'K':
					piece = chessPieces.whiteKing;
					break;
				case 'Q':
					piece = chessPieces.whiteQueen;
					break;

				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
					piece = chessPieces.empty;
					count = parseInt( currentPos[fenCount] );
					break;

				case '/':
				case ' ':
					rank--;
					file = files.fileA;
					fenCount++;
					continue;
				default:
					console.error( 'FEN ERROR' );
					return;
			}

			for ( var i = 0; i < count; i++ ) {
				square120 = fileRankSquare( file, rank );
				gameBoard.pieces[square120] = piece;
				file++;
			}
			fenCount++;
		}

		updateMaterialList();
	};

	var pieceIndex = function( piece, pieceNum ) {
		return ( piece * 10 + pieceNum );
	};

	var printBoard = function() {
		var boardFile,
			boardPiece,
			boardRank,
			boardSquare;// letters to represent the characters;

		console.log('Game Board: ' );

		for( boardRank = ranks.rank8; boardRank >= ranks.rank1; boardRank-- ){
			var line = boardRank + ' ';
			for( boardFile = files.fileA; boardFile <= files.fileH; boardFile++ ) {
				boardSquare = fileRankSquare( boardFile, boardRank );
				boardPiece = gameBoard.pieces[boardSquare];
				line += ' ' + pieceChars[boardPiece] + ' ';
			}
			console.log( line );
		}
		var newLine = ' ';
		for( boardFile = files.fileA; boardFile <= files.fileH; boardFile++ ) {
			newLine += ' ' + fileChars[boardFile] + ' ';
		}
		console.log( newLine );

		printPieces();
	};

	var printPieces =  function() {
		var piece,
			pieceNum;
		for ( piece = chessPieces.whitePawn; piece <= chessPieces.blackKing; piece++ ) {
			for ( pieceNum = 0; pieceNum < gameBoard.pieceNum[piece]; pieceNum++ ) {
				console.log( pieceChars[piece] + ' is on ' + printSquare( gameBoard.pieceList[pieceIndex( piece, pieceNum )] ) )
			}
		}
	};

	var printSquare = function(sq) {
		return( fileChars[fileBoard[sq]] + ':' + rankChars[rankBoard[sq]] );
	};

	// generate random numbers
	var randoNums = function() {
		return ( Math.floor( ( Math.random() * 255 ) + 1 ) << 23 ) | ( Math.floor( ( Math.random() * 255 ) + 1 ) << 16 ) | ( Math.floor( ( Math.random() * 255 ) + 1 ) << 8 ) | Math.floor( ( Math.random() * 255 ) + 1 );
	};

	var resetBoard = function() {
		// reset outside squares to offboard
		for( var i = 0; i < boardSquares; i++ ) {
			gameBoard.pieces[i] = keySquares.offBoard;
		}

		console.log( 'OFFBOARD RESET' );

		// reset board squares to empty
		for( var s = 0; s < 64; s++ ) {
			gameBoard.pieces[ squareOneTwenty(s) ] = chessPieces.empty;
		}
		console.log( 'PIECES RESET' );

		gameBoard.side = colors.both;
		gameBoard.ply = 0;
		gameBoard.hisPly = 0;
		gameBoard.moveListStart[gameBoard.ply] = 0;
		gameBoard.posKey = 0;
	};

	var squareSixtyFour = function( squareOneTwenty ) {
		return oneTwentyTo64[ squareOneTwenty ];
	};

	var squareOneTwenty = function( squareSixtyFour ) {
		return sixtyFourTo120[ squareSixtyFour ];
	};

	var updateMaterialList = function() {
		var piece,
			pieceColor,
			square;

		// reset chess pieces to empty
		for( var p = 0; p < 14 * 120; p++ ) {
			gameBoard.pieceList[p] = chessPieces.empty;
		}

		console.log( 'PIECELIST RESET' );

		// reset the piece material
		// for( var m = 0; m < 2; m++ ) {
			// gameBoard.material[m] = 0;
		// }

		// console.log( 'MATERIAL RESET' );

		// reset number of pieces
		for( var n = 0; n < 13; n++ ) {
			gameBoard.pieceNum[n] = 0;
		}

		console.log( 'PIECENUM RESET');

		for( var i = 0; i < 64; i++ ) {
			square = squareOneTwenty(i);
			piece = gameBoard.pieces[square];

			if( piece != chessPieces.empty ) {
				console.log('MATERIAL!! piece ' + piece + ' is on square ' + square);
				pieceColor = colors[ piece ];

				// gameBoard.mater
				gameBoard.pieceList[pieceIndex( piece, gameBoard.pieceNum[piece] )] = square;
				gameBoard.pieceNum[piece]++;
			}
		}
	};

	initFileRankBoard();
	initPieceKeys();
	init120squaresTo64();
	parsePosFEN( currentPos );
	parseColor( color );
	printBoard();


};

var chessGame = new chess( 'r2rb1k1/pp1q1p1p/2n1p1p1/2bp4/5P2/PP1BPR1Q/1BPN2PP/R5K1', 'black');
