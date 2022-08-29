# head-in-a-jar
a simple smart contract project to create some pxlbot style images from other NFTs

## Setup/Installation
* After cloning project, run `npm install`
* Download artifacts/cache [here](https://drive.google.com/file/d/1x2NyDZIV_Wkb-UrFvyLCKrGy-vnGnJnF/view?usp=sharing)
 * These must go in the root level of the project

### Set Environment Variables
Create a .env file in the root of your project. Ensure that it has the following variables set:
```
ETH_PRIVATE_KEY=PASTE_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=PASTE_KEY_HERE
```
**ETH_PRIVATE_KEY** is the private key of the [TI-87 contract](https://docs.google.com/spreadsheets/d/1gMhiWb3Pg8nE_Np70AR0H31oubg0haQMPipKhqm9Hn4/edit#gid=0), found in 1Password. The **ETHERSCAN_API_KEY** is for contract verification, and is not needed unless you are deploying a new contract.

## Adding supported contracts
Run the following command to add a new contract:
```
npx hardhat set-approved-contract --network ethereum --address PASTE_CONTRACT_ADDRESS_HERE
```

## Remove a supported contract
If you need to remove support for a given contract, run the following:
```
npx hardhat set-approved-contract --network ethereum --address PASTE_CONTRACT_ADDRESS_HERE --status false
```
