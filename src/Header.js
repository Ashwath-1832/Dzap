import React from "react";
import logo from "./assets/logo.svg";
import ethLogo from "./assets/EthLogo.svg";

function Header() {
  return (
    <header>
      <div className="leftH">
        <img src={logo} alt="Logo" className="logo" />

        <div className="headerItem">Swap</div>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={ethLogo} alt="Ethereum" className="eth" /> Ethereum
        </div>
        <div className="connectButton">Connect</div>
      </div>
    </header>
  );
}

export default Header;
