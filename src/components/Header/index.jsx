import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
} from "./NavbarElements";

const Header = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink to="/play" activeStyle>
            Play
          </NavLink>
          <NavLink to="/login" activeStyle>
            Sign In
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Header;
