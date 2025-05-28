import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { client } from "./graphql/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { Error500 } from "./components/ErrorPages";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error500 />}>
      <ApolloProvider client={client}>
        <BrowserRouter basename="/Graphql">
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
