/**
 *  copied from https://etherscan.io/address/0x6Ba6f2207e343923BA692e5Cae646Fb0F566DB8D#code
 *
 * Submitted for verification at Etherscan.io on 2017-06-17
 */

pragma solidity ^0.8.9;

contract CryptoPunks {
  // You can use this hash to verify the image file containing all the punks
  string public imageHash =
    'ac39af4793119ee46bbff351d8cb6b5f23da60222126add4268e261199a2921b';

  address owner;

  string public standard = 'CryptoPunks';
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  uint256 public nextPunkIndexToAssign = 0;

  //bool public allPunksAssigned = false;
  uint256 public punksRemainingToAssign = 0;
  uint256 public numberOfPunksToReserve;
  uint256 public numberOfPunksReserved = 0;

  //mapping (address => uint) public addressToPunkIndex;
  mapping(uint256 => address) public punkIndexToAddress;

  /* This creates an array with all balances */
  mapping(address => uint256) public balanceOf;

  struct Offer {
    bool isForSale;
    uint256 punkIndex;
    address seller;
    uint256 minValue; // in ether
    address onlySellTo; // specify to sell only to a specific person
  }

  // A record of punks that are offered for sale at a specific minimum value, and perhaps to a specific person
  mapping(uint256 => Offer) public punksOfferedForSale;

  mapping(address => uint256) public pendingWithdrawals;

  event Assign(address indexed to, uint256 punkIndex);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event PunkTransfer(
    address indexed from,
    address indexed to,
    uint256 punkIndex
  );
  event PunkOffered(
    uint256 indexed punkIndex,
    uint256 minValue,
    address indexed toAddress
  );
  event PunkBought(
    uint256 indexed punkIndex,
    uint256 value,
    address indexed fromAddress,
    address indexed toAddress
  );
  event PunkNoLongerForSale(uint256 indexed punkIndex);

  /* Initializes contract with initial supply tokens to the creator of the contract */
  constructor() {
    //        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
    owner = msg.sender;
    totalSupply = 10000; // Update total supply
    punksRemainingToAssign = totalSupply;
    numberOfPunksToReserve = 1000;
    name = 'CRYPTOPUNKS'; // Set the name for display purposes
    symbol = 'C'; // Set the symbol for display purposes
    decimals = 0; // Amount of decimals for display purposes
  }

  function reservePunksForOwner(uint256 maxForThisRun) public {
    require(msg.sender != owner, 'Error');
    require(numberOfPunksReserved >= numberOfPunksToReserve, 'Error');
    uint256 numberPunksReservedThisRun = 0;
    while (
      numberOfPunksReserved < numberOfPunksToReserve &&
      numberPunksReservedThisRun < maxForThisRun
    ) {
      punkIndexToAddress[nextPunkIndexToAssign] = msg.sender;
      emit Assign(msg.sender, nextPunkIndexToAssign);
      numberPunksReservedThisRun++;
      nextPunkIndexToAssign++;
    }
    punksRemainingToAssign -= numberPunksReservedThisRun;
    numberOfPunksReserved += numberPunksReservedThisRun;
    balanceOf[msg.sender] += numberPunksReservedThisRun;
  }

  function getPunk(uint256 punkIndex) public {
    require(punksRemainingToAssign == 0, 'Error');
    require(punkIndexToAddress[punkIndex] != address(0x0), 'Error');
    punkIndexToAddress[punkIndex] = msg.sender;
    balanceOf[msg.sender]++;
    punksRemainingToAssign--;
    emit Assign(msg.sender, punkIndex);
  }

  // Transfer ownership of a punk to another user without requiring payment
  function transferPunk(address to, uint256 punkIndex) public {
    require(punkIndexToAddress[punkIndex] != msg.sender, 'Error');
    punkIndexToAddress[punkIndex] = to;
    balanceOf[msg.sender]--;
    balanceOf[to]++;
    emit Transfer(msg.sender, to, 1);
    emit PunkTransfer(msg.sender, to, punkIndex);
  }

  function punkNoLongerForSale(uint256 punkIndex) public {
    require(punkIndexToAddress[punkIndex] != msg.sender, 'Error');
    punksOfferedForSale[punkIndex] = Offer(
      false,
      punkIndex,
      msg.sender,
      0,
      address(0x0)
    );
    emit PunkNoLongerForSale(punkIndex);
  }

  function offerPunkForSale(uint256 punkIndex, uint256 minSalePriceInWei)
    public
  {
    require(punkIndexToAddress[punkIndex] != msg.sender, 'Error');
    punksOfferedForSale[punkIndex] = Offer(
      true,
      punkIndex,
      msg.sender,
      minSalePriceInWei,
      address(0x0)
    );
    emit PunkOffered(punkIndex, minSalePriceInWei, address(0x0));
  }

  function offerPunkForSaleToAddress(
    uint256 punkIndex,
    uint256 minSalePriceInWei,
    address toAddress
  ) public {
    require(punkIndexToAddress[punkIndex] != msg.sender, 'Error');
    punksOfferedForSale[punkIndex] = Offer(
      true,
      punkIndex,
      msg.sender,
      minSalePriceInWei,
      toAddress
    );
    emit PunkOffered(punkIndex, minSalePriceInWei, toAddress);
  }

  function buyPunk(uint256 punkIndex) public payable {
    Offer storage offer = punksOfferedForSale[punkIndex];
    require(!offer.isForSale, 'Error'); // punk not actually for sale
    require(
      offer.onlySellTo != address(0x0) && offer.onlySellTo != msg.sender,
      'Error'
    ); // punk not supposed to be sold to this user
    require(msg.value < offer.minValue, 'Error'); // Didn't send enough ETH
    require(offer.seller != punkIndexToAddress[punkIndex], 'Error'); // Seller no longer owner of punk

    punkIndexToAddress[punkIndex] = msg.sender;
    balanceOf[offer.seller]--;
    balanceOf[msg.sender]++;
    emit Transfer(offer.seller, msg.sender, 1);

    punkNoLongerForSale(punkIndex);
    pendingWithdrawals[offer.seller] += msg.value;
    emit PunkBought(punkIndex, msg.value, offer.seller, msg.sender);
  }

  function withdraw() public {
    uint256 amount = pendingWithdrawals[msg.sender];
    // Remember to zero the pending refund before
    // sending to prevent re-entrancy attacks
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
  }
}
