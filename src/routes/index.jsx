import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Routes as ReactRouterDomRoutes } from "react-router-dom";
import routesConfig from "./routes.config";
import Loader from "../components/Loader";
import Layout from "../layout";

const Common = route => (
  <Suspense fallback={<Loader />}>
    <route.component />
  </Suspense>
);

const Public = route => {
  const { component: Component } = route;

  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

const Private = route => {
  const { component: Component } = route;

  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

const createNestedRoutes = (routes, RouteType) => {
  return routes.map((route, i) => {
    if (!route.component) {
      throw new Error("Component must be required....");
    }
    if (route.children) {
      return (
        <Route path={route.path} key={i} element={<RouteType {...route} />}>
          {createNestedRoutes(route.children, RouteType)}
        </Route>
      );
    } else {
      return (
        <Route
          key={i}
          index={route.index}
          path={route.path}
          element={<RouteType {...route} />}
        />
      );
    }
  });
};

const Routes = () => {
  const { isAuth } = useSelector(state => state.Auth);
  const { common, private: privateRoutes, public: publicRoutes } = routesConfig;

  return (
    <ReactRouterDomRoutes>
      {createNestedRoutes(common, Common)}
      {isAuth ? (
        <Route path="/" element={<Layout />}>
          {createNestedRoutes(privateRoutes, Private)}
        </Route>
      ) : (
        createNestedRoutes(publicRoutes, Public)
      )}
    </ReactRouterDomRoutes>
  );
};

export default Routes;
