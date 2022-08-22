const { types } = require('hardhat/config')
const { getContract } = require('./utils')
require('@nomiclabs/hardhat-ethers')

task('set-base-uri', 'Sets the status of a contract')
  .addParam('uri', 'uri to set', '', types.string)
  .setAction(async (args) => {
    const hre = require('hardhat')
    let merge = await getContract('PxlbotCryo', hre, 'deployer')
    let result = await merge.setBaseURI(args.uri)
    console.log(`contract uri set to: ${args.uri}`)
  })

module.exports = {}
