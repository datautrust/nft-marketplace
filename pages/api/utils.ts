import {ethers} from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession ,Session} from "next-iron-session";
//import * as util from "ethereumjs-util";
import contract from "../../public/contracts/NftMarket.json";
import { NftMarketContract } from "@_types/nftMarketContract";

const NETWORKS = {
  "5777": "Ganache"
}
type NETWORK = typeof NETWORKS;
const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

//note the address is the contract address in the NftMarket.json file
export const contractAddress = contract["networks"][targetNetwork]["address"];

export function withSession(handler: any) {
  return withIronSession(handler, {
  //  password: process.env.SECRET_COOKIE_PASSWORD as string,
    password: "88888888888888",
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
} 