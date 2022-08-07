import { useHooks } from "@providers/web3"

export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes
  }
}
//Ex 17.88 Use Listed Nfts
export const useNetwork = () => {
  const hooks = useHooks();
  const swrRes = hooks.useNetwork();

  return {
    network: swrRes
  }
}
export const useListedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useListedNfts();

  return {
    nfts: swrRes
  }
}

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts();

  return {
    nfts: swrRes
  }
}
