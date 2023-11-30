import { AutomateSDK, TriggerType } from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const callbacksW3f = w3f.get("callbacks-revert");

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

  // Create task using automate sdk
  console.log("Creating automate task...");
  const callbackTask1 = await automate.createBatchExecTask({
    name: `OnFail callback dev`,
    web3FunctionHash: cid,
    web3FunctionArgs: { interval: 10 }, // 10 seconds
    trigger: { type: TriggerType.TIME, interval: 5 * 1000 }, // 5 seconds
  });

  const callbackTask2 = await automate.createBatchExecTask({
    name: `OnFail callback dev 2`,
    web3FunctionHash: cid,
    web3FunctionArgs: { interval: 9 }, // 9 seconds
    trigger: { type: TriggerType.TIME, interval: 5 * 1000 }, // 5 seconds
  });

  await callbackTask1.tx.wait();
  await callbackTask2.tx.wait();

  console.log(
    `✅ taskId: ${callbackTask1.taskId} (tx hash: ${callbackTask1.tx.hash})`
  );
  console.log(
    `✅ taskId: ${callbackTask2.taskId} (tx hash: ${callbackTask2.tx.hash})`
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
