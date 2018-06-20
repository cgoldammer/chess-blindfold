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

const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

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
export const getBest = (fen, callback) => {
  sf.postMessage('position fen ' + fen);
  sf.postMessage('go depth 2');
  sf.onmessage = event => {
    if (event.data.startsWith('bestmove')){
      const move = event.data.split(" ")[1];
      return callback(move);
    }
  }
}
