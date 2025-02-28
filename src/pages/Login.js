import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../utils/AuthContext";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #0d1117;
  color: #c9d1d9;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
`;

const LoginCard = styled.div`
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 380px;
`;

const Title = styled.h1`
  color: #f0f6fc;
  margin-bottom: 32px;
  text-align: center;
  font-size: 28px;
  font-weight: 400;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #c9d1d9;
  font-size: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 14px;
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 15px;
  line-height: 22px;
  height: 38px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #58a6ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
  }
`;

const Button = styled.button`
  background-color: #238636;
  color: white;
  border: 1px solid rgba(240, 246, 252, 0.1);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  height: 40px;
  margin-top: 24px;

  &:hover {
    background-color: #2ea043;
  }

  &:disabled {
    background-color: #238636;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f85149;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  white-space: pre-wrap;
  background-color: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.4);
  border-radius: 6px;
  padding: 10px;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Determine if the identifier is an email or username
    const isEmail = formData.identifier.includes("@");

    // Prepare credentials in the format expected by the login function
    const credentials = {
      username: isEmail ? "" : formData.identifier,
      email: isEmail ? formData.identifier : "",
      password: formData.password,
    };

    try {
      const result = await login(credentials, isEmail);

      if (result.success) {
        navigate("/profile");
      } else {
        // Format the error message for better readability
        let errorMessage = result.message;

        // Handle JSON error messages
        if (typeof errorMessage === "string") {
          if (errorMessage.includes('{"error":')) {
            try {
              const parsedError = JSON.parse(errorMessage);
              errorMessage = parsedError.error || errorMessage;
            } catch (e) {
              // If parsing fails, use the original message
            }
          }

          // Handle specific error messages
          if (
            errorMessage.includes("User does not exist or password incorrect")
          ) {
            errorMessage = "Incorrect username or password.";
          }
        }

        setError(errorMessage);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Sign in to GraphQL</Title>
      <LoginCard>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="identifier">Username or email address</Label>
            <Input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
