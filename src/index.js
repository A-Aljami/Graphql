import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { client } from "./graphql/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { Error500 } from "./components/ErrorPages";

const root = createRoot(document.getElementById("root"));

// Get the base URL based on the environment
const getBasename = () => {
  if (process.env.NODE_ENV === "development") {
    return "";
  }
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes("github.io")) {
    return "/Graphql";
  }
  return "";
};

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error500 />}>
      <ApolloProvider client={client}>
        <BrowserRouter basename={getBasename()}>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
