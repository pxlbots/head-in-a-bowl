import { expect } from 'chai'
import { deployments } from 'hardhat'
const hre = require('hardhat')

const setupTest = deployments.createFixture(
  async ({ deployments, getNamedAccounts, ethers }, options) => {
    await deployments.fixture(['PxlbotCryo'])
    const { deployer } = await getNamedAccounts()
    let signers = await ethers.getSigners()
    const PxlbotCryo: any = await ethers.getContract('PxlbotCryo', deployer)

    const FakePunks: any = await ethers.getContractFactory('CryptoPunks')
    let punk = await FakePunks.deploy()
    await punk.deployed()

    //fake ID
    await punk.setOwner(111, signers[1].address)

    const PunkProxy: any = await ethers.getContractFactory('PunkProxy')
    let punk_proxy = await PunkProxy.deploy('PunkProxy', 'PUNKPROXY')
    await punk_proxy.deployed()

    await punk_proxy.setContract(punk.address)

    await PxlbotCryo.setApprovedContract(punk_proxy.address, true)

    return {
      contracts: { PxlbotCryo, PunkProxy: punk_proxy },
      addr1: signers[1],
      addr2: signers[2],
    }
  },
)

describe('Punk', function () {
  let contracts: any
  let addr1: any
  let addr2: any

  beforeEach(async function () {
    ;({ contracts, addr1, addr2 } = await setupTest())
  })

  it('Should properly verify a punk', async function () {
    const owner = await contracts.PunkProxy.ownerOf(111)
    expect(owner).to.equal(addr1.address)
  })

  it('Should pass Cryo test', async () => {
    await expect(
      contracts.PxlbotCryo.connect(addr1).request(
        contracts.PunkProxy.address,
        111,
      ),
    )
      .to.emit(contracts.PxlbotCryo, 'Requested')
      .withArgs(contracts.PunkProxy.address, 111, 0)
  })
})
