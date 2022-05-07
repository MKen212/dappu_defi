pragma solidity ^0.5.0;

// Import ERC-20 tokens so that this contract can access them
import "./DappToken.sol";
import "./DaiToken.sol";

// Main Yield Farming Smart Contract
contract TokenFarm {
  string public name = "Dapp Token Farm";
  address public dappToken;
  address public daiToken;

  constructor(address _dappToken, address _daiToken) public {
    // Store address for each of the ERC-20 tokens
    dappToken = _dappToken;
    daiToken = _daiToken;
  }


}
