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
Right now, we are running analyses with very low depth. I don't think that should 
be a problem, since Stockfish is extremely strong even with such low depth, but
let me know if you feel like the depth should be increased or settable in the app.
*/
export const getBest = (level, fen, callback) => {
  sf.postMessage("position fen " + fen);
  sf.postMessage("setoption name Skill Level value " + level);
  sf.postMessage("go depth 3");
  sf.onmessage = (event) => {
    if (event.data.startsWith("bestmove")) {
      const move = event.data.split(" ")[1];
      return callback(move);
    }
  };
};
