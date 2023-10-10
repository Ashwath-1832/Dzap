import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  DownOutlined,
  SettingOutlined,
  SyncOutlined,
  WalletOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import tokenList from "./tokenList.json";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import MetaMask from "./assets/MetaMask.svg";

function Swap(props) {
  const { connect, address, isConnected } = props;
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const apiKey = "jm7lkQTOyqAHdBDyztF67BwtGIY039M8";

  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
  }

  function switchTokens() {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i) {
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
    } else {
      setTokenTwo(tokenList[i]);
    }
    setIsOpen(false);
  }
  //   async function fetchPrices(one, two) {
  //     // try {
  //     //   const response = await axios.get(
  //     //     `https://api.1inch.dev/v3.0/quote?src=${tokenOne.address}&dst=${tokenTwo.address}&amount=${tokenOneAmount}`,
  //     //     {
  //     //       headers: {
  //     //         "Content-Type": "application/json",
  //     //         Authorization: "Bearer jm7lkQTOyqAHdBDyztF67BwtGIY039M8",
  //     //         "Access-Control-Allow-Origin": "*",
  //     //       },
  //     //     }
  //     //   );

  //     //   console.log(response.data);
  //     //   // Assuming setPrices is a function to update state
  //     //   setPrices(response.data);
  //     // } catch (error) {
  //     //   console.error("Error fetching prices:", error);
  //     // }
  //   }
  async function fetchPrices(one, two) {
    try {
      const apiUrl = `https://api.1inch.dev/v3.0/quote?src=${
        tokenOne.address
      }&dst=${tokenTwo.address}&amount=${100000}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setPrices(data);
      } else {
        console.error("Error fetching prices:", response.status);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeading">
          <div>
            <h3>Swap</h3>
          </div>
          <div className="swapIcons">
            <ReloadOutlined />
            <PlusOutlined />
            <SettingOutlined />
          </div>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <SyncOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="Asset Image" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="Asset Image" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div className="swapButton" disabled={!tokenOneAmount || !isConnected}>
          Swap
        </div>
        <div className="connectButtonDown" onClick={connect}>
          {isConnected ? (
            <>
              <img src={MetaMask} alt="MetaMask" className="bottomIcon" />{" "}
              Connected
            </>
          ) : (
            <>
              <WalletOutlined /> Connect Wallet
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Swap;
