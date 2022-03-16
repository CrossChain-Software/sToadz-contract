// Generate the 10K metadata

const fs = require("fs");

const metadata = {};
const FILE_START = 1;
const FILE_END = 10000;
const outJsonDir = `./jsonLuxuryLofts`;
const name = "Luxury Lofts";
const description =
  "Luxury Lofts is the first building to own in Songbird City. Its windows feature glimpses into some of the lives that populate Songbird City. There’s drama, romance, humor all wrapped in a lovely film noir aesthetic for a stylish twist on the meta.";
const CID = "QmQ7Xc2mwnsx1Bt7zaPSTqPKkmueuVteHkY6idgqsDH5xz";

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
