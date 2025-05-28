import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuditDemo from "./pages/AuditDemo";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import { Error400, Error500 } from "./components/ErrorPages";
import NotFound from "./components/ErrorPages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Main app routes component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/profile" replace /> : <Login />
        }
      />

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-demo"
        element={
          <ProtectedRoute>
            <AuditDemo />
          </ProtectedRoute>
        }
      />

      {/* Home route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Error routes */}
      <Route path="/error/400" element={<Error400 />} />
      <Route path="/error/500" element={<Error500 />} />

      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <AppContainer>
        <AppRoutes />
      </AppContainer>
    </AuthProvider>
  );
};

export default App;
