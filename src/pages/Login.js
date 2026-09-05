import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: cleanEmail,
          password: password,
        }
      );

      if (!response.data) {
        setError("Invalid email address or password.");
        return;
      }

      const user = response.data;

      console.log("Logged in user:", user);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      const username =
        user.username ||
        user.name ||
        user.fullName ||
        cleanEmail.split("@")[0];

      localStorage.setItem(
        "username",
        username
      );

      localStorage.setItem(
        "userEmail",
        user.email || cleanEmail
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setError(
          "The email address or password you entered is incorrect."
        );
      } else if (!error.response) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}

      <section className="login-brand-panel">
        <div className="login-brand">

          <div className="login-logo">
            AI
          </div>

          <div>
            <h2>AI Interview</h2>
            <p>Preparation Platform</p>
          </div>

        </div>

        <div className="login-hero">

          <p className="login-eyebrow">
            INTERVIEW PREPARATION
          </p>

          <h1>
            Prepare with confidence.
            Perform with clarity.
          </h1>

          <p className="login-description">
            Practice technical interviews, complete
            AI-powered mock interviews, analyse your
            performance and improve your preparation
            from one platform.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-number">
                01
              </div>

              <div>
                <strong>
                  Technical Preparation
                </strong>

                <span>
                  Practice Java, Python, React and
                  coding interview questions.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-number">
                02
              </div>

              <div>
                <strong>
                  AI Mock Interviews
                </strong>

                <span>
                  Complete structured interviews and
                  receive intelligent feedback.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-number">
                03
              </div>

              <div>
                <strong>
                  Performance Insights
                </strong>

                <span>
                  Review results, analytics and
                  preparation progress.
                </span>
              </div>
            </div>

          </div>
        </div>

        <p className="login-brand-footer">
          AI Interview Preparation Platform
        </p>
      </section>

      {/* RIGHT PANEL */}

      <section className="login-form-panel">

        <div className="mobile-brand">
          <div className="login-logo">
            AI
          </div>

          <div>
            <strong>AI Interview</strong>
            <span>Preparation Platform</span>
          </div>
        </div>

        <div className="login-form-container">

          <div className="login-form-header">

            <p className="login-form-label">
              CANDIDATE PORTAL
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your interview
              preparation.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {error && (
              <div className="login-error">
                <div className="error-indicator">
                  !
                </div>

                <span>{error}</span>
              </div>
            )}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                autoComplete="email"
                disabled={loading}
              />

            </div>

            <div className="form-group">

              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <div className="password-field">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  tabIndex={-1}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div className="login-divider">
            <span>New to the platform?</span>
          </div>

          <button
            type="button"
            className="create-account-button"
            onClick={() =>
              navigate("/register")
            }
            disabled={loading}
          >
            Create an Account
          </button>

          <p className="login-security">
            Your account information is used only
            to manage your interview preparation
            profile and progress.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;