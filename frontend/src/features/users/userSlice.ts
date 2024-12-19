import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./types";

const initialState: IUser = {
  id: 0,
  name: "",
  domainId: "",
  emailId: "",
  status: "InActive",
  locnId: 2,
  locnName: "",
  roles: "",
  rolesName: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createNewUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.domainId = action.payload.domainId;
      state.emailId = action.payload.emailId;
      state.status = action.payload.status;
      state.locnId = action.payload.locnId;
      state.locnName = action.payload.locnName;
      state.roles = action.payload.roles;
      state.rolesName = action.payload.rolesName;
    },
  },
});

export const { createNewUser } = userSlice.actions;

export default userSlice.reducer;
