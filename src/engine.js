/* A hack for a weird problem: The import is handled differently
when running in webpack-dev-server and through jest. 
Just importing twice, and using the one version that works */
import { Chess } from 'chess.js';
import Chess2 from 'chess.js';

/* Todo:
For test environment, mock out stockfish with a function that
returns a random move.
*/
try {
	var sf = new Worker('./stockfish.js');
}
catch(err) {
	var sf = ({})
}

/* 
A worker requires `onmessage`, otherwise I'd get an error.
This is re-set to something usable when we are posting values to
stockfish
*/
sf.onmessage = function(event) {
};

/* 
Get the best move in a given position, and call the `callback` with the
move when it's found 
*/
export const getBest = (level, fen, callback) => {
  sf.postMessage('position fen ' + fen);
  sf.postMessage('setoption name Skill Level value ' + level)
  sf.postMessage('go depth 2');
  sf.onmessage = event => {
    if (event.data.startsWith('bestmove')){
      const move = event.data.split(" ")[1];
      return callback(move);
    }
  }
}
