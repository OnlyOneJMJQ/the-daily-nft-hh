import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@sentio/hardhat-sentio";

const config: HardhatUserConfig = {
  networks: {
    buildbear_perma: {
      url: "https://rpc.buildbear.io/criminal-lockjaw-e9468812",
      timeout: 100_000,
    },
    buildbear_op: {
      url: "https://rpc.dev.buildbear.io/fair-sandman-f116c9f3",
      timeout: 100_000,
      accounts: {
        mnemonic:
          "term health walnut lake kiss humor bless snap spawn solution stool thrive",
      },
    },
    buildbear_ci: {
      url: process.env.BUILDBEAR_RPC_URL ?? "",
      timeout: 100_000,
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "",
      },
    },
  },
  sentio: {
    project: "joshbb/the-daily-nft",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
};

export default config;
