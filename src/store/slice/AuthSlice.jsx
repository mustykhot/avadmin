import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userToken: "",
  errorMessage: "",
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails: (state, { payload }) => {
      console.log(payload, "loll");
      state.user = {
        fname: payload.data.firstName,
        lname: payload.data.lastName,
        isAdmin: payload.data.isAdmin,
        phone: payload.data.mobile,
        location: payload.data.location,
        email: payload.data.email,
        id: payload.data._id,
      };
    },
    setUserToken: (state, { payload }) => {
      state.userToken = payload._meta.token;
    },
    loggingOut: (state) => {
      state.userToken = "";
      state.user = null;
    },
  },
});

const { actions, reducer } = authSlice;
export const { setUserDetails, loggingOut, setUserToken } = actions;

export const logout = () => (dispatch) => {
  dispatch(loggingOut());
  window.localStorage.clear();
  window.location = "/";
};

// selector to select user details from the store
export const selectCurrentUser = (state) => state.auth.user;

export default reducer;
