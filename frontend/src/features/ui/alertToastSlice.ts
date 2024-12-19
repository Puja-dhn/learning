import { createSlice } from "@reduxjs/toolkit";
import { IAlertProps } from "./types";

const initialState: IAlertProps = {
  status: false,
  severity: "info",
  message: "",
  autoClose: true,
  autoCloseTime: 4000,
};
const alertToastSlice = createSlice({
  name: "alerttoast",
  initialState,
  reducers: {
    showAlertToast: (state, action) => {
      state.status = true;
      state.severity = action.payload.severity;
      state.message = action.payload.message;
      state.autoClose = action.payload.autoClose;
      state.autoCloseTime = action.payload.autoCloseTime;
      if (action.payload.autoCloseTime) {
        state.autoCloseTime = action.payload.autoCloseTime;
      } else {
        state.autoCloseTime = 4000;
      }
    },
    hideAlertToast: (state) => {
      state.status = false;
    },
  },
});

export const { showAlertToast, hideAlertToast } = alertToastSlice.actions;

export default alertToastSlice.reducer;
