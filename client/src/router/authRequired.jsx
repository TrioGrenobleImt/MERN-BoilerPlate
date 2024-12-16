import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export const ProtectedRoute = ({ authRequired, children }) => {
  const { authUser } = useAuthContext();

  if (authRequired && !authUser) {
    return <Navigate to="/login" />;
  }

  if (!authRequired && authUser) {
    return <Navigate to="/" />;
  }

  return children;
};
