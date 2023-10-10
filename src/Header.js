import React from "react";
import logo from "./assets/logo.svg";
import ethLogo from "./assets/EthLogo.svg";

function Header(props) {
  const { connect, isConnected, address } = props;
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
        <div className="connectButton" onClick={connect}>
          {isConnected
            ? address.slice(0, 4) + "..." + address.slice(38)
            : "Connect Wallet"}
        </div>
      </div>
    </header>
  );
}

export default Header;
