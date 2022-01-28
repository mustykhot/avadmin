import { combineReducers } from "@reduxjs/toolkit";
import { reducer as toastrReducer } from "react-redux-toastr";
import AuthReducer from "./slice/AuthSlice";
import { authApi } from "../services/api";
const rootReducer = combineReducers({
  //Shared Reducers
  toastr: toastrReducer,
  auth: AuthReducer,
  [authApi.reducerPath]: authApi.reducer,
});
export default rootReducer;
