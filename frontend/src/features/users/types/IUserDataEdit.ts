import IUserData from "./IUserData";

interface IUserDataEdit extends IUserData {
  is_profile_edit: number;
  is_password_reset: number;
  new_password: string;
}

export default IUserDataEdit;
