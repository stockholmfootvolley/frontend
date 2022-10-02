import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { Events } from './pages/Events';
import { SingleEvent } from './pages/SingleEvent';
import reportWebVitals from './reportWebVitals';
import { Login } from './pages/Login';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.Fragment>
    <Router >
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login/:redirect" element={<Login />} />
        <Route path="/:date" element={<SingleEvent />} />
      </Routes>
    </Router>

  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
