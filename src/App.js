import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery";
function App() {
  const [players, setPlayers] = useState([]);
  const [manager, setManager] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(0);
  useEffect(() => {
    getPlayers();
    getManager();
    getBalance();
  }, []);

  const getPlayers = async () => {
    const players = await lottery.methods.getPlayers().call();
    console.log("--", JSON.stringify(players));

    setPlayers(players);
  };

  const getManager = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
  };

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    console.log("--", balance);
    setBalance(balance);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("sending transaction...");
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(bet, "ether"),
      });
      setMessage("transaction is successful!");
    } catch (err) {
      setMessage(err.toString());
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>manager is {manager}</p>
        <p>players are {players.length}</p>
        <p>balance is {web3.utils.fromWei(balance, "ether")} ether</p>
        <form
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <label>input the value you're going to bet</label>
          <input
            value={bet}
            onChange={(e) => {
              setBet(e.target.value);
            }}
          ></input>
          <div>
            <button>Enter</button>
          </div>
        </form>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
