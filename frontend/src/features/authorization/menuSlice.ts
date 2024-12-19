import { createSlice } from "@reduxjs/toolkit";
import { MASTER_MENU_LIST } from "./menu-list";
import { IMenuItem } from "./types";

const initialState: IMenuItem = {
  ...MASTER_MENU_LIST[0],
};
const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelMenu: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.icon = action.payload.icon;
      state.iconSelected = action.payload.iconSelected;
      state.appId = action.payload.appId;
      state.path = action.payload.path;
      state.element = action.payload.element;
      state.children = action.payload.children;
    },
    resetSelMenu: () => {
      return initialState;
    },
  },
});

export const { setSelMenu, resetSelMenu } = menuSlice.actions;

export default menuSlice.reducer;
