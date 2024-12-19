import axios from "axios";
import { API_BASE_URL } from "@/features/common/constants";

import { getLocalUser, resetTimer, setLocalUserToken } from "./local-storage";
import { refreshToken } from "@/features/authentication/services/auth.service";
import { encryptData } from "./crypto";

const defaultOptions = {
  baseURL: API_BASE_URL,
};
const instance = axios.create(defaultOptions);

instance.interceptors.request.use((config) => {
  const currConfigData = config.data;
  // const encConfigData: any = {};
  if (currConfigData) {
    try {
      // Object.keys(currConfigData).forEach((key) => {
      //   const value = encryptData(currConfigData[key]);
      //   const encKey = encryptData(key);
      //   encConfigData[encKey] = value;
      // });
      // if (Object.keys(encConfigData).length > 0) {
      //   config.data = encConfigData;
      // }
      if (!currConfigData["refresh"] || currConfigData["refresh"] === "no") {
        const encKey = encryptData("encPayload");
        config.data = {};
        config.data[encKey] = encryptData(JSON.stringify(currConfigData));
        config.data["refresh"] = "no";
      } else {
        config.data = currConfigData;
      }
    } catch {
      config.data = currConfigData;
    }
  }
  resetTimer();
  const localUser = getLocalUser();
  const accesstoken =
    localUser && localUser.AUTH_TOKEN ? localUser.AUTH_TOKEN : "";

  config.headers!.Authorization = accesstoken ? `Bearer ${accesstoken}` : "";
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (
        error.response.data.errorMessage &&
        error.response.data.errorMessage === "Token Expired"
      ) {
        const loggedUser = getLocalUser();
        if (loggedUser && loggedUser.AUTH_TOKEN) {
          return refreshToken(loggedUser.AUTH_TOKEN).then(
            (success) => {
              setLocalUserToken(success.data.AUTH_TOKEN);
              error.config.data["refresh"] = "yes";
              return instance.request(error.config);
            },
            (err) => {
              return Promise.reject(err);
            },
          );
        }
      }

      localStorage.removeItem("user-inshe");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default instance;
