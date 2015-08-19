Please write a program that takes these inputs and produces these outputs:

Inputs:
■	The current configuration of a chess board (which pieces are where)
■	Which player's turn it is to make the next move
Outputs:
■	A list of all moves the current player can legally make this turn
■	IMPORTANT: To simplify the task, you don't need to worry about whether a move would lead to the player's King being in check. Similarly, you are welcome to ignore the "castling" and "en passant" rules.
■	For details on legal chess moves, see the "Basic moves" section here under "Gameplay": f
Rules:
■	You are welcome to use any real programming language (no pseudo-code).
■	Do not use any libraries that are not part of the language's standard library.
■	Do not include any code in your solution that was not written by you.

For example, given a chess board in the initial state and the white player's turn, your program's output would look like this:

Pawn at <7:1> can move to <5:1>
Pawn at <7:1> can move to <6:1>
Pawn at <7:2> can move to <5:2>
Pawn at <7:2> can move to <6:2>
Pawn at <7:3> can move to <5:3>
Pawn at <7:3> can move to <6:3>
Pawn at <7:4> can move to <5:4>
Pawn at <7:4> can move to <6:4>
Pawn at <7:5> can move to <5:5>
Pawn at <7:5> can move to <6:5>
Pawn at <7:6> can move to <5:6>
Pawn at <7:6> can move to <6:6>
Pawn at <7:7> can move to <5:7>
Pawn at <7:7> can move to <6:7>
Pawn at <7:8> can move to <5:8>
Pawn at <7:8> can move to <6:8>
Knight at <8:2> can move to <6:1>
Knight at <8:2> can move to <6:3>
Knight at <8:7> can move to <6:6>
Knight at <8:7> can move to <6:8>
20 legal moves (10 unique pieces) for white player
