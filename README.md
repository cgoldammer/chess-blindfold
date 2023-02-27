# Warning:

My logging tells me that there's many users (thank you!) but this app is not in active development. I generally like working on it, but can't promise that I'll respond. I do appreciate PRs (preferably with tests) and try to review them, but sometimes it just takes time. I can promise that I read every email and feedback request I get and am very happy to hear from you! 

If you do want to become a maintainer of this project and direct the experience of the >2K users a month (as of Feb 22), let me know!

# Blindfold chess

This is an app to train you in playing blindfold. Think of it as stockfish without the board. You see all possible moves and click on a move to make it.

The app is optimized for mobile play and aims to be as simple as possible. You should just be able to click to play.

# Features

- Show the board if you can't fully remember the position
- Change the stockfish difficulty
- Provide different display options for possible moves. For instance, don't show whether a move is taking a piece, which makes the game harder.

# Possible improvements

Note: I'm not actively developing this library, but always happy for others to submit PRs and will review them.

- Rewind moves by clicking on the list of moves
- Show board with only pawn structure
- Ask questions about position (e.g. what are the fields for the white pawns?)
- Store results so you can find out whether you are improving

# Compiling the code

To compile the app, you need to run the `setup.sh` script. The main task of the script is to download compiled code for Stockfish.js.


