import axios from "axios";
import store from "store";
import { logout } from "store/actions";
import { clear, get, set } from "./cookies";
import { clearLocal } from "./localStorage";

const API_URL_ACCOUNT = process.env.REACT_APP_API_ACCOUNT_URL;
const API_URL_ADMIN = process.env.REACT_APP_API_ADMIN_URL;
const API_URL_SLIDR = process.env.REACT_APP_API_SLIDR_URL;
// const API_URL_SLIDR = "http://192.168.1.175:8080/api/v1/";

class Axios {
  constructor(baseURL) {
    this.axios = axios.create({
      baseURL,
    });

    this.axios.interceptors.request.use(this._requestMiddleware);

    this.axios.interceptors.response.use(
      this._responseMiddleware,
      this._responseErr
    );
  }

  _requestMiddleware = req => {
    // Send Bearer token on every request
    const token = get("token");
    if (!!token)
      req.headers.authorization = token.startsWith("Bearer ")
        ? token
        : "Bearer " + token;
    return req;
  };

  _responseMiddleware = response => {
    //  Do something on every success full response
    if (response?.data?.data?.token) {
      set("token", response.data.data.token);
    }
    return response;
  };

  _responseErr = error => {
    if (
      (error?.response?.data?.message).toString().toLowerCase() ===
      "Permission reverted"
    ) {
      window.location.replace("/");
    }
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      clear();
      clearLocal();
    }
    return Promise.reject(error);
  };
}

const axiosAccount = new Axios(API_URL_ACCOUNT).axios;
const axiosAdmin = new Axios(API_URL_ADMIN).axios;
const axiosSlidr = new Axios(API_URL_SLIDR).axios;

export { axiosAccount, axiosAdmin, axiosSlidr };
