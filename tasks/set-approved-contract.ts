import { task } from 'hardhat/config'

const { types } = require('hardhat/config')
const { getContract } = require('./utils')
require('@nomiclabs/hardhat-ethers')

task('set-approved-contract', 'Sets the status of a contract')
  .addParam('address', 'address of said contract', '', types.string)
  .addParam(
    'status',
    'whether this contract is approved or not',
    true,
    types.boolean,
  )
  .setAction(async (args: any) => {
    const hre = require('hardhat')
    let merge = await getContract('PxlbotCryo', hre, 'deployer')
    let result = await merge.setApprovedContract(args.address, args.status)
    console.log(`contract ${args.address} set to approval: ${args.status}`)
  })

module.exports = {}
