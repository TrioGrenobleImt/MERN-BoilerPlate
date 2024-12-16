import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Account from "../pages/Account/Account";
import { ProtectedRoute } from "./authRequired";
import { Dashboard } from "../pages/Dashboard/Dashboard";

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
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Routes accessibles à tous */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
