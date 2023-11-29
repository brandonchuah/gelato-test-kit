import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name !== "hardhat") {
    console.log(
      `Deploying GelatoVRFConsumer to ${hre.network.name}. Hit ctrl + c to abort`
    );
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  //For 0x5ce... polygon
  const dedicatedMsgSender = "0xFD7089D182cB7b0005fF7dFdf8a86C828179a483";

  await deploy("GelatoVRFConsumer", {
    from: deployer,
    log: hre.network.name !== "hardhat",
    args: [dedicatedMsgSender],
  });
};

export default func;

func.tags = ["GelatoVRFConsumer"];
