import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
  background-color: #f8f9fa;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  margin: 0;
  color: #343a40;
  font-weight: bold;
`;

const ErrorTitle = styled.h2`
  font-size: 32px;
  margin: 10px 0 20px;
  color: #495057;
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color: #6c757d;
  max-width: 600px;
`;

const BackButton = styled(Link)`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0069d9;
  }
`;

export const Error404 = () => (
  <ErrorContainer>
    <ErrorCode>404</ErrorCode>
    <ErrorTitle>Page Not Found</ErrorTitle>
    <ErrorMessage>
      The page you are looking for might have been removed, had its name
      changed, or is temporarily unavailable.
    </ErrorMessage>
    <BackButton to="/">Back to Home</BackButton>
  </ErrorContainer>
);

export const Error400 = () => (
  <ErrorContainer>
    <ErrorCode>400</ErrorCode>
    <ErrorTitle>Bad Request</ErrorTitle>
    <ErrorMessage>
      The server could not understand the request due to invalid syntax or
      missing parameters.
    </ErrorMessage>
    <BackButton to="/">Back to Home</BackButton>
  </ErrorContainer>
);

export const Error500 = () => (
  <ErrorContainer>
    <ErrorCode>500</ErrorCode>
    <ErrorTitle>Internal Server Error</ErrorTitle>
    <ErrorMessage>
      Something went wrong on our end. We're working to fix the issue. Please
      try again later.
    </ErrorMessage>
    <BackButton to="/">Back to Home</BackButton>
  </ErrorContainer>
);

export const GenericError = ({ statusCode, title, message }) => (
  <ErrorContainer>
    <ErrorCode>{statusCode || "!"}</ErrorCode>
    <ErrorTitle>{title || "An Error Occurred"}</ErrorTitle>
    <ErrorMessage>
      {message || "Something went wrong. Please try again later."}
    </ErrorMessage>
    <BackButton to="/">Back to Home</BackButton>
  </ErrorContainer>
);
