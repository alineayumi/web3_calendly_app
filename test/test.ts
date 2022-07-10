import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";
import type { Calend3, Calend3__factory } from "../typechain-types";
import { Signer } from "ethers";

describe("Calend3", function () {
  var Contract: Calend3__factory;
  var contract: Calend3;
  var owner: Signer;
  var address1: Signer;
  var address2: Signer;

  this.beforeEach(async function () {
    [owner, address1, address2] = await ethers.getSigners();
    Contract = await ethers.getContractFactory("Calend3");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should set the minutely rate", async () => {
    const transaction = await contract.setRate(1000);
    await transaction.wait(); // wait until the transaction is mined/validated

    expect(await contract.getRate()).to.equal(1000);
  });
  it("Should fail if non-owner sets rate", async () => {
    // get addresses
    [owner, address1, address2] = await ethers.getSigners();

    // call setRate using a different account address
    // this should fail since this address is not the owner
    await expect(contract.connect(address1).setRate(500)).to.be.revertedWith(
      "Only the owner can set the rate"
    );
  });

  it("Should create two appointments", async () => {
    const ownerBalanceBefore = await owner.getBalance();
    const address1BalanceBefore = await address1.getBalance();
    const address2BalanceBefore = await address2.getBalance();

    const transaction = await contract.setRate(
      ethers.utils.parseEther("0.001")
    );
    await transaction.wait();

    const transaction2 = await contract
      .connect(address1)
      .createAppointment("Breakfast at Tiffany's", 1644154200, 1644159600, {
        value: ethers.utils.parseEther("2"),
      });
    await transaction2.wait();

    const transaction3 = await contract
      .connect(address2)
      .createAppointment("Meeting with Aline", 1644143400, 1644150600, {
        value: ethers.utils.parseEther("1"),
      });
    await transaction.wait();

    const appointments = await contract.getAppointments();
    expect(appointments.length).to.equal(2);

    const ownerBalanceAfter = await owner.getBalance();
    const address1BalanceAfter = await address1.getBalance();
    const address2BalanceAfter = await address2.getBalance();

    expect(ownerBalanceBefore.toBigInt() < ownerBalanceAfter.toBigInt()).to.be
      .true;
    expect(address1BalanceBefore.toBigInt() > address1BalanceAfter.toBigInt())
      .to.be.true;
    expect(address2BalanceBefore.toBigInt() > address2BalanceAfter.toBigInt())
      .to.be.true;
  });
});
