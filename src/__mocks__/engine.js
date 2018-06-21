
/* A hack for a weird problem: The import is handled differently
when running in webpack-dev-server and through jest. 
Just importing twice, and using the one version that works */
import { Chess } from 'chess.js';
import Chess2 from 'chess.js';

export const getBest = (skillLevel, fen, callback) => {
  const client = Chess ? new Chess(fen) : new Chess2(fen);
  const moves = client.moves();
  const move = moves.length > 0 ? moves[0] : null;
  return callback(move)
}
