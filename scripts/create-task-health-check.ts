import {
  AutomateSDK,
  TriggerType,
  Web3Function,
} from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const oracleW3f = w3f.get("health-check");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer: ", await deployer.getAddress());
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);
  const web3Function = new Web3Function(chainId, deployer);

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const cid = await oracleW3f.deploy();
  console.log(`✅ W3F CID: ${cid}`);

  // Predict task id and set task secret (to prevent task starts checking before secret is set)
  const populatedTx = await automate.prepareBatchExecTask({
    name: `Health Check - ${hre.network.name}`,
    web3FunctionHash: cid,
    web3FunctionArgs: {},
    trigger: { type: TriggerType.TIME, interval: 30 * 60 * 1000 }, // 30 minutes
  });

  const expectedTaskId = populatedTx.taskId;

  // Set task specific secrets
  const secrets = oracleW3f.getSecrets();
  if (Object.keys(secrets).length > 0) {
    await web3Function.secrets.set(secrets, expectedTaskId);
    console.log(`✅ Secrets set`);
  }

  // Create task using automate sdk
  console.log("Creating automate task...");
  const { taskId, tx } = await automate.createBatchExecTask({
    name: `Health Check - ${hre.network.name}`,
    web3FunctionHash: cid,
    web3FunctionArgs: {},
    trigger: { type: TriggerType.TIME, interval: 30 * 60 * 1000 }, // 30 minutes
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
