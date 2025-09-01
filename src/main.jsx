import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Landing from "./pages/Landing";
import Liked from "./pages/Liked";
import PropertyPage from "./pages/PropertyPage";
import PropertyOwnerDashboard from "./pages/PropertyOwnerDashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<App />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/owner" element={<PropertyOwnerDashboard />} />


          {/* 🔐 Owner dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOwner>
                <PropertyOwnerDashboard />
              </ProtectedRoute>
            }
          />
          {/* (Optional) alias route, remove if you don't want it */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute requireOwner>
                <PropertyOwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
