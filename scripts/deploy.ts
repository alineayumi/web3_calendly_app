import { artifacts, ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("Calend3");
  const contract = await Contract.deploy();

  await contract.deployed();

  saveFrontendFiles();
}

function saveFrontendFiles() {
  const fs = require("fs");

  const abiDir = __dirname + "/../frontend/src/abis";

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  const artifact = artifacts.readArtifactSync("Calend3");

  fs.writeFileSync(abiDir + "/Calend3.json", JSON.stringify(artifact, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
