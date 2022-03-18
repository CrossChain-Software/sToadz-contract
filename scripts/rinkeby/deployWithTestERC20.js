const { ethers } = require("hardhat");

/*
  Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
  Mints 21M sRibbitz and sends to contract.
*/

const deploy = async () => {
  /// deploy ERC20
  console.log("trying to deploy ERC20");
  const sRibbitz = await ethers.getContractFactory("sRibbitzTest");
  const sRibbitzContract = await sRibbitz.deploy();
  console.log("sRibbitzContract.address", sRibbitzContract.address);

  await sRibbitzContract.deployed();

  const mintOwnerTx = await sRibbitzContract.ownerMint(
    ethers.utils.parseEther("21000000")
  );
  await mintOwnerTx.wait();
  console.log("minted 21M fake sRibbitz");

  // sTaodz contract
  const sToadzFactory = await ethers.getContractFactory("sToadzTestFlattened");
  const sToadzContract = await sToadzFactory.deploy();
  await sToadzContract.deployed();
  console.log("TestSToadzContract.address", sToadzContract.address);

  // transfer 21M erc20 to the sToadz contract for sending on mint
  const transferToToadz = await sRibbitzContract.transfer(
    sToadzContract.address,
    ethers.utils.parseEther("21000000")
  );
  await transferToToadz.wait();
  console.log("transferred sRibbitz to sToadz");

  const songbirdFactory = await ethers.getContractFactory("SongBirdCity");
  const buildingsFactory = await ethers.getContractFactory("LuxuryLofts");

  const songbirdContract = await songbirdFactory.deploy(
    "https://ipfs.io/ipfs/QmVZreqAWQhdfDtyjsn94bvC1RiDwLsAbpT479W2y3Toz5/",
    sToadzContract.address
  );
  await songbirdContract.deployed();
  console.log("SongBirdCity contract deployed", songbirdContract.address);

  const buildingsContract = await buildingsFactory.deploy(
    "https://ipfs.io/ipfs/QmWTAsG1ksaVmfHti4XHpteopZy9GPWDBrtEE6e9UuQ69b/",
    sToadzContract.address
  );
  await buildingsContract.deployed();
  console.log("LuxuryLofts contract deployed", buildingsContract.address);

  /// set the songbird address in sToadz contract
  const setSongbirdContract = await sToadzContract.setSongBirdCity(
    songbirdContract.address
  );
  await setSongbirdContract.wait();
  console.log("set the SongBirdCity address in sToadz contract");

  /// set the building address in sToadz contract
  const setBuildingsContract = await sToadzContract.setLofts(
    buildingsContract.address
  );
  await setBuildingsContract.wait();
  console.log("set the LuxuryLofts address in sToadz contract");

  /// set the sRibbits address in sToadz contract
  const setSRibbitsContract = await sToadzContract.setSRibbits(
    sRibbitzContract.address
  );
  await setSRibbitsContract.wait();
  console.log("set sRibbits address in sToadz contract");

  /// verify
  await new Promise((resolve) => setTimeout(resolve, 60000));
  try {
    await hre.run("verify:verify", {
      address: sToadzContract.address,
      constructorArguments: [],
    });
    console.log("verified");
  } catch (e) {
    console.log(e);
  }

  console.log("verified");

  const baseURI = await sToadzContract.setBaseURI(
    "https://ipfs.io/ipfs/QmSmuzUDsmt4eXPQHPaKHtp5o23Fs3DYqQxYRHtDa3YPgn/"
  );
  await baseURI.wait();
  console.log("set baseURI");

  // start the mint for testing
  const setMint = await sToadzContract.startMint();
  await setMint.wait();
  console.log("mint is on");
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
