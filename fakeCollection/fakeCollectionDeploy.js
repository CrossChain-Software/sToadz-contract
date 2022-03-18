// BlackSquare: https://ipfs.io/ipfs/QmWA9z9bTZkpPm1wQ4J4WqinbVv5iDZZxgTnMijKic14Ed
// GreenSquare: https://ipfs.io/ipfs/QmWkndsg1rzd8fh69WLM1HnSLc8XZr3YRChU68Z9LLcu85
// PinkSquare: https://ipfs.io/ipfs/QmdyNYmJkqUufMDfn9WHRLp4CJB1xErM9gXpvnRCFZHKcg

const { ethers } = require("hardhat");

/*
  Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
  Mints 21M sRibbitz and sends to contract.
*/

const deploy = async () => {
  // sTaodz contract
  const sToadzFactory = await ethers.getContractFactory(
    "FakeCollectionFlattened"
  );
  const sToadzContract = await sToadzFactory.deploy();
  await sToadzContract.deployed();
  console.log("sToadzContract.address", sToadzContract.address);

  // create new contract instances for SongBirdCity and LuxuryLofts
  const songbirdFactory = await ethers.getContractFactory("GreenSquare");
  const buildingsFactory = await ethers.getContractFactory("PinkSquare");

  const songbirdContract = await songbirdFactory.deploy(sToadzContract.address);
  await songbirdContract.deployed();
  console.log("greensquare.address", songbirdContract.address);

  const buildingsContract = await buildingsFactory.deploy(
    sToadzContract.address
  );
  await buildingsContract.deployed();
  console.log("pinksquare.address", buildingsContract.address);

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
