import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers } = hre;

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", await deployer.getAddress());
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer, undefined, {
    isDevelopment: true,
  });

  const taskId =
    "0x59bf40c6ae92f683b107f136bbac4fc7c4c7daadad0428422dc8bfee4f513534";

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
