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
const { airdropAddresses } = require("../data/airdropAddresses");
const { airdropAmounts } = require("../data/airdropAmounts");

const main = async () => {
  const owner = await ethers.getSigner();
  const toadzContract = new ethers.Contract("0x5A2bBf16D1d6fD2ffAADF740d7e1841dA590f798", toadz.abi, owner);
  const loftsContract = new ethers.Contract("0x6B695af20bC127598990D9Ce2c55E695BeBc170a", lofts.abi, owner);
  const cityContract = new ethers.Contract("0xcc4D29c5Fac7fdee67E1833B3Aa85bd9AdE6b64D", city.abi, owner);

  const setURIToadz = await toadzContract.setBaseURI("https://ipfs.io/ipfs/QmSmuzUDsmt4eXPQHPaKHtp5o23Fs3DYqQxYRHtDa3YPgn/");
  await setURIToadz.wait();

  const setLoftsURI = await loftsContract.setBaseURI("https://ipfs.io/ipfs/QmbRJwZruY5XhTEaTEXyjFjYHFSXzDkE81Pr7unnSD7FTo/");
  await setLoftsURI.wait();

  const setCityURI = await cityContract.setBaseURI("https://ipfs.io/ipfs/QmQMwdDn3aNSD86VTu4JSxigxmkR9iryC6V53PYoWsEBXY/");
  await setCityURI.wait();

  const setAirdrop = await toadzContract.setAirdropInfo(airdropAddresses, airdropAmounts);
  await setAirdrop.wait();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
