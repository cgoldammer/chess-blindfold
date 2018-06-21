import React from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import { Form, FormGroup, ControlLabel, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select'

import { AppNavbar } from './AppNavbar.jsx';
import { List } from 'immutable';
import { Board, MoveTable } from './ChessApp.jsx';

import { GameClient, startingFen, gameStatus } from './helpers.jsx'
import { getBest } from './engine.js'


export class MoveEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = { value: '' }
  }
	focus = () => {
		let node = ReactDOM.findDOMNode(this.refs.inputNode);
		if (node && node.focus instanceof Function) {
			node.focus();
		}
	}
  componentDidMount() {
		this.focus();
	}
	setValue = value => this.setState({value: value})
	onChange = e => this.setValue(e.target.value)
		handleKeyPress = target => {
			if (target.charCode == 13){
				this.submit();
			}
  }
  submit = () => this.makeMove(this.state.value);
  makeMove = move => {
    const moveValid = this.props.gameClient.isMoveValid(move);
    if (moveValid){
      this.props.makeMove(move);
			this.setState({ value: ''})
    }
    else {
      this.moveInvalid();
    }
  }
	componentDidUpdate = (prevProps, prevState, snapshot) => {
		this.focus()
	}
  moveInvalid = () => {
    
  }
  render = () => {
		const moves = this.props.gameClient.client.moves();
		const input = !this.props.showInput ? null :
				<div>
					<Row style={{ marginLeft: 0, marginRight: 0 }}>
						<Col sm={4} smOffset={4}>
							<FormControl
								bsSize="large"
								ref="inputNode"
								type="text"
								onChange={ this.onChange }
								onKeyPress={this.handleKeyPress}
								value={ this.state.value }
							/>
						</Col>
						<Col sm={2}>
							<Button id="submitButton" onClick={ this.submit }>Submit</Button>
						</Col>
					</Row>
				</div>
    return (
      <div>
				{ input }
				<Row style={{ marginLeft: 0, marginRight: 10 }}>
					{ moves.map(move => <Col key={ move } xs={3} md={2} ><div className={styles.moveButton} onClick={ () => this.props.makeMove(move) }>{ move }</div></Col>) }
				</Row>
      </div>
    )
  }
}

const startingState = () => {
	const gameClient = new GameClient();
	return {
		moves: List([])
	, skillLevel: 0
	, gameClient: gameClient
	, ownColorWhite: true
	, colorToMoveWhite: true
	, showBoard: false
	, showType: "make"
	}
}

export class SettingsWindow extends React.Component {
	constructor(props){
		super(props);
	}
	render = () => {
		var values = [];
		const numLevels = 20;
		const minElo = 1100;
		const maxElo = 3100;
		for (var i=0; i<=numLevels; i++){
			const elo = Math.floor((minElo + (maxElo - minElo) * (i / numLevels)) / 100) * 100;
			values.push({value: i, label: elo})
		}
		
		return (
			<div>
				<Row>
					<Col xs={6}>
						<div> Stockfish strength (Elo): </div>
					</Col>
					<Col xs={6}>
						<Select
							clearable={ false }
							value={ this.props.skillLevel }
							onChange={ this.props.setSkill }
							options={ values }
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={6}>
						<div> You play: </div>
					</Col>
					<Col xs={6}>
						<ToggleButtonGroup justified type="radio" name="options" value={ this.props.ownColorWhite } onChange={this.props.setOwnColor}>
							<ToggleButton value={ true }>White</ToggleButton>
							<ToggleButton value={ false }>Black</ToggleButton>
						</ToggleButtonGroup>
					</Col>
				</Row>
				<hr/>
			</div>
		)
	}
}

export class StatusWindow extends React.Component {
	constructor(props){
		super(props);
	}
	render = () => {
		const humanText = this.props.humanMove ? "You played: " + this.props.humanMove : "Make your move!"
		const computerText = this.props.computerMove ? "Computer played: " + this.props.computerMove : "The computer is waiting..."
		const style = { height:"50px", fontSize: "200%", textAlign: "center", marginTop: 10}
		return (
			<div>
				<Row style= { style }>
					{ this.props.status }
				</Row>
				<Row style= { style }>
					{ humanText }
				</Row>
				<Row style={ style }>
					{ computerText }
				</Row>
			</div>
		)
	}
}

