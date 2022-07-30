/* global artifacts */
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(callback) {
  // Get deployed tokenFarm contract
  const tokenFarm = await TokenFarm.deployed();

  // Issue reward tokens
  await tokenFarm.issueTokens();

  // Report to console
  console.log("Reward Tokens Issued!!");

  // Run callback
  callback();
};