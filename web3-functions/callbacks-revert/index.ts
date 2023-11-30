import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionFailContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";

const counterAddress = "0x5cDe11Db288B15fd8db9A9051e2c5B2078f4dEc3";
const COUNTER_ABI = [
  "function increaseCount() external",
  "function increaseCountStrict(uint256 interval)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs } = context;

  const interval = Number(userArgs.interval); // seconds

  const counter = new ethers.Contract(counterAddress, COUNTER_ABI);
  const data = counter.interface.encodeFunctionData("increaseCountStrict", [
    interval,
  ]);

  return { canExec: true, callData: [{ to: counterAddress, data }] };
});

Web3Function.onFail(async (context: Web3FunctionFailContext) => {
  const { storage, reason } = context;

  if (reason === "ExecutionReverted") {
    const { transactionHash } = context;
    const revertedCount = Number((await storage.get("reverted")) ?? 0);
    await storage.set("reverted", (revertedCount + 1).toString());

    console.log("transaction reverted: ", transactionHash);
  } else if (reason === "SimulationFailed") {
    const { callData } = context;

    const simulationFailedCount = Number(
      (await storage.get("simulation")) ?? 0
    );
    await storage.set("simulation", (simulationFailedCount + 1).toString());

    console.log("simulation failed: ", callData);
  } else {
    console.log("Insufficient funds");
  }
});
