import React from "react";
import PropTypes from "prop-types";
import styles from "./App.css";
import {
  Alert,
  Badge,
  ToggleButton,
  ButtonGroup,
  Button,
  FormControl,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Select from "react-select";

import { AppNavbar } from "./AppNavbar.jsx";
import { List } from "immutable";
import { Board, MoveTable } from "./ChessApp.jsx";

import { GameClient, gameStatus } from "./helpers.jsx";
import { getBest } from "./engine.js";

/* The window to enter moves. There are currently two options:
(1) Click on buttons, one for each move
(2) Enter the move in a text field and hit enter - disabled by default

Through trial and error I noticed that the first option simply works better, especially
when using a phone.
*/
export class MoveEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", warning: null };
  }
  focus = () => {
    let node = this.inputNode;
    if (node && node.focus instanceof Function) {
      node.focus();
    }
  };
  componentDidMount() {
    this.focus();
  }
  setValue = (value) => this.setState({ value: value });
  onChange = (e) => this.setValue(e.target.value);
  handleKeyPress = (target) => {
    if (target.charCode == 13) {
      this.submit();
    }
  };
  submit = () => this.makeMove(this.state.value);
  makeMove = (move) => {
    const moveValid = this.props.gameClient.isMoveValid(move);
    if (moveValid) {
      this.props.makeMove(move);
      this.setState({ value: "", warning: null });
    } else {
      this.showWarning("Move is not valid");
    }
  };
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    this.focus();
  };
  showWarning = (warning) => this.setState({ warning: warning });
  /* Display the move according to the app settings.
  For instance, if the `showIfCheck` setting is `false`, then remove the "+" from any move
  */
  displayMove = (move) => {
    var formattedMove = move;
    if (!this.props.parentState.showIfMate) {
      formattedMove = formattedMove.replace("#", "+");
    }
    if (!this.props.parentState.showIfTakes) {
      formattedMove = formattedMove.replace("x", "");
    }
    if (!this.props.parentState.showIfCheck) {
      formattedMove = formattedMove.replace("+", "");
    }
    return formattedMove;
  };
  render = () => {
    const moves = this.props.gameClient.client.moves();
    const buttonForMove = (move) => (
      <Col key={move} xs={3} md={2}>
        <div
          className={styles.moveButton}
          onClick={() => this.props.makeMove(move)}
        >
          {this.displayMove(move)}
        </div>
      </Col>
    );
    const input = !this.props.enterMoveByKeyboard ? (
      <Row style={{ marginLeft: 10, marginRight: 10 }}>
        {moves.map(buttonForMove)}
      </Row>
    ) : (
      <div>
        <Row>
          <Col sm={{ span: 4, offset: 4 }}>
            <FormControl
              ref={(ref) => (this.inputNode = ref)}
              type="text"
              onChange={this.onChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.value}
            />
          </Col>
          <Col sm={2}>
            <Button id="submitButton" onClick={this.submit}>
              Submit
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 3, offset: 6 }}>
            <div style={{ color: "red" }}> {this.state.warning} </div>
          </Col>
        </Row>
      </div>
    );
    return <div>{input}</div>;
  };
}

MoveEntry.propTypes = {
  enterMoveByKeyboard: PropTypes.bool,
  makeMove: PropTypes.func,
  gameClient: PropTypes.any,
  parentState: PropTypes.object,
};

const resetState = () => {
  const gameClient = new GameClient();
  return {
    moves: List([]),
    gameClient: gameClient,
    colorToMoveWhite: true,
    showBoard: false,
    showType: "make",
  };
};

/* Obtaining the starting state for a new game.
The starting state is not the same as the reset state, because we want
some properties, e.g. the Stockfish level, to persist throughout games.
The reset state does not contain these properties, so we need to add them 
here.
*/
var startingState = () => {
  var state = resetState();
  state["ownColorWhite"] = true;
  state["depth"] = 3;
  state["skillLevel"] = 0;
  state["showIfMate"] = false;
  state["showIfTakes"] = true;
  state["showIfCheck"] = true;
  state["enterMoveByKeyboard"] = false;
  return state;
};

/* Get the stockfish levels in terms of Elo rating.
Stockfish levels range from 0 (1100 Elo) to 20 (3100 Elo)
These are really very rough heuristics, but should be close enough for
our purposes.
*/
const getStockfishLevels = () => {
  var values = [];
  const numLevels = 20;
  const minElo = 1100;
  const maxElo = 3100;
  for (var i = 0; i <= numLevels; i++) {
    const elo =
      Math.floor((minElo + (maxElo - minElo) * (i / numLevels)) / 100) * 100;
    values.push({ value: i, label: elo });
  }
  return values;
};

