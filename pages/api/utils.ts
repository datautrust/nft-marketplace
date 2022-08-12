import {ethers} from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession ,Session} from "next-iron-session";
import * as util from "ethereumjs-util"; //Ex 22.113 Verify Signature
import contract from "../../public/contracts/NftMarket.json";
import { NftMarketContract } from "@_types/nftMarketContract";

const NETWORKS = {
  "5777": "Ganache",
  "3" :"Ropsten"
}
type NETWORK = typeof NETWORKS;
const abi = contract.abi; //that abi describe our contract C:\iwemy-nft\nft-market\public\contracts\NftMarket.json

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

//note the address is the contract address in the NftMarket.json file
export const contractAddress = contract["networks"][targetNetwork]["address"];
//EX 23.114 upload to pinata 
export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    //password: "88888888888888",
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
} 

//make network dynamic to switch to ropsten network
const url = process.env.NODE_ENV ==="production" ?
   process.env.INFURA_ROPSTEN_URL : 
   "http://127.0.0.1:7545"

// Ex 22.11 Get Session back
export const addressCheckMiddleware = async (req: NextApiRequest & { session: Session}, res: NextApiResponse) => {
  return new Promise(async(resolve, reject) => {
    const message = req.session.get("message-session");
    //ganache server address and we get info from the Server vs client side
    const provider = new ethers.providers.JsonRpcProvider(url);
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider 
    )  as unknown as NftMarketContract;
/*ex 22.113 remove    const name = await contract.name(); //note we could add logic for blacklisted addresses, etc
    console.log("Ex 22.112, contact name ",name);
    console.log("Ex 22.111 Messge ",message);
  */
 //Ex 22.113 
 console.log("Ex 22.113 ",message);
  let nonce: string | Buffer = "\x19Ethereum Signed Message:\n" 
  + JSON.stringify(message).length 
  + JSON.stringify(message);
console.log("Ex 22.113 After nonce ",nonce);
nonce = util.keccak(Buffer.from(nonce, "utf-8"));
console.log("Ex 22.113 nonce After keccak ",nonce);
//ex 22.133 verify signature :
// our signature is in req.body.signature
const { v, r, s } = util.fromRpcSig(req.body.signature);
const pubKey = util.ecrecover(util.toBuffer(nonce), v,r,s);
const addrBuffer = util.pubToAddress(pubKey);
const address = util.bufferToHex(addrBuffer);
console.log("ex 22.133 our signed message ",address);
/* In Ex 22.113 removed this if with the new if to match address after
it has been signed: 
 if (message) {
      resolve("Correct Address");
   } else {
      reject("Wrong Address");
   }
*/
// Ex 22.113
if (address === req.body.address) {
  resolve("Correct Address");
   } else {
  reject("Wrong Address");
   }
  } )
} 