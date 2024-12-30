import { IAuthenticatedUser } from "@/features/authentication/types";
import { decryptData, encryptData } from "./crypto";

function getLocalUser() {
  const user = localStorage.getItem("user-inshe");
  let arrUser: IAuthenticatedUser = {
    ID: 0,
    NAME: "",
    EMAIL_ID: "",
    ROLES: [],
    AUTH_TOKEN: "",
    PHOTO_PATH: "",
    DEPARTMENT: "",
    LOGGED_IN: 0,
    LOCATION: 0,
  };
  if (user) {
    try {
      const decryptedData = decryptData(user);
      if (decryptedData) {
        arrUser = { ...decryptedData };
      }
    } catch (error) {
      arrUser = {
        ID: 0,
        NAME: "",
        EMAIL_ID: "",
        ROLES: [],
        AUTH_TOKEN: "",
        PHOTO_PATH: "",
        DEPARTMENT: "",
        LOGGED_IN: 0,
        LOCATION: 0,
      };
    }
  }

  return arrUser;
}

function getLoggedIn() {
  const loggedin = localStorage.getItem("loggedin-inshe");
  let isLoggedIn = "No";
  if (loggedin && loggedin === "Yes") {
    isLoggedIn = "Yes";
  }

  return isLoggedIn;
}

function getCurrentTimer() {
  const timer = localStorage.getItem("timer-inshe");
  let timeCounter = 200;
  if (timer) {
    try {
      const decryptTimer = decryptData(timer);
      timeCounter = parseInt(decryptTimer, 10);
      if (Number.isNaN(timeCounter)) {
        timeCounter = 0;
      }
    } catch (err) {
      timeCounter = 0;
    }
  }

  return timeCounter;
}

function tickTimer() {
  const timer = localStorage.getItem("timer-inshe");
  let timeCounter = 200;
  if (timer) {
    try {
      const decryptTimer = decryptData(timer);
      timeCounter = parseInt(decryptTimer, 10);
      if (Number.isNaN(timeCounter)) {
        timeCounter = 0;
      }
      timeCounter -= 1;
    } catch (err) {
      timeCounter = 0;
    }
  }
  localStorage.setItem("timer-inshe", encryptData(timeCounter.toString()));
}

function resetTimer() {
  localStorage.setItem("timer-inshe", encryptData("200"));
}

function setLocalUser(user: IAuthenticatedUser) {
  localStorage.setItem("user-inshe", encryptData(user));
  localStorage.setItem("loggedin-inshe", "Yes");
  localStorage.removeItem("reloadcounter-inshe");
}

function setLocalUserToken(token: string) {
  const user = getLocalUser();
  user.AUTH_TOKEN = token;
  setLocalUser(user);
}

export {
  getLocalUser,
  getCurrentTimer,
  tickTimer,
  resetTimer,
  setLocalUser,
  setLocalUserToken,
  getLoggedIn,
};
