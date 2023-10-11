import React from "react";
import logo from "./assets/logo.svg";
import EthLogo from "./assets/EthLogo.svg";
import MetaMask from "./assets/MetaMask.svg";
import MaticLogo from "./assets/maticLogo.png";
import OptimismLogo from "./assets/optimismLogo.png";
import { configureChains, useSwitchNetwork } from "wagmi";
import { mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { WalletOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Dropdown } from "antd";

function Header(props) {
  const { connect, isConnected, address, setSelectedChain, selectedChain } =
    props;
  const [showDropdown, setShowDropdown] = useState(false);
  const { switchNetwork } = useSwitchNetwork();

  const { chains: chainCofig } = configureChains(
    [mainnet, optimism, polygon],
    [publicProvider()]
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const chainitems = chainCofig.map((item, index) => ({
    key: index,
    label: (
      <Button
        disabled={item.id === selectedChain?.id}
        onClick={() => {
          setSelectedChain(item);
          switchNetwork?.(item.id);
        }}
      >
        {item.name}
      </Button>
    ),
  }));

  const returnChainIcon = () => {
    switch (selectedChain?.id) {
      case 1:
        return (
          <>
            <div className="networkSection">
              <img src={EthLogo} alt="logo" className="headerIcons" />{" "}
              <span>Ethereum</span>
            </div>
          </>
        );
      case 10:
        return (
          <>
            <div className="networkSection">
              <img src={OptimismLogo} alt="logo" className="headerIcons" />
              <span>Optimism</span>
            </div>
          </>
        );
      case 137:
        return (
          <>
            <div className="networkSection">
              <img src={MaticLogo} alt="logo" className="headerIcons" />
              <span>Polygon</span>
            </div>
          </>
        );

      default:
        return <span className="headerIcons">Network</span>;
    }
  };

  console.log("selected chain", selectedChain);
  return (
    <header>
      <div className="header">
        <div className="leftH">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="rightH">
          <div className="headerItem">
            <Dropdown menu={{ items: chainitems }} placement="bottom">
              <Button className="iconButton">{returnChainIcon()}</Button>
            </Dropdown>
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
