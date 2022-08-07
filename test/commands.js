const instance = await NftMarket.deployed();
// from pinata for creature 1 json
   // https://gateway.pinata.cloud/ipfs/QmUiehqdSYhfcCqwwNebhtJCVD4PkoahdJ4KWJnLhadLNG

// URI, sales price, listing price, account
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmUiehqdSYhfcCqwwNebhtJCVD4PkoahdJ4KWJnLhadLNG","500000000000000000", {value: "25000000000000000",from: accounts[0]})

//fronm pinata for creature 2 json
  // https://gateway.pinata.cloud/ipfs/QmcqxBeE2XfagzEBYnaCUfHHTRLMiHi6xap6BDFLoNUfTN
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmcqxBeE2XfagzEBYnaCUfHHTRLMiHi6xap6BDFLoNUfTN","300000000000000000", {value: "25000000000000000",from: accounts[0]}) 


