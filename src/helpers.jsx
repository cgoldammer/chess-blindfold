import { List } from 'immutable';

/* A hack for a weird problem: The import is handled differently
when running in webpack-dev-server and through jest. 
Just importing twice, and using the one version that works */
import { Chess } from 'chess.js';
import Chess2 from 'chess.js';

import { getBest } from './engine.js';


// Using either `Chess` or `Chess2` - see the reason for this hack above
export const newClient = () => (Chess ? new Chess() : new Chess2())

export const isMoveValid = (gameClient, move) => {
  const allMoves = List(gameClient.moves())
  return allMoves.contains(move);
}

export const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const defaultGetRows = (movetext, newlineChar) => { // eslint-diable-line no-unused-vars
  newlineChar;
  let ms = movetext;
  if (!ms) {
    return [];
  }
  /* delete comments */
  ms = ms.replace(/(\{[^}]+\})+?/g, '');

  /* delete recursive annotation variations */
  const ravRegex = /(\([^\(\)]+\))+?/g;
  while (ravRegex.test(ms)) {
    ms = ms.replace(ravRegex, '');
  }

  /* delete numeric annotation glyphs */
  ms = ms.replace(/\$\d+/g, '');

  /* Delete result */
  ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, '');

  /* Delete any double spaces */
  ms = ms.replace(/\s\s/g, ' ').trim();

  /* Split into rows */
  const rows = [];
  const rowRegex = /\d+\.\s?\S+(?:\s+\S+)?/g;
  while (true) {
    const result = rowRegex.exec(ms);
    if (!result) {break;}
    const row = result[0].split(/\s|\.\s?/g);
    row[0] = parseInt(row[0]);
    rows.push(row);
  }
  return rows;
};

export const calculateMoveNumber = (number, isBlack) => 1 + ((number - 1) * 2 + isBlack);
