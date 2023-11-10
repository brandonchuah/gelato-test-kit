import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers } = hre;

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", await deployer.getAddress());
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const taskId = "";

  if (taskId) {
    console.log("Cancelling task: ", taskId);
    const { transactionHash } = await (
      await automate.cancelTask(taskId)
    ).tx.wait();
    console.log(`✅ Cancelled in ${transactionHash}`);
  }
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
