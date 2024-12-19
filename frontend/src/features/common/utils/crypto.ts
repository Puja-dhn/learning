import CryptoJS from "crypto-js";
import { CRYPTO_KEY } from "@/features/common/constants";

export const encryptData = (data: any) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CRYPTO_KEY,
  ).toString();
  const hmac = CryptoJS.HmacSHA256(
    encrypted,
    CryptoJS.SHA256(CRYPTO_KEY),
  ).toString();
  return hmac + encrypted;
};
// CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTO_KEY).toString();

export const decryptData = (ciphertext: string) => {
  try {
    const transithmac = ciphertext.substring(0, 64);
    const transitencrypted = ciphertext.substring(64);
    const decryptedhmac = CryptoJS.HmacSHA256(
      transitencrypted,
      CryptoJS.SHA256(CRYPTO_KEY),
    ).toString();
    if (transithmac !== decryptedhmac) {
      throw new Error("Tempared Data");
    }
    const decrypted = CryptoJS.AES.decrypt(
      transitencrypted,
      CRYPTO_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
};

// export const decryptData = (ciphertext: string) => {
//   const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
//   try {
//     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   } catch (err) {
//     return null;
//   }
// };
