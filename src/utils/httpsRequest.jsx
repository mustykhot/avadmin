/* eslint-disable no-restricted-globals */
import axios from "axios";
import { toastr } from "react-redux-toastr";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

//Axios interecpter
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toastr.error("Session Expired!");
        localStorage.clear();

        if (
          window.location.pathname === "/buyer/login" ||
          window.location.pathname === "/supplier/login"
        ) {
          // setTimeout(() => {
          //   location.reload();
          // }, 2000);
        } else {
          setTimeout(() => {
            window.location = "/";
          }, 2000);
        }
      }
      if (error.response.status === 403) {
        toastr.error("Unauthorized!");
      }
      return Promise.reject(error);
    } else {
      toastr.error("No Network Connection!");
    }
  }
);

export default API;