const getStockfishDepthValues = () => {
  var values = [];
  const numDepths = 30;
  const minDepth = 3;
  for (var i = 0; i <= numDepths; i++) {
    const depth = minDepth + i;
    values.push({ value: depth, label: depth });
  }
  return values;
};

/* Displays the window to change settings */
export class SettingsWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const depthValues = getStockfishDepthValues();
    const values = getStockfishLevels();

    const valsButtons = [
      { str: "Yes", value: true },
      { str: "False", value: false },
    ];

    const valsColor = [
      { str: "White", value: true },
      { str: "Black", value: false },
    ];

    /* Obtain the toggle button to turn a property on or off */
    const buttonForProperty = (name, display, values) => {
      return (
        <Row>
          <Col xs={6}>
            <div>{display}</div>
          </Col>
          <Col xs={6}>
            <ButtonGroup
              type="radio"
              name="options"
              value={this.props.parentState[name]}
            >
              {values.map((val, idx) => (
                <ToggleButton
                  key={idx}
                  value={val.value}
                  variant={
                    this.props.parentState[name] == val.value
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => this.props.setProperty(name, val.value)}
                >
                  {val.str}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      );
    };

    const hr = (
      <hr
        style={{
          height: "2px",
          border: "0 none",
          color: "lightGray",
          backgroundColor: "lightGray",
        }}
      />
    );
    const displaySettings = this.props.parentState
      .enterMoveByKeyboard ? null : (
      <div>
        {hr}
        {buttonForProperty("showIfMate", "Show if move is mate", valsButtons)}
        {hr}
        {buttonForProperty("showIfCheck", "Show if move is check", valsButtons)}
        {hr}
        {buttonForProperty(
          "showIfTakes",
          "Show is move is taking piece",
          valsButtons
        )}
      </div>
    );

    return (
      <div>
        <Row>
          <Col xs={6}>
            <div> Stockfish depth: </div>
          </Col>
          <Col xs={6}>
            <Select
              clearable={false}
              value={{ label: this.props.depth }}
              isSearchable={false}
              onChange={this.props.setDepth}
              options={depthValues}
            />
          </Col>
        </Row>
        {hr}
        <Row>
          <Col xs={6}>
            <div> Stockfish strength (Elo): </div>
          </Col>
          <Col xs={6}>
            <Select
              clearable={false}
              value={{ label: values[this.props.skillLevel].label }}
              isSearchable={false}
              onChange={this.props.setSkill}
              options={values}
            />
          </Col>
        </Row>
        {hr}
        {buttonForProperty("ownColorWhite", "You play", valsColor)}
        {hr}
        {buttonForProperty(
          "enterMoveByKeyboard",
          "Enter moves by keyboard",
          valsButtons
        )}
        {displaySettings}
      </div>
    );
  };
}

SettingsWindow.propTypes = {
  setDepth: PropTypes.func,
  depth: PropTypes.number,
  setSkill: PropTypes.func,
  skillLevel: PropTypes.number,
  parentState: PropTypes.object,
  setProperty: PropTypes.func,
};

/* The statuswindow provides the status of the games and the last moves
by the player and the computer */
export class StatusWindow extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const humanText = this.props.humanMove ? (
      <div>
        <span>You played </span>
        <Badge bg="secondary"> {this.props.humanMove}</Badge>
      </div>
    ) : (
      <span>Make your move!</span>
    );
    const computerText = this.props.computerMove ? (
      <div>
        <span>Computer played </span>
        <Badge bg="secondary">{this.props.computerMove}</Badge>
      </div>
    ) : (
      <span>Computer is waiting...</span>
    );
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={6}>
            <Alert
              style={{ fontSize: "125%", height: 50, paddingTop: 10 }}
              className="text-center"
              variant={this.props.status[2]}
            >
              {" "}
              {this.props.status[1]}
            </Alert>
          </Col>
          <Col xs={6}>
            <div className="text-center">
              {this.props.status == gameStatus.starting ? null : (
                <Button
                  style={{ height: 50 }}
                  className={styles.newGameButton}
                  variant="primary"
                  id="resetButton"
                  onClick={this.props.reset}
                >
                  Start New
                </Button>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <div className="text-center">
            <span className={styles.statusStyle}>{humanText}</span>
          </div>
        </Row>
        <Row>
          <div className="text-center">
            <span className={styles.statusStyle}>{computerText}</span>
          </div>
        </Row>
      </div>
    );
  };
}

StatusWindow.propTypes = {
  reset: PropTypes.func,
  status: PropTypes.any,
  computerMove: PropTypes.string,
  humanMove: PropTypes.string,
  setDepth: PropTypes.any,
  depth: PropTypes.number,
  setSkill: PropTypes.any,
  skillLevel: PropTypes.number,
};

