// Generate the 10K metadata

const fs = require("fs");

const metadata = {};
const FILE_START = 1;
const FILE_END = 10000;
const outJsonDir = `./jsonNew`;
const name = "Songbird City";
const description =
  "Songbird City is the metaverse of mischief and fun. This NFT marks the beginning of a journey into the beautiful urban aesthetic of neon signs and nighttime adventure.";
const CID = "QmWSvFvvUWR7RnMvvEPukV34iawaA2CstPBN5kD78pR4cm";

if (fs.existsSync(outJsonDir))
  fs.rmSync(outJsonDir, { recursive: true, force: true });

fs.mkdirSync(outJsonDir);

for (let i = FILE_START; i <= FILE_END; i++) {
  metadata["name"] = `${name} #${i}`;
  metadata["image"] = `ipfs://${CID}/${name}.mp4`;

  metadata["attributes"] = [
    {
      trait_type: "Name",
      value: `${name}`,
    },
  ];

  metadata["description"] = `${description}`;

  fs.writeFileSync(
    `${outJsonDir}/${i}.json`,
    JSON.stringify(metadata, null, 2)
  );
}
