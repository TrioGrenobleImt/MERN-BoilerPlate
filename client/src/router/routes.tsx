import { Routes, Route } from "react-router-dom";
import { LayoutWrapper } from "./layoutWrapper";
import Login from "@/pages/Authentication/login";
import Register from "@/pages/Authentication/register";
import Account from "@/pages/Account";
import { ProtectedRoute } from "@/router/protectedRoute";
import { Home } from "@/pages/Home";
import { Index } from "@/pages/Admin";
import { Logs } from "@/pages/Admin/components/logs";
import { Users } from "@/pages/Admin/components/users";
import { Dashboard } from "@/pages/Admin/components/dashboard";

export const Router = () => {
  return (
    <Routes>
      <Route element={<LayoutWrapper withLayout={false} />}>
        <Route
          path="/login"
          element={
            <ProtectedRoute authRequired={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute authRequired={false}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute authRequired={true} role="admin">
              <Index />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Route>

      <Route element={<LayoutWrapper withLayout={true} />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute authRequired={true}>
              <Account />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};
