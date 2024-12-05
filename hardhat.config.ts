import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    buildbear_perma: {
      url: "https://rpc.buildbear.io/criminal-lockjaw-e9468812",
      timeout: 100_000,
    },
    buildbear_ci: {
      url: process.env.BUILDBEAR_RPC_URL ?? "",
      timeout: 100_000,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
      },
    },
  },
  solidity: "0.8.24",
};

export default config;
