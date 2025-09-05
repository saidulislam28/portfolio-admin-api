import { USER_SECRET_KEY } from "@/config/config";

const CryptoJS = require("crypto-js");

export const encryptData = (data) => {
    const userInfo = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        USER_SECRET_KEY
      ).toString();
   return userInfo;
}