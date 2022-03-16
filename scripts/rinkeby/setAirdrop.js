const { ethers } = require("hardhat");
const { airdropAddresses } = require("../data/airdropAddresses");
const { airdropAmounts } = require("../data/airdropAmounts");
const sToadzTest = require("../../artifacts/contracts/sToadzTest.sol/sToadzTest.json");

const setAirdrop = async () => {
  const owner = await ethers.getSigner();
  const sToadzAddress = "0x04E1d82fbC93fccAE3e0124bf405b6EC00e39e0a";
  const sToadzContract = new ethers.Contract(
    sToadzAddress,
    sToadzTest.abi,
    owner
  );

  const setAirdropInfoTx = await sToadzContract.setAirdropInfo(
    airdropAddresses,
    airdropAmounts
  );
  await setAirdropInfoTx.wait();
};

setAirdrop()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
