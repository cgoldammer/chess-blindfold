import { List } from "immutable";

/* A hack for a weird problem: The import is handled differently
when running in webpack-dev-server and through jest. 
Just importing twice, and using the one version that works */
import { Chess } from "chess.js";
import Chess2 from "chess.js";

import { getBest } from "./engine.js";

// Using either `Chess` or `Chess2` - see the reason for this hack above
export const newClient = (fen = startingFen) =>
  Chess ? new Chess(fen) : new Chess2(fen);

export const startingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const gameStatus = {
  starting: [0, "Starting", "secondary"],
  active: [1, "Playing", "secondary"],
  whiteWon: [2, "White won", "danger"],
  blackWon: [3, "Black won", "danger"],
  draw: [4, "Draw", "warning"],
};

export class GameClient {
  constructor(fen = startingFen) {
    this.client = newClient(fen);
  }
  temp = () => true;
  isMoveValid = (move) => {
    // To test whether a move is valid, we need to create a new client
    // to ensure we are not changing the existing client's state
    const client = newClient(this.client.fen());
    const result = client.move(move, { sloppy: true });
    return result != null;
  };
  move = (mv) => this.client.move(mv, { sloppy: true });
  getStatus = () => {
    const client = this.client;
    if (client.history().length == 0) return gameStatus.starting;
    if (client.in_checkmate())
      return client.turn() == "b" ? gameStatus.whiteWon : gameStatus.blackWon;
    if (client.in_stalemate()) return gameStatus.draw;
    return gameStatus.active;
  };
}

export const defaultGetRows = (movetext, newlineChar) => {
  // eslint-diable-line no-unused-vars
  newlineChar;
  let ms = movetext;
  if (!ms) {
    return [];
  }
  /* delete comments */
  ms = ms.replace(/(\{[^}]+\})+?/g, "");

  /* delete recursive annotation variations */
  const ravRegex = /(\([^\(\)]+\))+?/g;
  while (ravRegex.test(ms)) {
    ms = ms.replace(ravRegex, "");
  }

  /* delete numeric annotation glyphs */
  ms = ms.replace(/\$\d+/g, "");

  /* Delete result */
  ms = ms.replace(/(?:1-0|0-1|1\/2-1\/2|\*)$/, "");

  /* Delete any double spaces */
  ms = ms.replace(/\s\s/g, " ").trim();

  /* Split into rows */
  const rows = [];
  const rowRegex = /\d+\.\s?\S+(?:\s+\S+)?/g;
  while (true) {
    const result = rowRegex.exec(ms);
    if (!result) {
      break;
    }
    const row = result[0].split(/\s|\.\s?/g);
    row[0] = parseInt(row[0]);
    rows.push(row);
  }
  return rows;
};

export const calculateMoveNumber = (number, isBlack) =>
  1 + ((number - 1) * 2 + isBlack);
