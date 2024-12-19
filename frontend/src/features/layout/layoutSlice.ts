import { createSlice } from "@reduxjs/toolkit";
import { ILayoutProps } from "./types";

const initialState: ILayoutProps = {
  sidebarStatus: false,
  appStatus: false,
  settingStatus: false,
  optionsMenuStatus: false,
};
const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setLayout: (state, action) => {
      state.sidebarStatus = action.payload.sidebarStatus;
      state.appStatus = action.payload.appStatus;
      state.settingStatus = action.payload.settingStatus;
      state.optionsMenuStatus = action.payload.optionsMenuStatus;
    },
    resetLayout: () => {
      return initialState;
    },
  },
});

export const { setLayout, resetLayout } = layoutSlice.actions;

export default layoutSlice.reducer;
