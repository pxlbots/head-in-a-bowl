import { expect } from 'chai'
import { deployments } from 'hardhat'
const hre = require('hardhat')

const convertURIToObject = function (uri: string): any {
  //get the base64 json data
  let data = uri.split('base64,')[1]
  // Create a buffer from the string
  let bufferObj = Buffer.from(data, 'base64')
  // Encode the Buffer as a utf8 string
  let decodedString = bufferObj.toString('utf8')
  // console.log('decodedString', decodedString)
  return JSON.parse(decodedString)
}

const setupTest = deployments.createFixture(
  async ({ deployments, getNamedAccounts, ethers }, options) => {
    await deployments.fixture(['PxlbotCryo'])
    const { deployer } = await getNamedAccounts()
    let signers = await ethers.getSigners()
    const PxlbotCryo: any = await ethers.getContract('PxlbotCryo', deployer)

    const FakeToken: any = await ethers.getContractFactory('MockERC721')
    let mockContract = await FakeToken.deploy()
    await mockContract.deployed()

    await PxlbotCryo.setApprovedContract(mockContract.address, true)

    const BadToken: any = await ethers.getContractFactory('MockERC721')
    let bad_contract = await BadToken.deploy()
    await bad_contract.deployed()

    let txn = await mockContract.mint(signers[1].address)
    await txn.wait()
    let mock_id = (await mockContract.total_tokens()).toNumber()

    return {
      contract: PxlbotCryo,
      mock: mockContract,
      bad_contract,
      mock_id,
      addr1: signers[1],
      addr2: signers[2],
    }
  },
)

describe('PxlbotCryo', function () {
  let contract: any
  let mock: any
  let mock_id: number
  let addr1: any
  let addr2: any
  let bad_contract: any

  beforeEach(async function () {
    ;({ contract, mock, mock_id, addr1, addr2, bad_contract } =
      await setupTest())
  })

  it('Should send a request', async function () {
    let address = mock.address
    await expect(contract.connect(addr1).request(address, mock_id))
      .to.emit(contract, 'Requested')
      .withArgs(address, mock_id, 0)
  })
  it('Should fulfill a request', async function () {
    let address = mock.address
    await contract.connect(addr1).request(address, mock_id)
    await expect(contract.fulfill(0, 'https://foo/bar'))
      .to.emit(contract, 'Fulfilled')
      .withArgs(address, mock_id, 0)
  })
  it('Should not allow request to be repeated', async function () {
    let address = mock.address
    await contract.connect(addr1).request(address, mock_id)
    await contract.fulfill(0, 'https://foo/bar')
    await expect(contract.request(address, mock_id)).to.be.revertedWith(
      'This cryo has already been generated.',
    )
  })
  it('Should not allow request to be fulfilled twice', async function () {
    let address = mock.address
    await contract.connect(addr1).request(address, mock_id)
    await contract.fulfill(0, 'https://foo/bar')
    await expect(contract.fulfill(0, 'https://foo/bar')).to.be.revertedWith(
      'invalid request ID',
    )
  })
  it('Should not allow non-owner to request', async function () {
    let address = mock.address
    await expect(
      contract.connect(addr2).request(address, mock_id),
    ).to.be.revertedWith('Only token owner can call this function.')
  })
  it('Should not allow non-whitelisted contract', async function () {
    await bad_contract.mint(addr1.address)
    let bad_token = (await bad_contract.total_tokens()).toNumber()
    await expect(
      contract.connect(addr1).request(bad_contract.address, bad_token),
    ).to.be.revertedWith('This contract is not approved')
  })
  it('should mint a new NFT for owner', async () => {
    let address = mock.address
    await contract.connect(addr1).request(address, mock_id)
    await expect(contract.fulfill(0, 'https://foo/bar'))
      .to.emit(contract, 'Fulfilled')
      .withArgs(address, mock_id, 0)
    let token_id = (await contract.total_tokens()).toNumber()
    let owner = await contract.ownerOf(token_id)
    expect(owner).to.equal(addr1.address)
    let uri = await contract.tokenURI(token_id)
    let data = convertURIToObject(uri)
    expect(data.image).to.equal('https://foo/bar')
  })
})
