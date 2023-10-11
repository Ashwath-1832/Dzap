import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Swap from "./Swap";
import { useConnect, useAccount, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const { chain } = useNetwork();
  useEffect(() => {
    setSelectedChain(chain);
  }, []);

  return (
    <div className="App">
      <Header
        connect={connect}
        isConnected={isConnected}
        address={address}
        setSelectedChain={setSelectedChain}
        selectedChain={selectedChain}
      />
      <div className="mainWindow">
        <Swap isConnected={isConnected} address={address} connect={connect} />
      </div>
    </div>
  );
}

export default App;
