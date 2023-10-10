import "./App.css";
import Header from "./Header";
import Swap from "./Swap";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Swap isConnected={isConnected} address={address} connect={connect} />
      </div>
    </div>
  );
}

export default App;
