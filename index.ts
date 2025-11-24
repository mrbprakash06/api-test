import axios from "axios";
import { Buffer } from "buffer";
import "dotenv/config";
import { v4 as uuid } from "uuid";
import { sign } from "./crypto";

const url = process.env.NABIL_API_URL as string;
const username = process.env.NABIL_API_USERNAME as string;
const password = process.env.NABIL_API_PASSWORD as string;
const privateKey = process.env.NABIL_API_PRIVATE_KEY as string;

async function getForexRates() {
  try {
    const TimeStamp = new Date().toISOString().replace("Z", "");

    const requestModel = {
      TransactionId: uuid(),
    };

    const signatureModel = {
      Model: requestModel,
      TimeStamp,
    };

    const requestData = JSON.stringify(requestModel, null, 0);
    const signatureData = JSON.stringify(signatureModel, null, 0);

    const response = await axios.post(
      url,
      {
        FunctionName: "ForeignExchangeRate",
        Data: Buffer.from(requestData).toString("base64"),
        Signature: sign(signatureData, privateKey),
        TimeStamp,
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64"),
        },
        timeout: 5000,
      }
    );

    const data = response.data;

    console.log(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching forex rates");
  }
}

getForexRates();
