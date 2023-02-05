/*
Loading stockfish. This will require web workers to function correctly.
*/

var sf;
try {
  sf = new Worker("./shared/stockfish.js");
} catch (err) {
  sf = {};
}

/* 
A worker requires `onmessage`, otherwise I'd get an error.
This is re-set to something usable when we are posting values to
stockfish
*/

/* eslint-disable no-unused-vars */
sf.onmessage = function (event) {};

/* 
Get the best move in a given position, and call the `callback` with the
move when it's found.
The default depth was here fixed on 3 and so very low. This gives good success in the first blindfolded games
but it's too small against exercised players even if Stockfish gets highest level.
Now it is settable in the app.
*/
export const getBest = (depth, level, fen, callback) => {
  sf.postMessage("position fen " + fen);
  sf.postMessage("setoption name Skill Level value " + level);
  sf.postMessage("go depth " + depth);
  sf.onmessage = (event) => {
    if (event.data.startsWith("bestmove")) {
      const move = event.data.split(" ")[1];
      return callback(move);
    }
  };
};
