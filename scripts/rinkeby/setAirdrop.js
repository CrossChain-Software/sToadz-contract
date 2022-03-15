const { ethers } = require("hardhat");
const { airdropAddresses } = require("../data/airdropAddresses");
const { airdropAmounts } = require("../data/airdropAmounts");
const sToadzTest = require("../../artifacts/contracts/TestSToadz.sol/sToadzTest.json");

const setAirdrop = async () => {
  const owner = await ethers.getSigner();
  const sToadzAddress = "0x01729C56F1f4c85373f3583b0cF113C2d4C18F5f";
  const sToadzContract = new ethers.Contract(sToadzAddress, sToadzTest.abi, owner);

  const setAirdropInfoTx = await sToadzContract.setAirdropInfo(airdropAddresses, airdropAmounts);
  await setAirdropInfoTx.wait();
};

setAirdrop()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
