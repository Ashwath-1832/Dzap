import React, { useState, useEffect } from "react";
import { Input, Modal, Spin } from "antd";
import {
  DownOutlined,
  SettingOutlined,
  SyncOutlined,
  WalletOutlined,
  ReloadOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import axios from "axios";
import tokenList from "./tokenList.json";
import MetaMask from "./assets/MetaMask.svg";
import { useSendTransaction } from "wagmi";

function Swap(props) {
  const { connect, address, isConnected } = props;
  const [slippage, setSlippage] = useState(1);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction();
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

  async function fetchPrices() {
    const parseAmount = Number(tokenOneAmount * 10 ** tokenOne.decimals);
    setIsQuoteLoading(true);

    try {
      const apiUrl = `https://api-dzap.1inch.io/v5.2/137/quote?src=${tokenOne.address}&dst=${tokenTwo.address}&amount=${parseAmount}`;
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer jm7lkQTOyqAHdBDyztF67BwtGIY039M8`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        const quote = data.toAmount / 10 ** tokenTwo.decimals;
        setTokenTwoAmount(quote.toFixed(6));
      } else {
        console.error("Error fetching prices:", response.status);
      }
      setIsQuoteLoading(false);
    } catch (error) {
      setIsQuoteLoading(false);
      console.error("Error fetching prices:", error);
    }
  }

  async function fetchSwap() {
    const parseAmount = Math.abs(
      Math.floor(tokenOneAmount * 10 ** tokenOne.decimals)
    ).toString();

    setIsSwapLoading(true);

    const allowance = await axios.get(
      `https://api-dzap.1inch.io/v5.2/137/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api-dzap.1inch.io/v5.2/137/approve/transaction?tokenAddress=${tokenOne.address}&amount=${parseAmount}`
      );

      console.log("not approved");
    }

    const tx = await axios.get(
      `https://api-dzap.1inch.io/v5.2/137/swap?src=${tokenOne.address}&dst=${tokenTwo.address}&amount=${parseAmount}&from=${address}&slippage=${slippage}`
    );

    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));
    setTxDetails(tx.data.tx);

    try {
      let txData = tx.data.tx;
      sendTransaction({
        from: address,
        to: String(txData.to),
        data: String(txData.data),
        value: String(txData.value),
      });
      setIsSwapLoading(false);
    } catch (err) {
      setIsSwapLoading(false);
      console.log("Tx wagmi error!");
    }
  }

  useEffect(() => {
    if (tokenOneAmount == 0 || tokenOneAmount === undefined) {
      setTokenTwoAmount(0);
    }
  }, [tokenOneAmount]);

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
            type="number"
            value={tokenOneAmount}
            onChange={changeAmount}
          />
          <Input
            placeholder="0"
            type="number"
            value={tokenTwoAmount}
            disabled={true}
          />
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
        <div className="gasSection">
          Estimated gas fee <SwapOutlined />{" "}
          {txDetails.gasPrice ? txDetails.gasPrice : undefined}
        </div>
        <div
          className="quoteButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={() => !isQuoteLoading && fetchPrices()}
        >
          {isQuoteLoading ? <Spin /> : <>Get Quote</>}
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !isConnected}
          onClick={() => !isSwapLoading && fetchSwap()}
        >
          {isSwapLoading ? <Spin /> : <>Swap</>}
        </div>
        <div className="connectButtonDown" onClick={connect}>
          {isConnected ? (
            <>
              <img src={MetaMask} alt="MetaMask" className="bottomIcon" />
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
