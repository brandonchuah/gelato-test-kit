import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionSuccessContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";

const counterAddress = "0x5cDe11Db288B15fd8db9A9051e2c5B2078f4dEc3";
const COUNTER_ABI = [
  "function increaseCount() external",
  "function increaseCountStrict(uint256 interval)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, storage } = context;

  const lastExec = Number((await storage.get("lastExec")) ?? 0);
  const interval = Number(userArgs.interval);
  const now = Date.now();

  const counter = new ethers.Contract(counterAddress, COUNTER_ABI);
  const data = counter.interface.encodeFunctionData("increaseCount", []);

  if (now > lastExec + interval) {
    return { canExec: true, callData: [{ to: counterAddress, data }] };
  } else {
    return { canExec: false, message: "Interval not elapsed" };
  }
});

Web3Function.onSuccess(async (context: Web3FunctionSuccessContext) => {
  const { transactionHash, storage } = context;

  const now = Date.now().toString();
  await storage.set("lastExec", now);
  console.log("Increased count in: ", transactionHash);
  console.log("LastExec set to: ", now);
});
