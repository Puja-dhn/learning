import IUserData from "./IUserData";

interface IUserProfileEdit extends IUserData {
  IS_RFID_RESET: number;
  IS_PASSWORD_RESET: number;
  MOBILE: string;
  IS_PROFILE_EDIT: number;
}

export default IUserProfileEdit;
