import { USER_SECRET_KEY } from "@/config/config";

var CryptoJS = require("crypto-js");

export const retrieveUser = () => {
  try {
    const setedUserInfo = localStorage.getItem("userInfo");
    const decryptUserInfo = CryptoJS.AES.decrypt(setedUserInfo, USER_SECRET_KEY);
    var decryptUserInfox = decryptUserInfo.toString(CryptoJS.enc.Utf8);
    const userInfo = JSON.parse(decryptUserInfox)
    if (userInfo) {
      return userInfo;
    }
  } catch (e) {
    return {};
  }
};


export const clearLocalStorage = () => {
  try {
    localStorage.removeItem("userInfo")
  } catch (e) {
    return null;
  }
};



