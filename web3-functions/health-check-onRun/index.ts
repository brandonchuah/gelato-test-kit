/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";
import request, { gql } from "graphql-request";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { gelatoArgs, multiChainProvider } = context;

  const CHAIN_CONFIGS: {
    [number: number]: { subgraphUrl: string; interval: number };
  } = {
    1: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-mainnet-test",
      interval: 57600, // 16 hours
    },
    5: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-goerli-test",
      interval: 43200, // 12 hours
    },
    10: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-optimism-test",
      interval: 43200, // 12 hours
    },
    56: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-bsc-test",
      interval: 86400, // 24 hours
    },
    100: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-gnosis-test",
      interval: 86400, // 24 hours
    },
    137: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-polygon/latest/gn",
      interval: 3600, // 1 hour
    },
    250: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-fantom-test",
      interval: 86400, // 24 hours
    },
    324: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-zksync/latest/gn",
      interval: 86400, // 24 hours
    },
    420: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-optimism-goerli-test",
      interval: 28800, // 8 hours
    },
    1101: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-polygonZk/latest/gn",
      interval: 86400, // 24 hours
    },
    8453: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-base/latest/gn",
      interval: 86400, // 24 hours
    },
    18231: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-unreal/latest/gn",
      interval: 86400, // 24 hours
    },
    42069: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-geloptestnet/latest/gn",
      interval: 86400, // 24 hours
    },
    42161: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-arbitrum-test",
      interval: 14400, // 4 hours
    },
    43114: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-avalanche-test",
      interval: 86400, //24 hours
    },
    59144: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-linea/latest/gn",
      interval: 86400, // 24 hours
    },
    80001: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-mumbai/latest/gn",
      interval: 7200, // 2 hours
    },
    421613: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-arbitrum-goerli-test",
      interval: 28800, // 8 hours
    },
    421614: {
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/brandonchuah/poke-me-arbsepolia-test",
      interval: 86400, // 24 hours
    },
    84531: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-basegoerli/latest/gn",
      interval: 86400, // 12 hours
    },
    1261120: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-zkatana/latest/gn",
      interval: 86400, // 24 hours
    },
    11155111: {
      subgraphUrl:
        "https://api.studio.thegraph.com/query/44924/poke-me-sepolia-test/version/latest",
      interval: 86400, // 12 hours
    },
    11155420: {
      subgraphUrl:
        "https://api.goldsky.com/api/public/project_cliocs4xa038s4aumegvqdn8d/subgraphs/w3f-osepolia/latest/gn",
      interval: 86400, // 24 hours
    },
  };

  const provider = multiChainProvider.default();

  const adboardAddress =
    gelatoArgs.chainId == 100 // gnosis
      ? "0x71B9B0F6C999CBbB0FeF9c92B80D54e4973214da"
      : gelatoArgs.chainId == 59144 //linea
      ? "0x574ef783FDF805deFF4567393cCaC483F1030Af5"
      : gelatoArgs.chainId == 324 //zksync
      ? "0xb84e796b84aFa71B1DC1042f68086E7940000c84"
      : "0x28a0A1C63E7E8F0DAe5ad633fe232c12b489d5f0";

  const adBoardAbi = [
    "function postMessage(string calldata _message) external",
    "function opsProxyFactory() external view returns(address)",
    "function viewMessage(address _eoa) external view returns(string memory)",
  ];

  const adBoard = new Contract(adboardAddress, adBoardAbi, provider);

  const { subgraphUrl, interval } = CHAIN_CONFIGS[gelatoArgs.chainId];

  const query = gql`
    query LatestExecution {
      taskExecutions(first: 1, orderBy: executedAt, orderDirection: desc) {
        executedAt
      }
    }
  `;

  const data = (await request(subgraphUrl, query)) as any;
  const lastExecutionTimeInSec = Number(data.taskExecutions[0].executedAt);
  const lastExecutionTimeHumanReadable = new Date(
    lastExecutionTimeInSec * 1000
  ).toLocaleString();

  const timeNowInSec = Math.floor(Date.now() / 1000);
  const timeNowHumanReadable = new Date(timeNowInSec * 1000).toLocaleString();

  if (timeNowInSec > lastExecutionTimeInSec + interval) {
    // const opsProxyFactoryAddress = await adBoard.opsProxyFactory();

    // const opsProxyFactoryAbi = [
    //   "function getProxyOf(address account) external view returns (address, bool)",
    // ];

    // const opsProxyFactory = new Contract(
    //   opsProxyFactoryAddress,
    //   opsProxyFactoryAbi
    // );

    // double check in case of subgraph lagging
    const taskCreator = "0x5ce6047a715B1919A58C549E6FBc1921B4d9287D";
    const lastMessage = await adBoard.viewMessage(taskCreator);

    let lastExecutionTimeOnChainInSec = 0;

    try {
      lastExecutionTimeOnChainInSec = Number(lastMessage);
      // eslint-disable-next-line no-empty
    } catch {}

    const lastExecutionTimeOnChainHumanReadable = new Date(
      lastExecutionTimeOnChainInSec * 1000
    ).toLocaleString();

    if (timeNowInSec > lastExecutionTimeOnChainInSec + interval) {
      return {
        canExec: true,
        callData: [
          {
            to: adboardAddress,
            data: adBoard.interface.encodeFunctionData("postMessage", [
              timeNowInSec.toString(),
            ]),
          },
        ],
      };
    } else {
      return {
        canExec: false,
        message: `timeNow: ${timeNowHumanReadable}, lastExecOnChain: ${lastExecutionTimeOnChainHumanReadable}, interval: ${interval}`,
      };
    }
  } else {
    return {
      canExec: false,
      message: `timeNow: ${timeNowHumanReadable}, lastExecSubgraph: ${lastExecutionTimeHumanReadable}, interval: ${interval}`,
    };
  }
});
