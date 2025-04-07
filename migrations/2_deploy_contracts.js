const DigitalAssetTrader = artifacts.require("DigitalAssetTrader");

module.exports = function (deployer) {
    deployer.deploy(DigitalAssetTrader);
};