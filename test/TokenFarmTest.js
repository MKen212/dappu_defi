/* global artifacts web3 contract before assert */
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

// Require Mocha, Chai & Assert for testing
require("chai")
  .use(require("chai-as-promised"))
  .should();

// Helper function to convert tokens to Wei
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}


// Testing per contract
/* Note owner = accounts[0] and investor = accounts[1] */
contract("TokenFarm", ([owner, investor]) => {
  let daiToken;
  let dappToken;
  let tokenFarm;

  // Setup actions to complete for all tests within a contract
  before(async() => {
    // Load Contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all DappTokens to the Token Farm contract
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    // Transfer 100 Mock Dai to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });
  

  // Tests for Contract deployment
  describe("Mock DAI Token deployment", async () => {
    it("has a name", async() => {      
      const tokenName = await daiToken.name();
      assert.equal(tokenName, "Mock DAI Token");
    });
  });

  describe("DApp Token deployment", async () => {
    it("has a name", async() => {      
      const tokenName = await dappToken.name();
      assert.equal(tokenName, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async() => {      
      const tokenName = await tokenFarm.name();
      assert.equal(tokenName, "DApp Token Farm");
    });
    it("has 1,000,000 DApp tokens", async() => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  // Tests for mDAI staking
  describe("Farming Tokens", async() => {
    it("rewards investors for staking mDAI tokens", async() => {
      // Check stating balance
      const startBalance = await daiToken.balanceOf(investor);
      assert.equal(startBalance.toString(), tokens("100"), "Investor start balance is 100 mDAI");

      // Approve TokenFarm contract to transfer tokens for investor
      await daiToken.approve(tokenFarm.address, tokens("100"), { from: investor });

      // Stake tokens from investor
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      // Check staking mDAI results
      const endBalance = await daiToken.balanceOf(investor);
      assert.equal(endBalance.toString(), tokens("0"), "Investor end balance is 0 mDAI");
      
      const tokenFarmBal = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(tokenFarmBal.toString(), tokens("100"), "TokenFarm end balance is 100 mDAI");

      // Check TokenFarm mapping results
      const stakingBalInv = await tokenFarm.stakingBalance(investor);
      assert.equal(stakingBalInv.toString(), tokens("100"), "Investor Staking balance is 100 mDAI");

      const isStakingInv = await tokenFarm.isStaking(investor);
      assert.equal(isStakingInv, true, "Investor staking status is correct");

      // Issue Reward tokens to investor
      await tokenFarm.issueTokens({ from: owner });

      // Check balances after reward issuance
      const rewardBalInv = await dappToken.balanceOf(investor);
      assert.equal(rewardBalInv.toString(), tokens("100"), "Investor Reward balance is 100 DApp");

      // Ensure only owner can issue reward tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

    });

    it("allows un-staking of mDAI tokens", async() => {
      // Un-stake tokens for investor
      await tokenFarm.unstakeTokens({ from: investor });

      // Check un-staking mDAI results
      const endBalance = await daiToken.balanceOf(investor);
      assert.equal(endBalance.toString(), tokens("100"), "Investor end balance is 100 mDAI");
      
      const tokenFarmBal = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(tokenFarmBal.toString(), tokens("0"), "TokenFarm end balance is 0 mDAI");

      // Check TokenFarm mapping results
      const stakingBalInv = await tokenFarm.stakingBalance(investor);
      assert.equal(stakingBalInv.toString(), tokens("0"), "Investor Staking balance is 0 mDAI");

      const isStakingInv = await tokenFarm.isStaking(investor);
      assert.equal(isStakingInv, false, "Investor staking status is correct");
    });

  });

});
