import React from 'react';
import ReactTable from 'react-table';
import styles from './ChessApp.css';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import Chessdiagram from 'react-chessdiagram'; 
import { defaultGetRows, calculateMoveNumber } from "./helpers.jsx";

const lightSquareColor = '#f2f2f2'
const darkSquareColor = '#bfbfbf'
const currentPosition =  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
const flip = false;

const width = window.innerWidth;
const maxSquareSize = 50;
const squareSize = Math.min(width / 10, maxSquareSize)

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

export class Board extends React.Component {
  constructor(props){
    super(props);
  }
  render = () => <Chessdiagram lip={flip} fen={ this.props.fen } squareSize={squareSize} lightSquareColor={lightSquareColor} darkSquareColor={darkSquareColor}/>
}

export class MoveTable extends React.Component {
  constructor(props){
    super(props);
  }
  getMoves = () => defaultGetRows(this.props.pgn);
  rowMapper = (row, index) => ({moveNumber: row[0], white: row[1], black: row[2]});
  getData = () => this.getMoves().map(this.rowMapper);
  render = () => {
    var data = this.getData();
    if (data.length == 0) return <div style={{textAlign: "center"}}>No moves yet</div>
    return <div id="moveTable" className={styles.gameTable}> <ReactTable pageSize={data.length} showPagination={false} data={data} columns={moveColumns} getTdProps={this.onRowClick}/></div>
  }
}
