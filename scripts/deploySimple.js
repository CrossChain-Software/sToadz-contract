const { ethers } = require("hardhat");

/*
Deploys sToadz (Test), fake sRibbitz, Lofts, and Cities on Rinkeby.
Mints 21M sRibbitz and sends to contract.

*/

const deploy = async () => {
  const factory = await ethers.getContractFactory("SimpleVerify");
  const contributorAddresses = [
    "0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48",
    "0x90ca2B438482f2b205dA814B94b4758c3a229541",
    "0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9",
    "0xc8d015b94a3Fb41DC13d6a9573bb454300023A94",
    "0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5",
  ];
  const contract = await factory.deploy(55, contributorAddresses);
  console.log("contract.address", contract.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
