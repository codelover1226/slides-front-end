import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import queryString from "query-string";
import "react-toastify/dist/ReactToastify.css";
import { get, set } from "services/cookies";
import {
  fetchUserProfile,
  handleIsAuth,
  handleSetToken,
  setChatBoxVisibility,
  subscriptionStatus,
} from "store/actions";
import "./assets/scss/style.scss";
import Routes from "./routes";
import "react-loading-skeleton/dist/skeleton.css";
import { useLocation } from "react-router-dom";
import { LiveChatWidget } from "@livechat/widget-react";

const App = () => {
  const dispatch = useDispatch();
  const path = useLocation();
  const { isAuth, chatBoxVisibility } = useSelector(state => state.Auth);

  useLayoutEffect(() => {
    const data = queryString.parse(path.search);
    if (!!path?.search && data?.userToken) {
      let token = path.search
        .split("?userToken=")[1]
        .split("&temp_category_id=")[0];
      set("token", token);
    }
  }, [path?.search]);

  useEffect(() => {
    if (isAuth) {
      dispatch(subscriptionStatus(6));
    }
  }, [isAuth, dispatch]);

  const isCommonRoute = useMemo(() => {
    return !(
      path?.pathname.includes("/slide-show-preview/") ||
      path?.pathname.includes("/slide-show/")
    );
  }, [path?.pathname]);

  useEffect(() => {
    if (isCommonRoute) {
      const token = get("token");
      if (!token && isAuth === false) {
        window.location.replace(
          // `${process.env.REACT_APP_ACCOUNT_SITE_URL}/login?app_id=${process.env.REACT_APP_SITE_ID}&redirect=${process.env.REACT_APP_SLIDR_REDIRECT_SITE_URL}`
          `${process.env.REACT_APP_ACCOUNT_SITE_URL}login?app_id=2&redirect=${process.env.REACT_APP_SLIDR_REDIRECT_SITE_URL}`
        );
      } else {
        dispatch(handleIsAuth(true));
        dispatch(handleSetToken(token));
        dispatch(fetchUserProfile());
      }
    }
  }, [dispatch, isAuth, isCommonRoute]);

  const handleVisibilityChanged = ({ visibility }) => {
    dispatch(setChatBoxVisibility(visibility));
  };
  return (
    <>
      <ToastContainer autoClose={5000} />
      <Routes />
      {isCommonRoute ? (
        <LiveChatWidget
          onVisibilityChanged={handleVisibilityChanged}
          visibility={chatBoxVisibility}
          license="8932034"
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
