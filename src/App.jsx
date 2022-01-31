import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Play from "./components/Play";

const App = () => {

  return (
    <div>
      <Router>
        <div className="grid-container">
          <header className="row">
            <div>
              <div className="dropdown">
                <Link to="#">
                  Play <i class="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/play">VS Player</Link>
                  </li>
                  <li>
                    <Link to="/play">VS AI</Link>
                  </li>
                </ul>
              </div>
              <Link to="/signin">BTN2</Link>
              <Link to="/signin">BTN3</Link>
              <Link to="/signin">BTN4</Link>
              <Link to="/signin">BTN5</Link>
              <Link to="/signin">SignIn</Link>
            </div>
          </header>
        </div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/signin" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
