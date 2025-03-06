import React, { Component } from "react";
import { GenericError } from "./ErrorPages";

/**
 * ErrorBoundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // You could also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <GenericError
          statusCode="500"
          title="Something went wrong"
          message={
            error?.message || "An unexpected error occurred in this component"
          }
        />
      );
    }

    return children;
  }
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {React.ReactNode} fallback - Optional custom fallback UI
 * @returns {React.Component} - The wrapped component
 */
export const withErrorBoundary = (WrappedComponent, fallback = null) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithErrorBoundary = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;

  return WithErrorBoundary;
};

export default ErrorBoundary;
