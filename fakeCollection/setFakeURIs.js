/*
Set Airdrop Info
Set Base URI for Toadz
Set Base URI for Lofts
Set Base URI for Songbird City
*/

// BlackSquare: https://ipfs.io/ipfs/QmWA9z9bTZkpPm1wQ4J4WqinbVv5iDZZxgTnMijKic14Ed
// GreenSquare: https://ipfs.io/ipfs/QmWkndsg1rzd8fh69WLM1HnSLc8XZr3YRChU68Z9LLcu85
// PinkSquare: https://ipfs.io/ipfs/QmdyNYmJkqUufMDfn9WHRLp4CJB1xErM9gXpvnRCFZHKcg

const { ethers } = require("hardhat");
const toadz = require("../../artifacts/contracts/sToadz.sol/sToadz.json");
const lofts = require("../../artifacts/contracts/LuxuryLofts.sol/LuxuryLofts.json");
const city = require("../../artifacts/contracts/SongBirdCity.sol/SongBirdCity.json");
const { airdropAddresses } = require("../data/airdropAddresses");
const { airdropAmounts } = require("../data/airdropAmounts");

const main = async () => {
  const owner = await ethers.getSigner();
  const toadzContract = new ethers.Contract(
    "0x35afb6Ba51839dEDD33140A3b704b39933D1e642",
    toadz.abi,
    owner
  );
  const loftsContract = new ethers.Contract(
    "0x91Aa85a172DD3e7EEA4ad1A4B33E90cbF3B99ed8",
    lofts.abi,
    owner
  );
  const cityContract = new ethers.Contract(
    "0x360f8B7d9530F55AB8E52394E6527935635f51E7",
    city.abi,
    owner
  );

  const setURIToadz = await toadzContract.setBaseURI(
    "https://ipfs.io/ipfs/QmWA9z9bTZkpPm1wQ4J4WqinbVv5iDZZxgTnMijKic14Ed"
  );
  await setURIToadz.wait();

  const setLoftsURI = await loftsContract.setBaseURI(
    "https://ipfs.io/ipfs/QmWkndsg1rzd8fh69WLM1HnSLc8XZr3YRChU68Z9LLcu85"
  );
  await setLoftsURI.wait();

  const setCityURI = await cityContract.setBaseURI(
    "https://ipfs.io/ipfs/QmdyNYmJkqUufMDfn9WHRLp4CJB1xErM9gXpvnRCFZHKcg"
  );
  await setCityURI.wait();

  const setAirdrop = await toadzContract.setAirdropInfo(
    airdropAddresses,
    airdropAmounts
  );
  await setAirdrop.wait();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
