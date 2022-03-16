const { ethers } = require("hardhat");
const { airdropAddresses } = require("./data/airdropAddresses");
const { airdropAmounts } = require("./data/airdropAmounts");

/// frontend dev (4.98%)- 30% (0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48)
/// backend dev (5.81%)- 35% (0x90ca2B438482f2b205dA814B94b4758c3a229541)
/// backend dev (5.81%)- 35% (0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9)
/// sToadz- 80.9% (0xc8d015b94a3Fb41DC13d6a9573bb454300023A94)
/// freeflow- 2.5% (0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5)

const deploy = async () => {
  const sToadzFactory = await ethers.getContractFactory("sToadzTest");
  const contributorAddresses = [
    "0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48",
    "0x90ca2B438482f2b205dA814B94b4758c3a229541",
    "0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9",
    "0xc8d015b94a3Fb41DC13d6a9573bb454300023A94",
    "0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5",
  ];
  const sToadzContract = await sToadzFactory.deploy("", contributorAddresses);

  await sToadzContract.deployed();
  console.log(sToadzContract.address);

  console.log("TestSToadzContract.address", sToadzContract.address);

  // set airdrop info outside of constructor
  // const setSToadzAirdropInfo = await sToadzContract.setAirdropInfo(
  //   airdropAddresses,
  //   airdropAmounts
  // );

  // await setSToadzAirdropInfo.wait();
  // console.log("set airdrop info");

  /// 2 extra NFTs
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

  const setSongbirdContract = await sToadzContract.setSongBirdCity(
    songbirdContract.address
  );
  await setSongbirdContract.wait();

  const setBuildingsContract = await sToadzContract.setBuilding(
    buildingsContract.address
  );
  await setBuildingsContract.wait();

  /// verify
  await new Promise((resolve) => setTimeout(resolve, 60000));
  try {
    await hre.run("verify:verify", {
      address: sToadzContract.address,
      constructorArguments: ["", contributorAddresses],
    });
    console.log("verified");
  } catch (e) {
    console.log(e);
  }
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
