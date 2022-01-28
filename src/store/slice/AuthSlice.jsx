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
        fname: payload.firstName,
        lname: payload.lastName,
        isAdmin: payload.isAdmin,
        phone: payload.phone,
        role: payload.role,
        email: payload.email,
        id: payload._id,
      };
    },
    setUserToken: (state, { payload }) => {
      state.userToken = payload.token;
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
  window.location = "/login";
};

// selector to select user details from the store
export const selectCurrentUser = (state) => state.auth.user;

export default reducer;
