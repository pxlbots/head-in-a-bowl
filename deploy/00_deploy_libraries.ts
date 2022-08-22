import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  await deploy('Base64', {
    from: deployer,
    args: [],
    log: true,
  })
  await deploy('Strings', {
    from: deployer,
    args: [],
    log: true,
  })
}
export default func
func.tags = ['Base64', 'Strings']
