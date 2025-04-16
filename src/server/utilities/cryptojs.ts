import CryptoJS from "crypto-js"
import { encrypManagerI, hashPropI } from "./interfaces";
import { envConfig } from "../configs/env.config";


const encryptAES = (text: string): string => {
  return CryptoJS.AES.encrypt(text, envConfig.ENCRYPT_KEY).toString();
}

const decryptAES = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, envConfig.ENCRYPT_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
}

const encryptSHA256 = (text: string, salt?: string ): hashPropI => {
  const _salt = salt ?? CryptoJS.lib.WordArray.random(128 / 8).toString();
  
  return {
    hash: CryptoJS.SHA256(_salt + text).toString(),
    salt: _salt
  };
}

const checkSHA256 = (data: hashPropI, textToCompare: string): boolean => {
  const hashTextToCompare = encryptSHA256(textToCompare, data.salt)
  
  return data.hash === hashTextToCompare.hash
}

export const encryptManager: encrypManagerI = {
 decryptAES,
 encryptAES,
 encryptSHA256,
 checkSHA256,
}
