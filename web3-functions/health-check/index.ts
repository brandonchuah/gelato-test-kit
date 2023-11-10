import {
  Web3Function,
  Web3FunctionContext,
  Web3FunctionResult,
} from "@gelatonetwork/web3-functions-sdk";
import { Octokit } from "octokit";

// import dependencies used in onRun.js
import { Contract } from "@ethersproject/contracts";
import { gql, request } from "graphql-request";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { secrets } = context;

  const gistId = (await secrets.get("GIST_ID")) as string;

  const octokit = new Octokit();

  let onRunScript: string | undefined;

  // fetch onRun.js from private github gist
  try {
    const gistDetails = await octokit.rest.gists.get({
      gist_id: gistId,
    });

    const files = gistDetails.data.files;

    if (!files) throw new Error(`No files in gist`);

    for (const file of Object.values(files)) {
      if (file?.filename === "onRun.js" && file.content) {
        onRunScript = file.content;
        break;
      }
    }

    if (!onRunScript) throw new Error(`No onRun.js`);
  } catch (error) {
    return {
      canExec: false,
      message: `Error fetching gist: ${error.message}`,
    };
  }

  // run onRun.js
  try {
    /**
     * context are passed into onRun.js.
     * onRun.js will have access to all userArgs, secrets & storage
     */
    const onRunFunction = new Function(
      "context",
      "Contract",
      "gql",
      "request",
      onRunScript
    );
    const onRunResult: Web3FunctionResult = await onRunFunction(
      context,
      Contract,
      gql,
      request
    );

    if (onRunResult) {
      return onRunResult;
    } else {
      return { canExec: false, message: `No result returned` };
    }
  } catch (err) {
    console.log(err);
    return {
      canExec: false,
      message: `Error running gist: ${err.message}`,
    };
  }
});
