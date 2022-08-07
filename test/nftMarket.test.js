
const NftMarket = artifacts.require("NftMarket");
//Exer 10.63 took out the truffleAssert statements because intructor
//could not get to work either correctly.
//need to study this...
// const truffleAssert = require('truffle-assertions');
const { ethers } = require("ethers");
//after redoing my labs. i found that i leave this assert statement
//my code fails. instructor actually deleted from his lab.
//const {assert} = require("console");   //may not be needed sec 11.69 

//however, if i use this assert , my code works.
//but instructor does not use this statement in his labs and it works.
const assert = require('assert')
contract("NftMarket", accounts => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
    console.log(accounts);
  })

  describe("Mint token", () => {
    const tokenURI = "https://test.com";
    before(async () => {
      await _contract.mintToken(tokenURI,_nftPrice, {
        from: accounts[0],
        value: _listingPrice
       
      })
    })
    
    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      console.log("Ex 10.60-Owner ", owner)
      // you could also write:
      //assert(owner == accounts[0], "Owner of token is not matching address[0]");

      assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
    })

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      console.log("Ex 10.61-actualTokenURI",actualTokenURI);
      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    })

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice,{
        from: accounts[0]
         })
        } catch(error) {
         assert(error, "NFT was minted with previously used tokenURI");

        }
//sec 10.63 try the truffleassert to try to get error when mint tokens
//with the same uri
//      await truffleAssert.fails(
//        _contract.mintToken(tokenURI, {
 //       from: accounts[0]
 //      }),
 //       truffleAssert.ErrorType.REVERT,
 //       "Token URI already exists"
 //   );

    })   

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      // this will output BigNumber, BG, so conver to string
      console.log("ex 10.65 Listed Item Count",listedItemCount.toNumber())
      assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
    })

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);
      console.log("Ex 10.66, nftItem", nftItem)
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Nft price is not correct");
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
      assert.equal(nftItem.isListed, true, "Token is not listed");
    })

  })
///// end describe 1

//Sec 11.69, new describe 2
/*describe("Buy NFT", () => {
  before(async () => {
    await _contract.buyNft(1,{
      from: accounts[1],
      value: _nftPrice
    })
  })
  it("should unlist the item",() =>{
    assert(true);
  })
})
*/
describe("Buy NFT", () => {
  before(async () => {
    await _contract.buyNft(1, {
      from: accounts[1],
      value: _nftPrice
    })
  })

  it("should unlist the item", async () => {
    const listedItem = await _contract.getNftItem(1);
    console.log("Ex 11.69, listedItem",listedItem)
    assert.equal(listedItem.isListed, false, "Item is still listed");
  })

  it("should decrease listed items count", async () => {
    const listedItemsCount = await _contract.listedItemsCount();
    assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
  })

  it("should change the owner", async () => {
    const currentOwner = await _contract.ownerOf(1);
    console.log("Ex 11.69 CurrentOwner ",currentOwner)
    assert.equal(currentOwner, accounts[1], "Item is still listed");
  })
})

