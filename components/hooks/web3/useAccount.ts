
import { CryptoHookFactory } from "@_types/hooks";
import { useEffect } from "react";
import useSWR from "swr";

type UseAccountResponse = {
   connect: () => void;
   isLoading : boolean;
   isInstalled : boolean;
}


type AccountHookFactory = CryptoHookFactory<string,UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;
// deps -> provider, ethereum, contract (web3State)
export const hookFactory : AccountHookFactory = ({provider,ethereum,isLoading}) => () => {
   const {data,mutate,isValidating, ...swr} =   useSWR(
      provider ? "web3/useAccount" : null,
      async () => {
         console.log("Revalidating xxxxx provider "+provider);
        
        // making request to get data
        // return "Test User"
        // the ? means it may undefined. the ! means u are sure it is defined.
        const accounts = await provider!.listAccounts();
       
        const account = accounts[0];
        if (!account) {
         throw "Account Not Connected to web3 wallet. Cannot retrieve Account."
        }
        return account;
    },{
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
   )

   useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      }
    })
  
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error("Please, connect to Web3 wallet");
      } else if (accounts[0] !== data) {
        console.log(args);
        alert("accounts has changed");
        console.log(accounts[0]);
        mutate(accounts[0]);
      }
    }

    const connect = async () => {
      try {
         ethereum?.request({method: "eth_requestAccounts"});
       } catch(e) {
         console.error(e);
       }
    };
//debugger;
   return {
      ...swr,
      data,
      isValidating,
      isLoading : isLoading as boolean,
      isInstalled: ethereum?.isMetaMask || false,
       mutate,
      connect
   };

}
