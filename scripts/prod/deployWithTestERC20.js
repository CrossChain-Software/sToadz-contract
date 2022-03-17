const { ethers } = require("hardhat");

/*
  Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
  Mints 21M sRibbitz and sends to contract.
*/

const deploy = async () => {
  const sRibbitz = await ethers.getContractFactory("sRibbitzTest");
  const sRibbitzContract = await sRibbitz.deploy();
  console.log("sRibbitzContract.address", sRibbitzContract.address);

  await sRibbitzContract.deployed();

  const mintOwnerTx = await sRibbitzContract.ownerMint(
    ethers.utils.parseEther("21000000")
  );
  await mintOwnerTx.wait();

  const sToadzFactory = await ethers.getContractFactory("sToadzTest");
  const sToadzContract = await sToadzFactory.deploy();
  await sToadzContract.deployed();
  console.log("TestSToadzContract.address", sToadzContract.address);

  const transferToToadz = await sRibbitzContract.transfer(
    sToadzContract.address,
    ethers.utils.parseEther("21000000")
  );
  await transferToToadz.wait();

  const songbirdFactory = await ethers.getContractFactory("SongBirdCity");
  const buildingsFactory = await ethers.getContractFactory("LuxuryLofts");

  const songbirdContract = await songbirdFactory.deploy(
    "",
    sToadzContract.address
  );
  await songbirdContract.deployed();
  console.log("songbirdContract.address", songbirdContract.address);

  const buildingsContract = await buildingsFactory.deploy(
    "",
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
