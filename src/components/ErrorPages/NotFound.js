import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: ${(props) => (props.darkMode ? "#1a1a1a" : "#f5f5f5")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const RedirectMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.darkMode ? "#999" : "#666")};
`;

const NotFound = ({ darkMode = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <NotFoundContainer darkMode={darkMode}>
      <Title>404</Title>
      <Message>Page Not Found</Message>
      <RedirectMessage darkMode={darkMode}>
        Redirecting you to {localStorage.getItem("token") ? "home" : "login"}{" "}
        page...
      </RedirectMessage>
    </NotFoundContainer>
  );
};

export default NotFound;
