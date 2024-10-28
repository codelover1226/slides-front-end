import React, { useEffect } from "react";

const Fallback = () => {
  useEffect(() => {
    const listener = () => window.location.reload();
    window.addEventListener("popstate", listener);
    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, []);

  return (
    <>
      <div className="error-wrapper">
        <div className="wrap">
          <div className="container-wrapper">
            <div className="moon"></div>
            <div className="cloud">
              <div className="blush"></div>
              <div className="eye-l"></div>
              <div className="eye-r"></div>
              <div className="mouth"></div>
            </div>
            <div className="star star-1"></div>
            <div className="star star-2"></div>
            <div className="star star-3"></div>
            <div className="star star-4"></div>
            <div className="star star-5"></div>
            <div className="star star-6"></div>
          </div>
          <div className="c1">
            <p className="went_wrong_text">
              OOOPS! Something went wrong here...
            </p>
            <div className="d-flex flex-column flex-nowrap align-items-center m-0">
              <p className="text">
                Sorry we're having some technical issue.Try to refresh the page!
              </p>

              <button
                className={"refresh_btn"}
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    const payload = {
      error_message: error.message,
      description:
        "File Name: \n" +
        error?.fileName +
        "\n\n" +
        "Component Stack: \n" +
        info?.componentStack +
        "\n\n" +
        "Stack: \n" +
        error.stack,
    };
    console.log("ErrorBoundary payload:", payload);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback />;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
