import { createSlice } from "@reduxjs/toolkit";
import { IAuthenticatedUser } from "./types";

const initialState: IAuthenticatedUser = {
  ID: 0,
  NAME: "",
  EMAIL_ID: "",
  ROLES: [],
  LOCATION: 0,
  AUTH_TOKEN: "",
  PHOTO_PATH: "",
  DEPARTMENT: "",
  LOGGED_IN: 0,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.ID = action.payload.ID;
      state.NAME = action.payload.NAME;
      state.EMAIL_ID = action.payload.EMAIL_ID;
      state.ROLES = action.payload.ROLES;
      state.AUTH_TOKEN = action.payload.AUTH_TOKEN;
      state.PHOTO_PATH = action.payload.PHOTO_PATH;
      state.DEPARTMENT = action.payload.DEPARTMENT;
      state.LOGGED_IN = action.payload.LOGGED_IN;
    },
    setAuthToken: (state, action) => {
      state.AUTH_TOKEN = action.payload;
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setLoggedUser, setAuthToken, resetAuth } = authSlice.actions;

export default authSlice.reducer;
