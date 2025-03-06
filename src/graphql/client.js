import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Create an HTTP link to the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Handle specific GraphQL errors
      if (extensions && extensions.code) {
        switch (extensions.code) {
          case "FORBIDDEN":
          case "BAD_USER_INPUT":
            window.location.href = "/error/400";
            break;
          case "NOT_FOUND":
            window.location.href = "/error/404";
            break;
          case "INTERNAL_SERVER_ERROR":
            window.location.href = "/error/500";
            break;
          default:
            // For other GraphQL errors, we can log them but don't need to redirect
            break;
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle different network error status codes
    if (networkError.statusCode) {
      switch (networkError.statusCode) {
        case 400:
          window.location.href = "/error/400";
          break;
        case 401:
          // If we get a 401 Unauthorized error, the token might be expired
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 404:
          window.location.href = "/error/404";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          window.location.href = "/error/500";
          break;
        default:
          // For other network errors, redirect to a generic error page
          window.location.href = "/error/500";
          break;
      }
    } else {
      // If there's no status code (e.g., network is down), redirect to 500 error
      window.location.href = "/error/500";
    }
  }
});

// Add authentication to the request headers
const authLink = setContext((_, { headers }) => {
  // Get the JWT token from localStorage
  const token = localStorage.getItem("token");

  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});