export class App extends React.Component {
	constructor(props){
		super(props);
    this.state = startingState()
	}
	reset = () => this.setState(startingState())
	componentDidUpdate = (prevProps, prevState, snapshot) => {
		var table = document.getElementById("moveTable");
		if (table != null && "scrollHeight" in table){
			console.log("scroll");
			table.scrollTop = table.scrollHeight;
		}
	}
  makeMove = move => {
    const newMoves = this.state.moves.push(move);
    this.state.gameClient.move(move, {sloppy: true});
    // If automoving is enabled, my move leads to a move by the computer.
    const nextMoveCallback = this.props.autoMove ? this.makeComputerMove : () => {}
    const newState = { moves: newMoves, colorToMoveWhite: !this.state.colorToMoveWhite }
    this.setState(newState, nextMoveCallback);
  }
	isPlayersMove = () => this.state.ownColorWhite == this.state.colorToMoveWhite
  makeComputerMove = () => {
    // Only make a computer move if it's not the player's turn
    if (this.isPlayersMove()){
      return 
    }
    const fen = this.state.gameClient.client.fen()
    getBest(this.state.skillLevel, fen, this.makeMove)
  }
	shownElement = () => {
		if (this.state.showType == "make") return this.makeMoveElement()
		if (this.state.showType == "moves") return this.moveTableElement()
		if (this.state.showType == "board") return this.boardElement()
		if (this.state.showType == "settings") return this.settingsElement()
	}
	getLastMove = (offsetTrue, offsetFalse) => () => {
		const history = this.state.gameClient.client.history()
		const offset = !this.isPlayersMove() ? offsetTrue : offsetFalse
		return history[history.length - offset];
	}
	getLastComputerMove = this.getLastMove(2, 1)
	getLastHumanMove = this.getLastMove(1, 2)
	makeMoveElement = () => (
		<div>
			<StatusWindow status={ this.state.gameClient.getStatus()[1] } humanMove = { this.getLastHumanMove() } computerMove = { this.getLastComputerMove() }/>
			<Row>
				<MoveEntry showInput={ this.props.showInput } gameClient={ this.state.gameClient } makeMove={ this.makeMove } />
			</Row>
			<Row style= {{ marginTop: 20}}>
				{ this.state.gameClient.getStatus() == gameStatus.starting ? null :
					<Col xs={6} xsOffset={3}>
						<Button bsStyle="warning" block id="resetButton" onClick={ this.reset }>Start new game</Button>
					</Col>
				}
			</Row>
		</div>
	)
	boardElement = () => <Board fen={ this.state.gameClient.client.fen() }/>
	handleChange = value => this.setState({ showType: value })
	moveTableElement = () => <MoveTable pgn={ this.state.gameClient.client.pgn() }/>
  setSkill = skill => this.setState({ skillLevel: skill.value })
	setOwnColor = isWhite => this.setState({ ownColorWhite: isWhite }, this.makeComputerMove)
	settingsElement = () => <SettingsWindow skillLevel={ this.state.skillLevel } setSkill={ this.setSkill } ownColorWhite={ this.state.ownColorWhite } setOwnColor= { this.setOwnColor }/>
	render = () => {
		return (
      <div>
        <AppNavbar/>
        <Grid>
					<Row>
						<Col sm={6} smOffset={3}>
							<Row>
								<ToggleButtonGroup justified type="radio" name="options" value={ this.state.showType } onChange={this.handleChange}>
									<ToggleButton value={"make"}>Play</ToggleButton>
									<ToggleButton value={"moves"}>Moves</ToggleButton>
									<ToggleButton value={"board"}>Board</ToggleButton>
									<ToggleButton value={"settings"}>Settings</ToggleButton>
								</ToggleButtonGroup>
							</Row>
							<div style={{ marginTop: 10 }}>
								{ this.shownElement() } 
							</div>
						</Col>
					</Row>
        </Grid>
      </div>
		)
	}
}

App.defaultProps = {
	showInput: false
}
