import { task } from 'hardhat/config'

const { types } = require('hardhat/config')
const { getContract } = require('./utils')
require('@nomiclabs/hardhat-ethers')

task('burn-token', 'Burns a token')
  .addParam('token', 'id of the token to be burned')
  .setAction(async (args: any) => {
    const hre = require('hardhat')
    let merge = await getContract('PxlbotCryo', hre, 'deployer')
    await merge.burn(args.token)
    console.log(`token ${args.token} burned!`)
  })

module.exports = {}
