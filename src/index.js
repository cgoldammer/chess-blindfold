import React from 'react';
import ReactDOM from 'react-dom';
import { App, App2 } from './App.jsx';
import 'bootstrap/dist/css/bootstrap.css';

const app = <App autoMove={ true } />;
ReactDOM.render(app, document.getElementById('app'));
module.hot.accept();
