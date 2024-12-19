import { createSlice } from "@reduxjs/toolkit";
import { IGlobalConfig } from "@/features/common/types";
import {
  DEFAULT_VALUE_LOCATION,
  DEFAULT_VALUE_DIVISION,
  DEFAULT_VALUE_AREA,
} from "./constants";

const initialState: IGlobalConfig = {
  loginType: "Domain",
  appMode: "Normal",
  locationId: -1,
  divisionId: -1,
  areaId: -1,
  teamId: -2,
  currArea: { ...DEFAULT_VALUE_AREA },
  currDivision: { ...DEFAULT_VALUE_DIVISION },
  currLocation: { ...DEFAULT_VALUE_LOCATION },
  lastSelection: {
    mode: "auto",
    locationId: -1,
    divisionId: -1,
    areaId: -1,
  },
  roleTypes: [],
};
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoginType: (state, action) => {
      state.loginType = action.payload;
    },
    setHirarchy: (state, action) => {
      state.locationId = action.payload.locationId;
      state.divisionId = action.payload.divisionId;
      state.areaId = action.payload.areaId;
      state.teamId = action.payload.teamId;
      state.currArea = action.payload.currArea;
      state.currDivision = action.payload.currDivision;
      state.currLocation = action.payload.currLocation;
      state.roleTypes = action.payload.roleTypes;
    },

    setAppMode: (state, action) => {
      state.appMode = action.payload;
    },
    setLastSelection: (state, action) => {
      state.lastSelection.mode = action.payload.mode;
      state.lastSelection.locationId = action.payload.locationId;
      state.lastSelection.divisionId = action.payload.divisionId;
      state.lastSelection.areaId = action.payload.areaId;
    },
  },
});

export const { setLoginType, setHirarchy, setAppMode, setLastSelection } =
  globalSlice.actions;

export default globalSlice.reducer;
