import {
  SET_LOADING,
  GET_SUBSCRIPTION_PRODUCT_LIST,
  GET_ACTIVE_SUBSCRIPTION_LIST,
} from "./actionTypes";

import produce from "immer";

const initialState = {
  loading: false,
  subscriptionProduct: [],
  activeSubscriptionsList: [],
};

const subscriptionReducer = produce((state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      state.loading = payload;
      break;
    case GET_SUBSCRIPTION_PRODUCT_LIST:
      state.subscriptionProduct = payload;
      break;
    case GET_ACTIVE_SUBSCRIPTION_LIST:
      state.activeSubscriptionsList = payload;
      break;
    default:
      return state;
  }
});

export default subscriptionReducer;
