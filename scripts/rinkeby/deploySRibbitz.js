const { ethers } = require("hardhat");

/*
  Deploys fake sRibbitz
*/

const deploy = async () => {
  const sRibbitz = await ethers.getContractFactory("sRibbitzTest");
  const sRibbitzContract = await sRibbitz.deploy();
  console.log("sRibbitzContract.address", sRibbitzContract.address);
  await sRibbitzContract.deployed();
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
