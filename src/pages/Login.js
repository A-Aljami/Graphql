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
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-size: 28px;
`;

const Subtitle = styled.h2`
  color: #666;
  margin-bottom: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: normal;
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
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #2575fc;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #2575fc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #1a65e0;
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  white-space: pre-wrap;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: 5px;
  font-style: italic;
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
            errorMessage =
              "Invalid username/email or password. Please check your credentials and try again.";
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
      <LoginCard>
        <Title>Reboot01 Profile</Title>
        <Subtitle>Sign in to view your learning progress</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="identifier">Username or Email</Label>
            <Input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="Enter your username or email"
            />
            <InfoText>
              Use your Reboot01 learning platform credentials to log in. You can
              use either your username or email address.
            </InfoText>
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
              placeholder="Enter your password"
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
