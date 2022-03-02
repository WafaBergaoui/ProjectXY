import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./screens/HomeScreen";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import Play from "./screens/PlayScreen";
import Welcome from "./screens/WelcomeScreen";

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

              <Link to="/">Btn2</Link>
              <Link to="/">Btn3</Link>
              <Link to="/">Btn4</Link>
              <Link to="/">Btn5</Link>

              {userInfo ? (
                <Link to="#signout" onClick={signoutHandler}>
                  SignOut
                </Link>
              ) : (
                <Link to="/signin">SignIn</Link>
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
            <Route path="/confirm/:confirmationCode" element={<Welcome />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
