/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { BaseLayout, NftList } from '@ui';
//import nfts from "../content/meta.json";
//Ex 20.99 import { Nft } from '@_types/nft';
//import { useWeb3 } from '@providers/web3';
//ex 20.99 import { useListedNfts } from '@hooks/web3';
//ex 20.99 import { prependOnceListener } from 'process';
//ex 20.99 import React from 'react';
//added below to see if i can fix the <BaseLayout> issue but no help

/*ex 20.99   interface Props {
    children: React.ReactNode;
  }
*/


const Home: NextPage = () => {
 // ex 17.88 removed  const {provider, contract} = useWeb3();
//ex 20.99  const {nfts} = useListedNfts();
 //console.log("Ex 17.88 NFTs ",nfts.data);
 //console.log("Ex 18.94 NFTs ",nfts.data);
  //console.log("providerxxx "+ provider);
  //console.log(contract);
  
/* sect 7.32 remove all this code now

  const getNftInfo = async () => {
    console.log(await contract!.name());
    console.log(await contract!.symbol());
  }

  if (contract) {
    getNftInfo();
  }



  const getAccounts = async () => {
    const accounts = await provider!.listAccounts();
    console.log(accounts[0]);
  }
  if (provider) {
    getAccounts();
  }
*/
  

  return (
    <BaseLayout>
  
  <div> NFT Marketplace in progress </div>
    
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Amazing Creatures NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
            <NftList />
                        
        </div>
      </div>
      
    </BaseLayout>
  )
}

export default Home