//ex 23.119
import { v4 as uuidv4 } from "uuid";
//Ex 23.117 to create image upload endpoint
import { FileReq } from "@_types/nft";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { addressCheckMiddleware, withSession } from "./utils";
// ex 23.119
import {pinataApiKey, pinataSecretApiKey} from "./utils";
import FormData from "form-data";
import axios from "axios";

export default withSession(async (
  req: NextApiRequest & {session: Session}, 
  res: NextApiResponse
) => {
  if (req.method === "POST") {
 //specify this data in the types files nft-market\types\nft.ts
    const {
      bytes,
      fileName,
      contentType
    } = req.body as FileReq;

    if (!bytes || !fileName || !contentType) {
      return res.status(422).send({message: "Image data are missing"});
    }

    await addressCheckMiddleware(req, res);
//Ex 23.119 upload image. here we construct a buffer

    console.log(fileName);
    console.log(contentType);
    //console.log(bytes);   had to remove this as it was too large on command display
    
    const buffer = Buffer.from(Object.values(bytes));
    const formData = new FormData();

    formData.append(
      "file",
      buffer, {
        contentType,
        filename: fileName + "-" + uuidv4()
      }
    );

    const fileRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey
      }
    });

    return res.status(200).send(fileRes.data);
  } else {
    return res.status(422).send({message: "Invalid endpoint"});
  }
})
