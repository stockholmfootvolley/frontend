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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router >
      <Routes>
        <Route path="/">
          <Route path="" element={<Events />} />
          <Route path=":date" element={<SingleEvent />} />
        </Route>
      </Routes>
    </Router>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
