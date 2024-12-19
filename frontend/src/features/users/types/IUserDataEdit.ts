import IUserData from "./IUserData";

interface IUserDataEdit extends IUserData {
  IS_RFID_RESET: number;
  IS_PASSWORD_RESET: number;
  NEW_PASSWORD: string;
  IS_PROFILE_EDIT: number;
}

export default IUserDataEdit;
