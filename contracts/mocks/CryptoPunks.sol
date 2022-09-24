pragma solidity ^0.8.9;

contract CryptoPunks {
  mapping(uint256 => address) public punkIndexToAddress;

  function setOwner(uint256 tokenId, address owner) public {
    punkIndexToAddress[tokenId] = owner;
  }
}
