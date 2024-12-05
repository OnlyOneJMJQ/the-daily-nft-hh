import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    buildbear: {
      url: "https://rpc.buildbear.io/criminal-lockjaw-e9468812",
      timeout: 100_000,
    },
  },
  solidity: "0.8.24",
};

export default config;
