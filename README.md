# head-in-a-jar
a simple smart contract project to create some pxlbot style images from other NFTs

### Set Environment Variables
Create a .env file in the root of your project. Ensure that it has the following variables set:
```
ETH_PRIVATE_KEY=PASTE_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=PASTE_KEY_HERE
```

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
