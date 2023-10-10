import React from "react";
import logo from "./assets/logo.svg";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Header>
      <div className="leftH">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="connectButton">Connect</div>
      </div>
    </Header>
  );
}

export default Header;