/* The main app, which pulls in all the other windows. */
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = startingState();
  }
  reset = () => this.setState(resetState(), this.makeComputerMove);
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    var table = document.getElementById("moveTable");
    if (table != null && "scrollHeight" in table) {
      table.scrollTop = table.scrollHeight;
    }
  };
  makeMove = (move) => {
    const newMoves = this.state.moves.push(move);
    this.state.gameClient.move(move, { sloppy: true });
    // If automoving is enabled, my move leads to a move by the computer.
    const nextMoveCallback = this.props.autoMove
      ? this.makeComputerMove
      : () => {};
    const newState = {
      moves: newMoves,
      colorToMoveWhite: !this.state.colorToMoveWhite,
    };
    this.setState(newState, nextMoveCallback);
  };
  isPlayersMove = () => this.state.ownColorWhite == this.state.colorToMoveWhite;
  makeComputerMove = () => {
    // Only make a computer move if it's not the player's turn
    if (this.isPlayersMove()) {
      return;
    }
    const fen = this.state.gameClient.client.fen();
    getBest(this.state.depth, this.state.skillLevel, fen, this.makeMove);
  };
  shownElement = () => {
    switch (this.state.showType) {
      case "make":
        return this.makeMoveElement();
      case "moves":
        return this.moveTableElement();
      case "board":
        return this.boardElement();
      case "settings":
        return this.settingsElement();
    }
  };
  getLastMove = (offsetTrue, offsetFalse) => () => {
    const history = this.state.gameClient.client.history();
    const offset = !this.isPlayersMove() ? offsetTrue : offsetFalse;
    return history[history.length - offset];
  };
  getLastComputerMove = this.getLastMove(2, 1);
  getLastHumanMove = this.getLastMove(1, 2);
  makeMoveElement = () => (
    <div>
      <StatusWindow
        reset={this.reset}
        status={this.state.gameClient.getStatus()}
        humanMove={this.getLastHumanMove()}
        computerMove={this.getLastComputerMove()}
      />
      <Row>
        <MoveEntry
          enterMoveByKeyboard={this.state.enterMoveByKeyboard}
          gameClient={this.state.gameClient}
          makeMove={this.makeMove}
          parentState={this.state}
        />
      </Row>
    </div>
  );
  boardElement = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Board fen={this.state.gameClient.client.fen()} />
      </div>
    );
  };
  handleChange = (value) => this.setState({ showType: value });
  moveTableElement = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MoveTable pgn={this.state.gameClient.client.pgn()} />
      </div>
    );
  };
  setDepth = (depth) => {
      this.setState({ depth: depth.value });
  };
  setSkill = (skill) => {
    this.setState({ skillLevel: skill.value });
  };
  setOwnColor = (isWhite) =>
    this.setState({ ownColorWhite: isWhite }, this.makeComputerMove);
  setProperty = (name, value) => {
    var newState = {};
    newState[name] = value;

    var callback = () => {};
    if (name == "ownColorWhite") {
      callback = this.makeComputerMove;
    }

    this.setState(newState, callback);
  };
  settingsElement = () => (
    <SettingsWindow
      depth={this.state.depth}
      setDepth={this.setDepth}
      skillLevel={this.state.skillLevel}
      setSkill={this.setSkill}
      ownColorWhite={this.state.ownColorWhite}
      setOwnColor={this.setOwnColor}
      setProperty={this.setProperty}
      parentState={this.state}
    />
  );
  render = () => {
    return (
      <div>
        <Container>
          <Col md={{ span: 6, offset: 3 }}>
            <Row>
              <AppNavbar />
            </Row>
            <Row>
              <ButtonGroup className="mb-2">
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => this.handleChange("make")}
                >
                  Play
                </Button>
                <Button
                  variant="secondary"
                  className="btn btn-default w-100"
                  onClick={() => this.handleChange("moves")}
                >
                  Moves
                </Button>
                <Button
                  variant="secondary"
                  className="btn btn-default w-100"
                  onClick={() => this.handleChange("board")}
                >
                  Board
                </Button>
                <Button
                  variant="secondary"
                  className="btn btn-default w-100"
                  onClick={() => this.handleChange("settings")}
                >
                  Settings
                </Button>
              </ButtonGroup>
            </Row>
            <div style={{ marginTop: 10 }}>{this.shownElement()}</div>
          </Col>
        </Container>
      </div>
    );
  };
}

App.defaultProps = {
  showInput: false,
};

App.propTypes = {
  autoMove: PropTypes.bool,
};
