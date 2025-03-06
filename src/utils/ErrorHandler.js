/**
 * Utility functions for handling errors in the application
 */

/**
 * Handle API errors and redirect to appropriate error pages
 * @param {Error} error - The error object
 * @param {boolean} redirect - Whether to redirect to error pages (default: true)
 * @returns {Object} - Error information
 */
export const handleApiError = (error, redirect = true) => {
  console.error("API Error:", error);

  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";

  // Extract status code from error if available
  if (error.response) {
    statusCode = error.response.status;
    errorMessage = error.response.data?.message || errorMessage;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
  } else if (error.message && error.message.includes("404")) {
    statusCode = 404;
  } else if (error.message && error.message.includes("400")) {
    statusCode = 400;
  }

  // Redirect to appropriate error page if redirect is true
  if (redirect) {
    switch (statusCode) {
      case 400:
        window.location.href = "/error/400";
        break;
      case 401:
        // For auth errors, clear token and redirect to login
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
        // For other errors, redirect to 500 page
        window.location.href = "/error/500";
        break;
    }
  }

  return {
    statusCode,
    message: errorMessage,
  };
};

/**
 * Check if a response is successful
 * @param {Object} response - The response object
 * @returns {boolean} - Whether the response is successful
 */
export const isSuccessfulResponse = (response) => {
  return response && response.status >= 200 && response.status < 300;
};

/**
 * Format error message for display
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";

  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message;
  }

  if (error.networkError) {
    return "Network error: Please check your connection";
  }

  return error.message || "An unexpected error occurred";
};
