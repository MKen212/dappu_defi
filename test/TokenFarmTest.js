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

});
