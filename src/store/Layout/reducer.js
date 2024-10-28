import {
  FETCH_APPLICATION_LOADING,
  FETCH_APPLICATION,
  FETCH_HEADER_LOADING,
  FETCH_HEADER,
  SERIES_DATA,
} from "./actionTypes";

import produce from "immer";

const initialState = {
  applicationLoading: false,
  applications: null,
  headerLoading: false,
  headerMenu: null,
  series: null,
};

const authReducer = produce((state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_APPLICATION_LOADING:
      return {
        ...state,
        applicationLoading: payload,
      };
    case FETCH_APPLICATION:
      return {
        ...state,
        applications: payload,
      };
    case FETCH_HEADER_LOADING:
      return {
        ...state,
        headerLoading: payload,
      };
    case FETCH_HEADER:
      return {
        ...state,
        headerMenu: payload,
      };
    case SERIES_DATA:
      return {
        ...state,
        series: payload,
      };
    default:
      return state;
  }
});

export default authReducer;
