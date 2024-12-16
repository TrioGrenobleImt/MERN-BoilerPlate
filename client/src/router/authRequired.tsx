import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export const ProtectedRoute = ({ authRequired, role, children }: { authRequired: boolean; role?: String; children: ReactNode }) => {
  const { authUser } = useAuthContext();

  if (authUser && role && authUser.role !== role) {
    return <Navigate to="/" />;
  }

  if (authRequired && !authUser) {
    return <Navigate to="/login" />;
  }

  if (!authRequired && authUser) {
    return <Navigate to="/" />;
  }

  return children;
};
