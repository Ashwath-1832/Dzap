import React from "react";
import logo from "./assets/logo.svg";
import ethLogo from "./assets/EthLogo.svg";
import MetaMask from "./assets/MetaMask.svg";

import { WalletOutlined } from "@ant-design/icons";

function Header(props) {
  const { connect, isConnected, address } = props;
  return (
    <header>
      <div className="header">
        <div className="leftH">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="rightH">
          <div className="headerItem">
            <img src={ethLogo} alt="Ethereum" className="headerIcons" />{" "}
            Ethereum
          </div>
          <div className="connectButton" onClick={connect}>
            {isConnected ? (
              <>
                {" "}
                <img src={MetaMask} alt="MetaMask" className="headerIcons" />
                {address.slice(0, 4) + "..." + address.slice(38)}
              </>
            ) : (
              <>
                <WalletOutlined /> Connect Wallet
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
