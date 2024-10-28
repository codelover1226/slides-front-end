import {
  SET_IS_AUTH,
  SET_TOKEN,
  LOGOUT,
  FETCH_USER_LOADING,
  FETCH_USER,
  SET_CHATBOT_VISIBILITY,
} from "./actionTypes";
import { LOG_OUT_USER, USER_PROFILE } from "helper/url_helper";
import { toast } from "react-toastify";
import { axiosAccount } from "services/api";
import { clear, get } from "services/cookies";
import { clearLocal } from "services/localStorage";

export const fetchUserProfile = payload => {
  return async dispatch => {
    try {
      dispatch(fetchUserLoading(true));
      const res = await axiosAccount.get(USER_PROFILE);
      if (res?.data?.data?.user) {
        dispatch(fetchUserSuccess(res.data?.data?.user));
        dispatch(fetchUserLoading(false));
      }
    } catch (error) {
      dispatch(fetchUserLoading(false));
      toast.error(error?.response?.data?.massage || "Something went's wrong");
    }
  };
};

export const logOutUser = () => {
  return async dispatch => {
    try {
      dispatch(fetchUserLoading(true));
      const token = get("token");
      await axiosAccount.post(LOG_OUT_USER, {
        token: token,
      });
      clear();
      clearLocal();
      dispatch(logout());
      dispatch(fetchUserLoading(false));
    } catch (err) {
      dispatch(fetchUserLoading(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };
};

export const handleIsAuth = data => ({
  type: SET_IS_AUTH,
  payload: data,
});

export const handleSetToken = data => ({
  type: SET_TOKEN,
  payload: data,
});

export const logout = () => ({
  type: LOGOUT,
});

export const fetchUserLoading = data => ({
  type: FETCH_USER_LOADING,
  payload: data,
});

export const fetchUserSuccess = data => ({
  type: FETCH_USER,
  payload: data,
});

export const setChatBoxVisibility = data => ({
  type: SET_CHATBOT_VISIBILITY,
  payload: data,
});
