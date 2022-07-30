import React, { Component } from 'react';
import Navbar from './Navbar';
import './App.css';
import Web3 from 'web3';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: "0x0",
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: 0,
      dappTokenBalance: 0,
      stakingBalance: 0,
      loading: true
    }
  }


  // Initialise the connection to the blockchain
  async componentWillMount() {
    console.log(this.state.loading);
    await this.loadWeb3();
    await this.loadBlockchainData();
    console.log(this.state.loading);
  }

  // Load the web3.js library
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert("Non-Ethereum Browser Detected. You should consider trying MetaMask");
    }
  }

  // Load the Blockchain Data
  async loadBlockchainData() {
    const web3 = window.web3;
    // Get the connected MetaMask Account
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    this.setState({ account: accounts[0] });

    // Ensure that MetaMask is connected to the Ganache Network
    const networkID = await web3.eth.net.getId();
    // console.log(`Network ID: ${networkID}`);

    // Load DaiToken Smart Contract
    const daiTokenData = DaiToken.networks[networkID];
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
      // console.log(daiTokenBalance);
    } else {
      window.alert("DaiToken contract not deployed to this network!");
    }

    // Load DAppToken Smart Contract
    const dappTokenData = DappToken.networks[networkID];
    if(dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
      // console.log(dappTokenBalance);
    } else {
      window.alert("DAppToken contract not deployed to this network!");
    }

    // Load TokenFarm Smart Contract
    const tokenFarmData = TokenFarm.networks[networkID];
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      // console.log(stakingBalance);
    } else {
      window.alert("TokenFarm contract not deployed to this network!");
    }

    // Complete the loading be re-setting the loading state
    this.setState({ loading: false });

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
