import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import thunk from "redux-thunk";

import globalReducer from "@/features/common/globalSlice";
import userReducer from "@/features/users/userSlice";
import authReducer from "@/features/authentication/authSlice";
import siteThemeReducer from "@/features/theme/siteThemeSlice";
import alertToastReducer from "@/features/ui/alertToastSlice";
import accessReducer from "@/features/authorization/accessSlice";
import loaderReducer from "@/features/ui/loaderSlice";
import layoutReducer from "@/features/layout/layoutSlice";
import menuReducer from "@/features/authorization/menuSlice";

const reducers = combineReducers({
  user: userReducer,
  global: globalReducer,
  auth: authReducer,
  theme: siteThemeReducer,
  alert: alertToastReducer,
  loader: loaderReducer,
  access: accessReducer,
  layout: layoutReducer,
  menu: menuReducer,
});

const persistConfig = {
  key: "root-inshe",
  storage,
  whitelist: ["global", "auth", "theme", "access", "menu"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
