import React from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import { Form, FormGroup, ControlLabel, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select'

import { AppNavbar } from './AppNavbar.jsx';
import { List } from 'immutable';
import { Board, MoveTable } from './ChessApp.jsx';

import { GameClient, startingFen } from './helpers.jsx'
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
		for (var i=0; i<=20; i++){
			values.push({'value': i, label: i})
		}
		
		return (
			<div>
				<Row>
					<Col xs={6}>
						<div style={{verticalAlign: "bottom"}}> Strength of stockfish </div>
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
				<hr/>
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
  makeComputerMove = () => {
    // Only make a computer move if it's not the player's turn
    if (this.state.ownColorWhite == this.state.colorToMoveWhite){
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
	getLastComputerMove = () => {
		const history = this.state.gameClient.client.history()
		return history[history.length - 1];
	}
	getLastHumanMove = () => {
		const history = this.state.gameClient.client.history()
		return history[history.length - 2];
	}
	makeMoveElement = () => (
		<div>
			<Row style= {{ height:"50px", fontSize: "200%", textAlign: "center", marginTop: 10}}>
				{ this.state.gameClient.getStatus()[1] }
			</Row>
			<Row style= {{ height:"50px", fontSize: "200%", textAlign: "center", marginTop: 10}}>
				{ this.getLastHumanMove() ? "You played: " + this.getLastHumanMove() : "Make your move!" }
			</Row>
			<Row style= {{ height:"50px", fontSize: "200%", textAlign: "center", marginTop: 10}}>
				{ this.getLastComputerMove() ? "Computer played: " + this.getLastComputerMove() : "The computer is waiting..." }
			</Row>
			<Row>
				<MoveEntry showInput={ this.props.showInput } gameClient={ this.state.gameClient } makeMove={ this.makeMove } />
			</Row>
			<Row style= {{ marginTop: 20}}>
				<Col xs={6} xsOffset={3}>
					<Button bsStyle="warning" block id="resetButton" onClick={ this.reset }>Start new game</Button>
				</Col>
			</Row>
		</div>
	)
	boardElement = () => <Board fen={ this.state.gameClient.client.fen() }/>
	handleChange = value => this.setState({ showType: value });
	moveTableElement = () => <MoveTable pgn={ this.state.gameClient.client.pgn() }/>
  setSkill = skill => this.setState({ skillLevel: skill });
	settingsElement = () => <SettingsWindow skillLevel={ this.state.skillLevel } setSkill={ this.setSkill }/>
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
