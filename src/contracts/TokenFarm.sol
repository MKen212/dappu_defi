pragma solidity ^0.5.0;

// Import ERC-20 tokens source code so that this contract can use them
import "./DappToken.sol";
import "./DaiToken.sol";

// Main Yield Farming Smart Contract
contract TokenFarm {
  string public name = "DApp Token Farm";
  DappToken public dappToken;
  DaiToken public daiToken;

  mapping(address => uint256) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;
  address[] public stakers;

  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    // Store depolyed contract for each of the ERC-20 tokens
    dappToken = _dappToken;
    daiToken = _daiToken;
  }

  // Stake mDAI Tokens (Deposit)
  function stakeTokens(uint _amount) public {
    // Transfer mDAI to this contract
    daiToken.transferFrom(msg.sender, address(this), _amount);
    
    // Update the staking balance for the sender
    stakingBalance[msg.sender] += _amount;
    
    // Add user to stakers array only if they haven't staked already
    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    // Update staking status
    hasStaked[msg.sender] = true;
    isStaking[msg.sender] = true;
  }

  

  // Unstaking mDAI Tokens (Withdraw)


  // Issuing DApp Tokens (Interest rewards)




}
