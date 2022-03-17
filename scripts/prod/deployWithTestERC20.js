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

  // sTaodz contract
  const sToadzFactory = await ethers.getContractFactory("sToadzTestFlattened");
  const sToadzContract = await sToadzFactory.deploy();
  await sToadzContract.deployed();
  console.log("TestSToadzContract.address", sToadzContract.address);

  // REPLACE WITH REAL IPFS NFT HASH
  const baseURI = await sToadzContract.setBaseURI(
    "https://ipfs.io/ipfs/QmU68A2kQV65S12xwunVkL7zUihvH1bpHPFzrkvy3AQMj7/"
  );
  await baseURI.wait();
  console.log("set baseURI");

  // start the mint for testing
  const setMint = await sToadzContract.startMint();
  await setMint.wait();

  // transfer 21M erc20 to the sToadz contract for sending on mint
  const transferToToadz = await sRibbitzContract.transfer(
    sToadzContract.address,
    ethers.utils.parseEther("21000000")
  );
  await transferToToadz.wait();

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

  /// set the sRibbits address in sToadz contract
  const setSRibbitsContract = await sToadzContract.setSRibbits(
    sRibbitzContract.address
  );
  await setSRibbitsContract.wait();
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
