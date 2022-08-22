import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute } = deployments

  const { deployer } = await getNamedAccounts()

  const Base64 = await deployments.get('Base64')
  const Strings = await deployments.get('Strings')

  await deploy('PxlbotCryo', {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      Base64: Base64.address,
      Strings: Strings.address,
    },
  })
}
export default func
func.dependencies = ['Base64', 'Strings']
func.tags = ['PxlbotCryo']
