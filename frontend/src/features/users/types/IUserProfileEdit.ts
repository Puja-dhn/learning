import IUserData from "./IUserData";

interface IUserProfileEdit extends IUserData {
  is_profile_edit: number;
  new_password: string;
}

export default IUserProfileEdit;
