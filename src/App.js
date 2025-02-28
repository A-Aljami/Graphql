import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuditDemo from "./pages/AuditDemo";
import { AuthProvider, useAuth } from "./utils/AuthContext";

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

const App = () => {
  return (
    <AuthProvider>
      <AppContainer>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/audit-demo" element={<AuditDemo />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContainer>
    </AuthProvider>
  );
};

export default App;
