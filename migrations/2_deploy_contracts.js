const KrellKollection = artifacts.require("KrellKollection");

module.exports = function(deployer) {
  deployer.deploy(KrellKollection);
};