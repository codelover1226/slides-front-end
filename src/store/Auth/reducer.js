import {
  SET_IS_AUTH,
  SET_TOKEN,
  LOGOUT,
  FETCH_USER_LOADING,
  FETCH_USER,
  SET_CHATBOT_VISIBILITY,
} from "./actionTypes";

import produce from "immer";

const initialState = {
  isAuth: false,
  token: null,
  fetchUserLoading: false,
  user: null,
  chatBoxVisibility: "minimized",
};

const authReducer = produce((state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_IS_AUTH:
      return {
        ...state,
        isAuth: payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: payload,
      };
    case LOGOUT:
      return {
        ...state,
        isAuth: false,
        token: null,
        user: null,
      };
    case FETCH_USER_LOADING:
      return {
        ...state,
        fetchUserLoading: payload,
      };
    case FETCH_USER:
      return {
        ...state,
        user: payload,
      };
    case SET_CHATBOT_VISIBILITY:
      return { ...state, chatBoxVisibility: payload };
    default:
      return state;
  }
});

export default authReducer;
