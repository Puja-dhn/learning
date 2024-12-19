import { createSlice } from "@reduxjs/toolkit";
import IAppAccess from "./types/IAppAccess";

const initialState: IAppAccess = {
  menus: [],
  apps: [],
  adminAreas: [],
  appId: 1,
};
const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAppAccess: (state, action) => {
      state.menus = action.payload.menus;
      state.apps = action.payload.apps;
      state.adminAreas = action.payload.adminAreas;
      state.appId = action.payload.appId;
    },
    setApp: (state, action) => {
      state.appId = action.payload.appId;
    },
    resetAppAccess: () => {
      return initialState;
    },
  },
});

export const { setAppAccess, setApp, resetAppAccess } = accessSlice.actions;

export default accessSlice.reducer;
