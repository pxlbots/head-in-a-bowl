import { task } from 'hardhat/config'

const { types } = require('hardhat/config')
const { getContract } = require('./utils')
require('@nomiclabs/hardhat-ethers')

task('test-request', 'Sends a test request to the contract')
  .addParam('address', 'address of said contract', '', types.string)
  .addParam('token', 'id of the token')
  .setAction(async (args: any) => {
    const hre = require('hardhat')
    let merge = await getContract('PxlbotCryo', hre, 'deployer')
    let result = await merge.request(args.address, args.token)
    console.log(`token ${args.token} from ${args.address} requested`)
  })

module.exports = {}
