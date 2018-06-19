import React from 'react';
import ReactTable from 'react-table';
import styles from './ChessApp.css';
import { Table, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import Chessdiagram from 'react-chessdiagram'; 
import { defaultGetRows, calculateMoveNumber } from "./helpers.jsx";

const lightSquareColor = '#f2f2f2'
const darkSquareColor = '#bfbfbf'
const currentPosition =  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
const flip = false;
const squareSize = 35;

const cols = [
  {
    Header: "Move",
    accessor: "moveNumber"
  },
  {
    Header: "White",
    accessor: "white"
  },
  {
    Header: "Black",
    accessor: "black"
  }
];
const moveColumns = cols;


export class ChessApp extends React.Component {
  constructor(props){
    super(props);
    this.state = { startMove: 0, showBoard: false };
    this.moves = defaultGetRows(props.pgn);
  }
  setToEnd = () => this.setMove(this.moves.length);
  toggleShow = () => { this.setState({showBoard: !this.state.showBoard}) }
  setMove = move => this.setState({startMove: move});
  rowMapper = (row, index) => ({moveNumber: row[0], white: row[1], black: row[2]});
  getData = () => this.moves.map(this.rowMapper);
  changeMove = (num) => () => {
    const transformer = (prevState, props) => {
      const next = prevState.startMove + num
      if (next >= 0 && next <= this.moves.length){
        return {startMove: next}
      }
    }
    this.setState(transformer);
  }

  onRowClick = (state, rowInfo, column, instance) => {
    const onClick = e => {
      const colName = column.id; 
      const moveNumber = rowInfo.row.moveNumber;
      const isBlack = colName == "black";
      const isWhite = colName == "white";
    
      if (isBlack || isWhite) {
        const num = calculateMoveNumber(moveNumber, isBlack);
        this.setMove(num);
      }
    };
    return {onClick: onClick}
  }
  
  render = () => {
    const data = this.getData();
    console.log(this.props.fen);
    const diagram = this.state.showBoard ? <Chessdiagram key={this.state.startMove} flip={flip} fen={ this.props.fen } squareSize={squareSize} lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/> : null

    return (
      <div>
        <Col sm={6}>>
          <ReactTable pageSize={data.length} showPagination={false} data={data} columns={moveColumns} getTdProps={this.onRowClick}/>
          <div className="text-center">
            <ButtonGroup>
              <Button onClick={() => this.setMove(0)}>Start</Button>
              <Button onClick={this.changeMove(-1)}>Previous</Button>
              <Button onClick={this.changeMove(1)}>Next</Button>
              <Button onClick={this.setToEnd}>End</Button>
            </ButtonGroup>
          </div>
				</Col>
				<Col sm={6}>
					<div>
            <Button onClick={ this.toggleShow }>Toggle show board</Button>
					</div>
					{ diagram }
        </Col>
      </div>
    )
  }
}
