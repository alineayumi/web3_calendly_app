import { ethers } from "hardhat";
import { expect } from "chai";

describe("Set rate", function () {
  it("Should set the minutely rate", async () => {
    const Contract = await ethers.getContractFactory("Calend3");
    const contract = await Contract.deploy();
    await contract.deployed();

    const transaction = await contract.setRate(1000);
    await transaction.wait(); // wait until the transaction is mined/validated

    // verify rate is set correctly
    expect(await contract.getRate()).to.equal(1000);

    // get addresses
    const [owner, address1, address2] = await ethers.getSigners();

    // call setRate using a different account address
    // this should fail since this address is not the owner
    await expect(contract.connect(address1).setRate(500)).to.be.revertedWith(
      "Only the owner can set the rate"
    );
  });
});
