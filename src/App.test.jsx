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

import { startingFen } from './helpers.jsx'

import { GameClient } from './helpers.jsx';

const getPositionClient = () => {
  const client = new GameClient();
  client.move('e4');
  client.move('f5');
  return client
}

describe('In the game client', () => {
  test('Checking for a valid move does not change the state', () => {
    const client = new GameClient()
    const move = 'e4';
    expect(client.isMoveValid('e4')).toEqual(true)
    expect(client.client.fen()).toEqual(startingFen)
  })
  test('Sloppy notation works', () => {
    const client = new GameClient()
    expect(client.isMoveValid('e4')).toEqual(true)
    expect(client.isMoveValid('e2e4')).toEqual(true)
  })
  test('but invalid moves are still invalid', () => {
    const client = new GameClient()
    expect(client.isMoveValid('e5')).toEqual(false)
    expect(client.isMoveValid('e2e5')).toEqual(false)
  })
  test('taking moves require "x"', () => {
    const client = getPositionClient();
    expect(client.isMoveValid('exf5')).toEqual(true);
    expect(client.isMoveValid('ef5')).toEqual(false);
  });
  test('Checks work with and without "+"', () => {
    const client = getPositionClient();
    expect(client.isMoveValid('Qh5+')).toEqual(true);
    expect(client.isMoveValid('Qh5')).toEqual(true);
  });
  test('I can enter moves in the format stockfish uses', () => {
    const client = new GameClient();
    client.move('g1f3', {sloppy: true});
    expect(client.isMoveValid('Nf6')).toEqual(true);
  });
});

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

describe('In the UI', () => {
  test('if I click "reset", the moves reset to empty', () => {
    const wrapper = mount(<App autoMove={ false }/>);
    const move = 'e4';
    wrapper.instance().makeMove(move);
    wrapper.update()
    expect(wrapper.state()['moves']).toEqual(List([move]));
    // The #resetButton returns two elements - this seems like a bug?
    wrapper.find('#resetButton').first().simulate('click');
    wrapper.update()
    expect(wrapper.state()['moves']).toEqual(List([]));
  })
  test('if I leave the text field empty and click "submit", the moves stay empty', () => {
    const wrapper = mount(<App autoMove={ false } showInput={ true }/>);
    wrapper.setState({enterMoveByKeyboard: true});
    wrapper.update();
    // The #resetButton returns two elements - this seems like a bug?
    wrapper.find('#submitButton').first().simulate('click');
    wrapper.update()
    expect(wrapper.state()['moves']).toEqual(List([]));
  })
  test('if I enter a valid move and click "submit", the move is added', () => {
    const wrapper = mount(<App autoMove={ false } showInput={ true }/>);
    wrapper.setState({enterMoveByKeyboard: true});
    wrapper.update();
    const moveEntry = wrapper.find(MoveEntry);
    moveEntry.instance().setValue("e4");
    wrapper.find('#submitButton').first().simulate('click');
    wrapper.update()
    expect(wrapper.state()['moves']).toEqual(List(['e4']));
  })
});

describe('after I make a move', () => {
  test('without automove, the active color changes', () => {
    const wrapper = mount(<App autoMove={ false }/>);
    expect(wrapper.state()['colorToMoveWhite']).toEqual(true);
    const move = 'e4';
    wrapper.instance().makeMove(move);
    wrapper.update();
    expect(wrapper.state()['colorToMoveWhite']).toEqual(false);
  });
  test('with automove, the active color changes', () => {
    const wrapper = mount(<App autoMove={ true }/>);
    expect(wrapper.state()['colorToMoveWhite']).toEqual(true);
    const move = 'e4';
    wrapper.instance().makeMove(move);
    wrapper.update();
    expect(wrapper.state()['colorToMoveWhite']).toEqual(true);
  });
});

describe('Testing the dummy engine', () => {
  test('get best returns a move in the starting position', () => {
    const mockCallback = jest.fn();
    getBest(0, startingFen, mockCallback);
    expect(mockCallback.mock.calls[0][0]).toBeTruthy
  });

  test('get best returns no move if mated', () => {
    const mockCallback = jest.fn();
    const matedFen = 'rrk5/8/K7/8/8/8/8/8 w - -'
    getBest(0, matedFen, mockCallback);
    expect(mockCallback.mock.calls[0][0]).not.toBeTruthy
  });
});

