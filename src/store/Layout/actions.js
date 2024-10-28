import { NINE_DOTS, SIDE_MENU } from "helper/url_helper";
import { toast } from "react-toastify";
import { axiosAdmin } from "services/api";
import {
  FETCH_APPLICATION,
  FETCH_APPLICATION_LOADING,
  FETCH_HEADER,
  FETCH_HEADER_LOADING,
} from "./actionTypes";

export const fetchApplications = () => {
  return async dispatch => {
    try {
      dispatch(fetchApplicationLoading(true));
      const res = await axiosAdmin.get(SIDE_MENU);
      if (res?.data?.data?.menu) {
        dispatch(fetchApplication(res?.data?.data?.menu));
        dispatch(fetchApplicationLoading(false));
      }
    } catch (error) {
      dispatch(fetchApplicationLoading(false));
      toast.error(error?.response?.data?.massage || "Something went's wrong");
    }
  };
};

export const fetchHeder = () => {
  return async dispatch => {
    try {
      dispatch(fetchHeaderLoading(true));
      const res = await axiosAdmin.get(NINE_DOTS);
      if (res?.data?.data) {
        dispatch(fetchHeader(res?.data?.data?.data));
        dispatch(fetchHeaderLoading(false));
      }
    } catch (error) {
      dispatch(fetchHeaderLoading(false));
      toast.error(error?.response?.data?.massage || "Something went's wrong");
    }
  };
};

export const fetchApplicationLoading = data => ({
  type: FETCH_APPLICATION_LOADING,
  payload: data,
});

export const fetchApplication = data => ({
  type: FETCH_APPLICATION,
  payload: data,
});

export const fetchHeaderLoading = data => ({
  type: FETCH_HEADER_LOADING,
  payload: data,
});

export const fetchHeader = data => ({
  type: FETCH_HEADER,
  payload: data,
});
