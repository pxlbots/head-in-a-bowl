import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import '@nomicfoundation/hardhat-toolbox'

import Dotenv from 'dotenv'
Dotenv.config()

// load tasks
const glob = require('glob')
const path = require('path')
glob.sync('./tasks/**/*.js').forEach(function (file: string) {
  require(path.resolve(file))
})

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  namedAccounts: {
    deployer: {
      default: 0,
      mumbai: '0x74aBdb9C9FD5E4C5b843D70B56C61a2C6390e0E0',
    },
    tester: {
      default: 1,
    },
    tester2: {
      default: 2,
    },
    tester3: {
      default: 3,
    },
    tester4: {
      default: 4,
    },
    tester5: {
      default: 5,
    },
  },
  paths: {
    sources: 'contracts',
    artifacts: './artifacts',
  },
  networks: {
    ganache: {
      chainId: 1337,
      url: process.env.GAME_LOCAL_RPC || 'HTTP://127.0.0.1:7546',
    },
    goerli: {
      live: true,
      chainId: 5,
      url: 'https://eth-goerli.g.alchemy.com/v2/FK69QLNIkH6Nl5Cqk5LuecaLy3-WvQQk',
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
    ethereum: {
      live: true,
      chainId: 1,
      url: 'https://eth-mainnet.g.alchemy.com/v2/t2hsx_n48xxWThAVNJVHxZk-KtDtBDme',
      accounts: [process.env.ETH_PRIVATE_KEY],
    },
  },
}

export default config
