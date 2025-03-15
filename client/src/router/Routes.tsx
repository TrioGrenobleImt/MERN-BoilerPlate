import { Routes, Route } from "react-router-dom";
import { LayoutWrapper } from "./LayoutWrapper";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Account from "@/pages/Account/Account";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { Home } from "@/pages/Home/Home";
import { Index } from "@/pages/Admin/Index";
import { Logs } from "@/pages/Admin/sideBar/components/logs/page";
import { Users } from "@/pages/Admin/sideBar/components/users/page";
import { Dashboard } from "@/pages/Admin/sideBar/components/Dashboard";

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
