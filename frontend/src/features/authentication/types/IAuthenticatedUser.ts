interface IAuthenticatedUser {
  ID: number;
  NAME: string;
  EMAIL_ID: string;
  ROLES: number[];
  AUTH_TOKEN: string;
  PHOTO_PATH: string;
  DEPARTMENT: string;
  LOGGED_IN: number;
  LOCATION: number;
}

export default IAuthenticatedUser;
