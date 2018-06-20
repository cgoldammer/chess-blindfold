import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import { List } from 'immutable';

jest.mock('./Context')
jest.mock('./engine')

import { App, MoveEntry } from './App.jsx';
import { appName } from './AppNavbar.jsx';
import { newClient } from './helpers.jsx';
import { getBest } from './engine.js';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import { dummy } from './Context.js';

import { startingFen, isMoveValid } from './helpers.jsx'

test('the app contains a move entry', () => {
  const wrapper = mount(<App autoMove={ false } />);
  expect(wrapper.find(MoveEntry)).toHaveLength(1);
});

test('the app stores the moves', () => {
  const wrapper = mount(<App autoMove={ false }/>);
  const move = 'e4';
  expect(wrapper.state()['moves']).toEqual(List([]));
  wrapper.instance().makeMove(move);
  expect(wrapper.state()['moves']).toEqual(List([move]));
});

test('after I make a move, the active color changes', () => {
  const wrapper = mount(<App autoMove={ false }/>);
  expect(wrapper.state()['colorToMoveWhite']).toEqual(true);
  const move = 'e4';
  wrapper.instance().makeMove(move);
  wrapper.update();
  expect(wrapper.state()['colorToMoveWhite']).toEqual(false);
});

const getPositionClient = () => {
  const gc = newClient();
  gc.move('e4');
  gc.move('f5');
  return gc
}

describe('If I enter moves, then', () => {
	test('an invalid move is invalid', () => {
		expect(isMoveValid(newClient(), 'e5')).toEqual(false);
	});
	test('a valid move is valid', () => {
		expect(isMoveValid(newClient(), 'e4')).toEqual(true);
	});
	test('taking move requires x to be valid', () => {
		const gc = getPositionClient();
		expect(isMoveValid(gc, 'exf5')).toEqual(true);
		expect(isMoveValid(gc, 'ef5')).toEqual(false);
	});
	test('Checks require including a "+"', () => {
		const gc = getPositionClient();
		expect(isMoveValid(gc, 'Qh5+')).toEqual(true);
		expect(isMoveValid(gc, 'Qh5')).toEqual(false);
	});
	test('I can enter moves in the format stockfish uses', () => {
		const gc = newClient();
		gc.move('g1f3', {sloppy: true});
		expect(isMoveValid(gc, 'Nf6')).toEqual(true);
	});
});

describe('Testing the dummy engine', () => {
	test('get best returns a move in the starting position', () => {
		const mockCallback = jest.fn();
		getBest(startingFen, mockCallback);
		expect(mockCallback.mock.calls[0][0]).toBeTruthy
	});

	test('get best returns no move if mated', () => {
		const mockCallback = jest.fn();
		const matedFen = 'rrk5/8/K7/8/8/8/8/8 w - -'
		getBest(matedFen, mockCallback);
		expect(mockCallback.mock.calls[0][0]).not.toBeTruthy
	});
});

