// Generate the 10K metadata

const fs = require("fs");

const metadata = {};
const FILE_START = 1;
const FILE_END = 10000;
const outJsonDir = `./jsonPinkSquare`;
const name = "Pink Square";
const description = "Pink Square";
const CID = "QmVemse3JLrn7HWW4eP7FxmXBiYFxaFvH4vLmYWBSXvHxk";

if (fs.existsSync(outJsonDir))
  fs.rmSync(outJsonDir, { recursive: true, force: true });

fs.mkdirSync(outJsonDir);

for (let i = FILE_START; i <= FILE_END; i++) {
  metadata["name"] = `${name} #${i}`;
  metadata["image"] = `ipfs://${CID}/`;

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
