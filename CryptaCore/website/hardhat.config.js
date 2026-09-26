import '@nomicfoundation/hardhat-toolbox';

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        count: 20,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
