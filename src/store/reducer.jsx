import { combineReducers } from "@reduxjs/toolkit";
import { reducer as toastrReducer } from "react-redux-toastr";
import AuthReducer from "./slice/AuthSlice";
import { authApi } from "../services/api";
import RatesReducer from "./slice/CurrencySlice";
const rootReducer = combineReducers({
  //Shared Reducers
  toastr: toastrReducer,
  auth: AuthReducer,
  rates: RatesReducer,
  [authApi.reducerPath]: authApi.reducer,
});
export default rootReducer;
