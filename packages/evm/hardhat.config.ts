import { HardhatUserConfig } from "hardhat/config";
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'dotenv/config'

const accounts = process.env.PRIVATE_KEY ?  [process.env.PRIVATE_KEY]:[];

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  typechain: {
    outDir: "app/src/typechain-types",
  },
  networks: {
    testnet: {
      // Polygon Amoy
      chainId: 80002,
      url: 'https://rpc-amoy.polygon.technology',
      saveDeployments: true,
      accounts,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};

export default config;
