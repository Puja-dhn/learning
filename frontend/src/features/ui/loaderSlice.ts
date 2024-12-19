import { createSlice } from "@reduxjs/toolkit";
import { ILoaderProps } from "./types";

const initialState: ILoaderProps = {
  status: false,
};
const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.status = true;
    },
    hideLoader: (state) => {
      state.status = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
