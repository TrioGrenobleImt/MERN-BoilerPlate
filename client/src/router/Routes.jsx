import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Account from "../pages/Account/Account";
import { ProtectedRoute } from "./authRequired";

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

      {/* Routes accessibles à tous */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
