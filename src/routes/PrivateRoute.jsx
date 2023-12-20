// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/useAuth";

const PrivateRoute = ({ element: Element, redirectTo = "/login", ...rest }) => {
  const auth = useAuth();

  return auth.user ? (
    <Route {...rest} element={<Element />} />
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default PrivateRoute;
