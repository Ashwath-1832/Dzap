import "./App.css";
import Header from "./Header";
import Swap from "./Swap";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="mainWindow">
        <Swap />
      </div>
    </div>
  );
}

export default App;
