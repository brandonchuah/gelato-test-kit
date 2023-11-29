import {
  Web3Function,
  Web3FunctionEventContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";

Web3Function.onRun(async (context: Web3FunctionEventContext) => {
  const { log } = context;

  const consumerInterface = new ethers.utils.Interface(consumerAbi);

  const { args } = consumerInterface.parseLog(log);

  const nonce = Number(args[0]);
  const fulfilledCount = Number(args[1]);
  const requestTime = Number(args[2].requestTime);
  const requestBlock = Number(args[2].requestBlock);
  const fulfilledTime = Number(args[2].fulfilledTime);
  const fulfilledBlock = Number(args[2].fulfilledBlock);
  const randomness = Number(args[2].randomness);

  console.log(
    `n:${nonce},req:${requestTime},${requestBlock}.ful:${fulfilledTime},${fulfilledBlock}`
  );
  const timeLatency = fulfilledTime - requestTime;
  const blockLatency = fulfilledBlock - requestBlock;

  return {
    canExec: false,
    message: `n:${nonce}. fulfilled:${fulfilledCount}. timeLatency:${timeLatency}. blockLatency:${blockLatency}. randomness:${randomness
      .toString()
      .slice(0, 5)}.`,
  };
});

const consumerAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dedicatedMsgSender",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "fulfilledCount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "requestTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requestBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fulfilledTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fulfilledBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "randomness",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct GelatoVRFConsumer.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "RandomnessFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "RequestedRandomness",
    type: "event",
  },
  {
    inputs: [],
    name: "dedicatedMsgSender",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "dataWithTimestamp",
        type: "bytes",
      },
    ],
    name: "fulfillRandomness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nonceFulfilledCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requestPending",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_count",
        type: "uint256",
      },
    ],
    name: "requestRandomness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "requestId",
        type: "uint64",
      },
    ],
    name: "requestedHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "requests",
    outputs: [
      {
        internalType: "uint256",
        name: "requestTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requestBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fulfilledTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fulfilledBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
