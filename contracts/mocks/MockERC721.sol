// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract MockERC721 is ERC721 {
  uint256 public total_tokens;

  constructor() ERC721('MockERC721', 'MOCKERC721') {}

  function mint(address owner) public {
    total_tokens++;
    uint256 tokenId = total_tokens;
    _safeMint(owner, tokenId);
  }
}
