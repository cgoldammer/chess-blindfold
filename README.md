
# Blindfold chess

This is an app to train you in playing blindfold. Think of it as stockfish without the board. You see all possible moves and click on a move to make it.

The app is optimized for mobile play and aims to be as simple as possible. You should just be able to click to play.

As of February 2023, my logging tells me that there's 2K distinct users a month, with 100% growth over the last year, and a marketing budget of $0. Thanks to all of you, I'm simply happy that you're using this!

## Warning: Not in active development!

This app is **not in active development**.  I do appreciate PRs (preferably with tests) and try to review them, but sometimes it just takes me time. I read every email and feature request I get, and I think I respond to almost all of them, and if I don't, just send it again.

If you want to make your mark on this project and become the lead developer, just let me know!

## Features

- Show the board if you can't fully remember the position
- Change the stockfish difficulty
- Provide different display options for possible moves. For instance, don't show whether a move is taking a piece, which makes the game harder.

## Possible improvements

Note: I'm not actively developing this library, but always happy for others to submit PRs and will review them.

- Rewind moves by clicking on the list of moves
- Show board with only pawn structure
- Ask questions about position (e.g. what are the fields for the white pawns?)
- Store results so you can find out whether you are improving

## Compiling the code

To compile the app, you need to run the `setup.sh` script. The main task of the script is to download compiled code for Stockfish.js.


