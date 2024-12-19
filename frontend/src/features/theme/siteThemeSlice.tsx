import { createSlice } from "@reduxjs/toolkit";
import { ISiteTheme } from "./types";

const initialState: ISiteTheme = { isDarkMode: false };
const siteThemeSlice = createSlice({
  name: "sitetheme",
  initialState,
  reducers: {
    setSiteTheme: (state, action) => {
      state.isDarkMode = action.payload.isDarkMode;
    },
  },
});

export const { setSiteTheme } = siteThemeSlice.actions;

export default siteThemeSlice.reducer;
