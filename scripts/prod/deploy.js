const { ethers } = require("hardhat");

/*
  Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
  Mints 21M sRibbitz and sends to contract.
*/

const deploy = async () => {
  // sTaodz contract
  const sToadzFactory = await ethers.getContractFactory("sToadzTest");
  const sToadzContract = await sToadzFactory.deploy();
  await sToadzContract.deployed();
  console.log("TestSToadzContract.address", sToadzContract.address);

  // minnet ipfs hash
  sToadzContract.setBaseURI(
    " https://ipfs.io/ipfs/QmSmuzUDsmt4eXPQHPaKHtp5o23Fs3DYqQxYRHtDa3YPgn/"
  );

  // transfer 21M erc20 to the sToadz contract for sending on mint

  // create new contract instances for SongBirdCity and LuxuryLofts
  const songbirdFactory = await ethers.getContractFactory("SongBirdCity");
  const buildingsFactory = await ethers.getContractFactory("LuxuryLofts");

  const songbirdContract = await songbirdFactory.deploy(
    "https://ipfs.io/ipfs/QmQMwdDn3aNSD86VTu4JSxigxmkR9iryC6V53PYoWsEBXY/",
    sToadzContract.address
  );
  await songbirdContract.deployed();
  console.log("songbirdContract.address", songbirdContract.address);

  const buildingsContract = await buildingsFactory.deploy(
    "https://ipfs.io/ipfs/QmbRJwZruY5XhTEaTEXyjFjYHFSXzDkE81Pr7unnSD7FTo/",
    sToadzContract.address
  );
  await buildingsContract.deployed();
  console.log("buildingsContract.address", buildingsContract.address);

  /// set the songbird address in sToadz contract
  const setSongbirdContract = await sToadzContract.setSongBirdCity(
    songbirdContract.address
  );
  await setSongbirdContract.wait();

  /// set the building address in sToadz contract
  const setBuildingsContract = await sToadzContract.setLofts(
    buildingsContract.address
  );
  await setBuildingsContract.wait();
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
