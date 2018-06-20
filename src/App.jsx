import React from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import { ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';

import { AppNavbar } from './AppNavbar.jsx';
import { List } from 'immutable';
import { ChessApp } from './ChessApp.jsx';

import { newClient, isMoveValid } from './helpers.jsx'
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
    const moveValid = isMoveValid(this.props.gameClient, move);
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
    return (
      <div>
				<Col sm={4} smOffset={4}>
					<FormControl
						bsSize="large"
						ref="inputNode"
						type="text"
						onChange={ this.onChange }
						onKeyPress={this.handleKeyPress}
						value={ this.state.value }
					/>
					<Button id="submitButton" onClick={ this.submit }>Submit</Button>
				</Col>
      </div>
    )
  }
}

const startingState = () => {
	const gameClient = newClient();
	return {
		moves: List([])
	, gameClient: gameClient
	, ownColorWhite: true
	, colorToMoveWhite: true
	, showBoard: false
	}
}

export class App extends React.Component {
	constructor(props){
    const gameClient = newClient();
		super(props);
    this.state = startingState()
	}
	reset = () => this.setState(startingState())
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
    const fen = this.state.gameClient.fen()
    getBest(fen, this.makeMove)
  }
	render = () => {
		return (
      <div>
        <AppNavbar/>
        <Grid fluid>
          <Row>
            <MoveEntry gameClient={ this.state.gameClient } makeMove={ this.makeMove } />
          </Row>
          <Row>
            Moves
          </Row>
          <Row>
            <ChessApp fen={ this.state.gameClient.fen() } pgn={ this.state.gameClient.pgn() }/>
          </Row>
					<Button id="resetButton" onClick={ this.reset }>Reset</Button>
        </Grid>
      </div>
		)
	}
}
