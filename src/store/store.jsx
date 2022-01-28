import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "../services/api";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware),
});

export const persistor = persistStore(store, null, () => {
  // if you want to get restoredState
  console.log("restoredState", store.getState());
});

export default store;
