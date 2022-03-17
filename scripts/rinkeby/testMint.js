/*
Set Airdrop Info
Set Base URI for Toadz
Set Base URI for Lofts
Set Base URI for Songbird City
*/

const { ethers } = require("hardhat");
const toadz = require("../../artifacts/contracts/sToadzTest.sol/sToadzTest.json");
const lofts = require("../../artifacts/contracts/LuxuryLofts.sol/LuxuryLofts.json");
const city = require("../../artifacts/contracts/SongBirdCity.sol/SongBirdCity.json");

const main = async () => {
  const [owner, user1] = await ethers.getSigners();
  const toadzContract = new ethers.Contract("0x5A2bBf16D1d6fD2ffAADF740d7e1841dA590f798", toadz.abi, owner);
  //   const loftsContract = new ethers.Contract("0x6B695af20bC127598990D9Ce2c55E695BeBc170a", lofts.abi, owner);
  //   const cityContract = new ethers.Contract("0xcc4D29c5Fac7fdee67E1833B3Aa85bd9AdE6b64D", city.abi, owner);

  //   const enableMint = await toadzContract.startMint();
  //   await enableMint.wait();

  const mintTx = await toadzContract.mint(5, { value: ethers.utils.parseEther("0.006"), gasLimit: 1_000_000 });
  await mintTx.wait();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
