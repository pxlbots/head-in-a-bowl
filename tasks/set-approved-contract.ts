import { task } from 'hardhat/config'

const { types } = require('hardhat/config')
const { getContract } = require('./utils')
require('@nomiclabs/hardhat-ethers')

task('set-approved-contract', 'Sets the status of a contract')
  .addOptionalParam(
    'path',
    'path to a json list of contracts',
    '',
    types.string,
  )
  .addOptionalParam('address', 'address of said contract', '', types.string)
  .addOptionalParam(
    'status',
    'whether this contract is approved or not',
    true,
    types.boolean,
  )
  .setAction(async (args: any) => {
    const hre = require('hardhat')
    let merge = await getContract('PxlbotCryo', hre, 'deployer')
    if (args.path) {
      let contracts = require(args.path).contracts
      for (let i = 0; i < contracts.length; i++) {
        const { label, value } = contracts[i]
        let isApproved = await merge.approved_contracts(value)
        if (!isApproved) {
          console.log('approving contract...')
          let result = await merge.setApprovedContract(value, true)
          await result.wait()
          console.log(`contract ${label} (${value}) is approved.`)
        }
      }
    } else {
      console.log('approving...')
      await merge.setApprovedContract(args.address, args.status)
      console.log(`contract ${args.address} set to approval: ${args.status}`)
    }
  })

module.exports = {}
