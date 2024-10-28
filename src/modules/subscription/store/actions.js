import { axiosAccount } from "services/api";
import {
  SET_LOADING,
  GET_SUBSCRIPTION_PRODUCT_LIST,
  GET_ACTIVE_SUBSCRIPTION_LIST,
} from "./actionTypes";
import {
  GET_SUBSCRIPTION_URL,
  GET_ACTIVE_SUBSCRIPTION_URL,
} from "helper/url_helper";
import { toast } from "react-toastify";

// get Subscription product list
export const getSubscriptionProductList = data => {
  return async dispatch => {
    try {
      dispatch(setLoadingSubscription(true));
      const res = await axiosAccount.post(GET_SUBSCRIPTION_URL, data);
      if (res?.data?.data) {
        dispatch(getSubscriptionList(res.data.data.product_data));
      }
      dispatch(setLoadingSubscription(false));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch(setLoadingSubscription(false));
    }
  };
};

// get Subscription product list
export const getActiveSubscriptionsBySite = ({ site_id }) => {
  return async dispatch => {
    try {
      dispatch(setLoadingSubscription(true));
      const res = await axiosAccount.get(
        `${GET_ACTIVE_SUBSCRIPTION_URL}/${site_id}`
      );
      if (res?.data?.data) {
        dispatch(getActiveSubscriptionList(res.data.data.rows));
      }
      dispatch(setLoadingSubscription(false));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch(setLoadingSubscription(false));
    }
  };
};

export const setLoadingSubscription = data => ({
  type: SET_LOADING,
  payload: data,
});

export const getSubscriptionList = data => {
  return {
    type: GET_SUBSCRIPTION_PRODUCT_LIST,
    payload: data,
  };
};

export const getActiveSubscriptionList = data => {
  return {
    type: GET_ACTIVE_SUBSCRIPTION_LIST,
    payload: data,
  };
};
