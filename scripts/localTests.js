const { ethers } = require("hardhat");
const { airdropAddresses } = require("./data/airdropAddresses");
const { airdropAmounts } = require("./data/airdropAmounts");

/// frontend dev (4.98%)- 30% (0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48)
/// backend dev (5.81%)- 35% (0x90ca2B438482f2b205dA814B94b4758c3a229541)
/// backend dev (5.81%)- 35% (0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9)
/// sToadz- 80.9% (0xc8d015b94a3Fb41DC13d6a9573bb454300023A94)
/// freeflow- 2.5% (0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5)

const deploy = async () => {
  const sRibbitz = await ethers.getContractFactory("sRibbitzTest");
  const sRibbitzContract = await sRibbitz.deploy();
  await sRibbitzContract.deployed();

  const mintOwnerTx = await sRibbitzContract.ownerMint(ethers.utils.parseEther("21000000"));
  await mintOwnerTx.wait();

  const sToadzFactory = await ethers.getContractFactory("sToadz");
  const contributorAddresses = [
    "0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48",
    "0x90ca2B438482f2b205dA814B94b4758c3a229541",
    "0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9",
    "0xc8d015b94a3Fb41DC13d6a9573bb454300023A94",
    "0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5",
  ];
  const sToadzContract = await sToadzFactory.deploy("", contributorAddresses, sRibbitzContract.address);
  await sToadzContract.deployed();

  const transferToToadz = await sRibbitzContract.transfer(sToadzContract.address, ethers.utils.parseEther("21000000"));
  await transferToToadz.wait();

  const songbirdFactory = await ethers.getContractFactory("SongBirdCity");
  const buildingsFactory = await ethers.getContractFactory("LuxuryLofts");

  const songbirdContract = await songbirdFactory.deploy("", sToadzContract.address);
  await songbirdContract.deployed();

  const buildingsContract = await buildingsFactory.deploy("", sToadzContract.address);
  await buildingsContract.deployed();

  const setSongbirdContract = await sToadzContract.setSongBirdCity(songbirdContract.address);
  await setSongbirdContract.wait();

  const setBuildingsContract = await sToadzContract.setLofts(buildingsContract.address);
  await setBuildingsContract.wait();

  const setAirdropInfoTx = await sToadzContract.setAirdropInfo(airdropAddresses, airdropAmounts);
  await setAirdropInfoTx.wait();

  const [owner, user1, user2] = await ethers.getSigners();

  const enableMint = await sToadzContract.startMint();
  await enableMint.wait();

  const mintUser1 = await sToadzContract.connect(user1).mint(3, { value: ethers.utils.parseEther("3600") });
  await mintUser1.wait();

  const toadzBalance = await sToadzContract.balanceOf(user1.address);
  const cityBalance = await songbirdContract.balanceOf(user1.address);
  const loftBalance = await buildingsContract.balanceOf(user1.address);

  const ribbitzBalance = await sRibbitzContract.balanceOf(user1.address);

  console.log("Toadz: ", ethers.utils.formatUnits(toadzBalance, "wei"));
  console.log("City: ", ethers.utils.formatUnits(cityBalance, "wei"));
  console.log("Lofts: ", ethers.utils.formatUnits(loftBalance, "wei"));
  console.log("Ribbitz: ", ethers.utils.formatEther(ribbitzBalance));

  const withdrawTx = await sToadzContract.withdraw();
  await withdrawTx.wait();

  const bal1 = await ethers.provider.getBalance("0xb20F2a4601aED75B886CC5B84E28a0D65a7Bfd48");
  const bal2 = await ethers.provider.getBalance("0x90ca2B438482f2b205dA814B94b4758c3a229541");
  const bal3 = await ethers.provider.getBalance("0x8e23A0C18D2Fd631eFA838aCC1DfBecbbdB3ADD9");
  const bal4 = await ethers.provider.getBalance("0xc8d015b94a3Fb41DC13d6a9573bb454300023A94");
  const bal5 = await ethers.provider.getBalance("0x5B588e36FF358D4376A76FB163fd69Da02A2A9a5");

  console.log("Balance 1:", ethers.utils.formatEther(bal1));
  console.log("Balance 2:", ethers.utils.formatEther(bal2));
  console.log("Balance 3:", ethers.utils.formatEther(bal3));
  console.log("Balance 4:", ethers.utils.formatEther(bal4));
  console.log("Balance 5:", ethers.utils.formatEther(bal5));

  for (i = 0; i < airdropAddresses.length; i++) {
    const airdropTx = await sToadzContract.airdrop();
    await airdropTx.wait();

    const addressTest = airdropAddresses[i][0];
    console.log("Testing Address: ", addressTest);
    const toadzBalance = await sToadzContract.balanceOf(addressTest);
    console.log("Toadz:", ethers.utils.formatUnits(toadzBalance, "wei"));

    const birdsBalance = await songbirdContract.balanceOf(addressTest);
    console.log("City:", ethers.utils.formatUnits(birdsBalance, "wei"));

    const buildingBalance = await buildingsContract.balanceOf(addressTest);
    console.log("Building:", ethers.utils.formatUnits(buildingBalance, "wei"));
  }
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
