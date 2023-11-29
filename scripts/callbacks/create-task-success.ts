import { AutomateSDK, TriggerType } from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const callbacksW3f = w3f.get("callbacks");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", await deployer.getAddress());
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer, undefined, {
    isDevelopment: true,
  });
  // const web3Function = new Web3Function(chainId, deployer);

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const cid = await callbacksW3f.deploy();
  console.log(`✅ W3F CID: ${cid}`);

  // Predict task id and set task secret (to prevent task starts checking before secret is set)
  // const populatedTx = await automate.prepareBatchExecTask({
  //   name: `OnSuccess callback dev`,
  //   web3FunctionHash: cid,
  //   web3FunctionArgs: { interval: 300000 },
  //   trigger: { type: TriggerType.TIME, interval: 30 * 1000 }, // 30 seconds
  // });

  // Create task using automate sdk
  console.log("Creating automate task...");
  const { taskId, tx } = await automate.createBatchExecTask({
    name: `OnSuccess callback dev`,
    web3FunctionHash: cid,
    web3FunctionArgs: { interval: 300000 },
    trigger: { type: TriggerType.TIME, interval: 30 * 1000 }, // 30 seconds
  });
  await tx.wait();
  console.log(`✅ taskId: ${taskId} (tx hash: ${tx.hash})`);
  console.log(
    `> https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
  );
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
