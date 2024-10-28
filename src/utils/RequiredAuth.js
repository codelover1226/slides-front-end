import React from "react";
import { Outlet } from "react-router-dom";

const RequiredAuth = () => {
  return <Outlet />;
};

export default RequiredAuth;
