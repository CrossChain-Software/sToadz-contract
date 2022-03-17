const { ethers } = require("hardhat");

/*
Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
Mints 21M sRibbitz and sends to contract.

*/

const deploy = async () => {
  const sRibbitz = await ethers.getContractFactory("sRibbitzFlattenedTest");
  const sRibbitzContract = await sRibbitz.deploy();
  console.log("sRibbitzFlattenedContract.address", sRibbitzContract.address);

  await sRibbitzContract.deployed();

  const mintOwnerTx = await sRibbitzContract.ownerMint(
    ethers.utils.parseEther("21000000")
  );
  await mintOwnerTx.wait();
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