//end describe 2
//ex 12.72 begin describe 3, 
describe("Token transfers", () => {
  const tokenURI = "https://test-json-2.com";
 //we are going to mint our 2nd token here ex 12.72
  before(async () => {
    await _contract.mintToken(tokenURI, _nftPrice, {
      from: accounts[0],  //account 0 will be the owner & creator of the 2 nfts
      value: _listingPrice
    })
  })

  it("should have two NFTs created", async () => {
    const totalSupply = await _contract.totalSupply();
    assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
  })

  it("should be able to retreive nft by index", async () => {
    const nftId1 = await _contract.tokenByIndex(0);
    const nftId2 = await _contract.tokenByIndex(1);
    assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
    assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
  })

  //Ex 12.75
  it("should have one listed NFT", async () => {
    const allNfts = await _contract.getAllNftsOnSale();
    console.log("ex 12.75 how many nfts are listed ",allNfts);;
    console.log("ex 12.75 token ids ",allNfts[0].tokenId);
    assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
  })
//ex 13.79
  it("account[1] should have one owned NFT", async () => {
    const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
    console.log("Ex 13.79 Nfts owned by account 0",ownedNfts);

    assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
  })

  it("account[0] should have one owned NFT", async () => {
    const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
    console.log("Ex 13.79 Nfts owned by account 0",ownedNfts);
    assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
  })
})
//end describe 3
//ex 14.82, Describe 4 test remove token from owned enums 
describe("Token transfer to new owner", () => {
  before(async () => {
    await _contract.transferFrom(
      accounts[0],
      accounts[1],
      2
    )
  })

  it("accounts[0] should own 0 tokens", async () => {
    const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
    console.log("Ex 14.82 Nfts owned by account 0",ownedNfts);
    assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
  })

  it("accounts[1] should own 2 tokens", async () => {
    const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
    console.log("Ex 14.82 Nfts owned by account 1",ownedNfts);
    assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
  })
})
//end describve 4
//ex 15.85, Describe 5 Test Burn token 
// for Ex 16.86 instructor has us remove everything dealing with 
//burn tokesn in sol and test js. I left here. Note I did not 
//actually run the sol burn token function.
/* so comment out for for Ex 16.86
describe("Burn Token", () => {
  const tokenURI = "https://test-json3.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice,  {
        from: accounts[2],
        value: _listingPrice
      })
    })
    it("account[2] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({from: accounts[2]});
      console.log("Ex 15.85,bef burn. OwnedNfts ",ownedNfts);
      const allNfts = await _contract.getAllNftsOnSale();
      console.log("Ex 15.85,bef burn. All NFTS ON Sale",allNfts)
      //test for balance of 
      const balanceOf = await _contract.balanceOf(accounts[2]);
      console.log("Ex 15.85,bef burn. balance",balanceOf.toNumber());

      const ownerOf = await _contract.ownerOf(3);
      console.log("Ex 15.86, bef burn. Owner",ownerOf);


      assert.equal(ownedNfts[0].tokenId, 3, "Nft has a wrong id");
    })
    //now burn nft
    //due to have run into prolbems before at this point of the exercises
    //i am thinking of skipping the code to burning. 
    //i commentd out the code in the sol contract
    it("account[2] should own 0 NFTs", async () => {
      await _contract.burnToken(3, {from: accounts[2]});
      const ownedNfts = await _contract.getOwnedNfts({from: accounts[2]});
      console.log("Ex 15.85,after burn. OwnedNfts AFTER burn ",ownedNfts);
      const allNfts = await _contract.getAllNftsOnSale();
      console.log("Ex 15.85,after burn. All NFTS ON Sale",allNfts);
      const balanceOf = await _contract.balanceOf(accounts[2]);
      console.log("Ex 15.85,bef burn.",balanceOf.toNumber());

      const ownerOf = await _contract.ownerOf(3);
      console.log("Ex 15.86, after burn. Owner",ownerOf);

      assert.equal(ownedNfts.length, 0, "Invalid length of tokens");

    })
})
//end describe 5
so comment out for for Ex 16.86 */

//Ex 16.87 test listing nfts
//begin describe 6
describe("List an Nft", () => {
  before(async () => {
    await _contract.placeNftOnSale(
      1,
      _nftPrice, { from: accounts[1], value: _listingPrice}
    )
  })

  it("should have two listed items", async () => {
    const listedNfts = await _contract.getAllNftsOnSale();
    console.log("Ex 16.87, listed nfts",listedNfts);
    assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
  })

  it("should set new listing price", async () => {
   await _contract
      .setListingPrice(_listingPrice, {from: accounts[0]});
   const listingPrice = await _contract.listingPrice();

   //I added to see if the list of nfts 
   const listedNfts = await _contract.getAllNftsOnSale();
    console.log("Ex 16.87, listed nfts",listedNfts);


    assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
 })

})
//end describe 6


})