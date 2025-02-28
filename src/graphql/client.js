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
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // If we get a 401 Unauthorized error, the token might be expired
    if (networkError.statusCode === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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
