import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Play from "./components/Play";

const App = () => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
  };

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

              <Link to="/">BTN2</Link>
              <Link to="/">BTN3</Link>
              <Link to="/">BTN4</Link>
              <Link to="/">BTN5</Link>

              {userInfo ? (
                <Link to="#signout" onClick={signoutHandler}>
                  Sign Out
                </Link>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </div>
          </header>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
