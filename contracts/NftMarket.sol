// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  struct NftItem {
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
  }

 uint public listingPrice = 0.025 ether;

  Counters.Counter private _listedItems;
  Counters.Counter private _tokenIds;

 
 
mapping(string => bool) private _usedTokenURIs;
mapping(uint => NftItem) private _idToNftItem;

mapping(address => mapping(uint => uint)) private _ownedTokens;
mapping(uint => uint) private _idToOwnedIndex;
//video note sec 12.70   uint and uint256 are the same thing
// all tokenIds in the array
uint256[] private _allNfts;
mapping(uint => uint) private _idToNftIndex;

  event NftItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() ERC721("CreaturesNFT", "CNFT") {}

function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
  }




function getNftItem(uint tokenId) public view returns (NftItem memory) {
    return _idToNftItem[tokenId];
  }

  function listedItemsCount() public view returns (uint) {
    return _listedItems.current();
  }

function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

 function totalSupply() public view returns (uint) {
    return _allNfts.length;
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _allNfts[index];
  }

//ex 13.78
function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
    require(index < ERC721.balanceOf(owner), "Index out of bounds");
    return _ownedTokens[owner][index];
  }



//ex 12.73
function getAllNftsOnSale() public view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }

    return items;
  }
//ex 13.78
function getOwnedNfts() public view returns (NftItem[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    NftItem[] memory items = new NftItem[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
      NftItem storage item = _idToNftItem[tokenId];
      items[i] = item;
    }

    return items;
  }
//Ex 15.85, Burn Token.
//Note this is where i ran into the massive problem of failure
//i have redone all the exercise until this step again.
//I am thinking of leaving the code in but not executing the BURN code
//until the end out of fear I may run into the big problem agagin
///* in Ex 16.86 instructor actually has us delete burn
//funtionally as our contract will not have this ability.
 // function burnToken(uint tokenId) public {
 //   _burn(tokenId);
 // }



 function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
  require(!tokenURIExists(tokenURI), "Token URI already exists");
  require(msg.value == listingPrice, "Price must be equal to listing price");

    _tokenIds.increment();
    _listedItems.increment();

    uint newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _createNftItem(newTokenId, price);
    _usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }



//sec 11.68
//note that when you are buying an aft you are actually delisting it.
function buyNft(
    uint tokenId
  ) public payable {
    uint price = _idToNftItem[tokenId].price;
    address owner = ERC721.ownerOf(tokenId);

    require(msg.sender != owner, "You already own this NFT");
    require(msg.value == price, "Please submit the asking price");
//note that when you are buying an nft you are actually delisting it.
    _idToNftItem[tokenId].isListed = false;
    _listedItems.decrement();

    _transfer(owner, msg.sender, tokenId);
    payable(owner).transfer(msg.value);
  }

//Ex 16.86 Place Nft on sale
// this is when you want to relist it after it has been bought or delisted
function placeNftOnSale(uint tokenId, uint newPrice) public payable {
    require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
    require(_idToNftItem[tokenId].isListed == false, "Item is already on sale");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _idToNftItem[tokenId].isListed = true;
    _idToNftItem[tokenId].price = newPrice;
    _listedItems.increment();
  }

function _createNftItem(
    uint tokenId,
    uint price
  ) private {
    require(price > 0, "Price must be at least 1 wei");

    _idToNftItem[tokenId] = NftItem(
      tokenId,
      price,
      msg.sender,
      true
    );

    emit NftItemCreated(tokenId, price, msg.sender, true);
  }

function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, tokenId);

    // minting token and other cases
    if (from == address(0)) {
      _addTokenToAllTokensEnumeration(tokenId);
    } else if (from != to) {  //ex 14.80 remove token from owned list
       _removeTokenFromOwnerEnumeration(from, tokenId);
    }

 // ex 15.83 remove token from all enums
   if (to == address(0)){
    _removeTokenFromAllTokensEnumeration(tokenId);
   } else if (to != from) {  // in ex 13.76 goal is to get all nfts for a specific owner
      _addTokenToOwnerEnumeration(to, tokenId);
    }

  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNftIndex[tokenId] = _allNfts.length;
    _allNfts.push(tokenId);
  }
//Ex 13.76, all tokens for a given user/address/owner
 function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
    uint length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnedIndex[tokenId] = length;
  }

//ex 14.80 remove token from owned list
function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
    uint lastTokenIndex = ERC721.balanceOf(from) - 1;
    uint tokenIndex = _idToOwnedIndex[tokenId];

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _ownedTokens[from][lastTokenIndex];

      _ownedTokens[from][tokenIndex] = lastTokenId;
      _idToOwnedIndex[lastTokenId] = tokenIndex;
    }

    delete _idToOwnedIndex[tokenId];
    delete _ownedTokens[from][lastTokenIndex];
  }
//Ex 15.83 remove token from alltoken  enums
  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allNfts[lastTokenIndex];

    _allNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;

    delete _idToNftIndex[tokenId];
    _allNfts.pop();
  }
}