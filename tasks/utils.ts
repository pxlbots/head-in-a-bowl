require('dotenv').config()
const _getSigner = async (hre: any, name: string) => {
  const { getNamedAccounts } = hre
  const namedAccounts = await getNamedAccounts()
  return await hre.ethers.getSigner(namedAccounts[name])
}
export const getContract = async (
  name: string,
  hre: any,
  signerName = 'tester',
) => {
  const signer = await _getSigner(hre, signerName)
  return await hre.ethers.getContract(name, signer)
}
