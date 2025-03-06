import { Routes, Route } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Account from "../pages/Account/Account";
import { ProtectedRoute } from "./authRequired";
import { Dashboard } from "../pages/Dashboard/components/Dashboard";
import { Home } from "../pages/Home/Home";
import { Users } from "@/pages/Dashboard/components/Users";
import { Logs } from "@/pages/Dashboard/components/logs/page";
import { Index } from "@/pages/Dashboard/Index";
import { NavbarDashboard } from "@/components/NavBar/NavbarDashboard";

export const Router = () => {
  return (
    <Routes>
      {/* Routes publiques */}
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

      {/* Routes privées */}
      <Route
        path="/account"
        element={
          <ProtectedRoute authRequired={true}>
            <Account />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute authRequired={true} role="admin">
            <NavbarDashboard />
            <Index />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="logs" element={<Logs />} />
      </Route>

      {/* Routes accessibles à tous */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
