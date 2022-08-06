import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { Events } from './Events';
import { SingleEvent } from './SingleEvent';
import reportWebVitals from './reportWebVitals';
import { Login } from './Login';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.Fragment>
    <Router >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events">
          <Route path="" element={<Events />} />
          <Route path=":date" element={<SingleEvent />} />
        </Route>
      </Routes>
    </Router>

  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
