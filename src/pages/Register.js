import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");

    // Check empty fields
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessageType("error");
      setMessage("Please complete all required fields.");
      return;
    }

    // Check email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setMessageType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://ai-interview-platform-backend-production.up.railway.app/api/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password,
        }
      );

      console.log("Registration response:", response.data);

      setMessageType("success");
      setMessage(
        "Account created successfully! Redirecting to sign in..."
      );

      // Clear fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Go to login
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.status === 409) {
        setMessageType("error");
        setMessage(
          "An account already exists with this email address."
        );
      } else if (!error.response) {
        setMessageType("error");
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setMessageType("error");
        setMessage(
          "Unable to create your account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* LEFT PANEL */}
      <section style={styles.leftPanel}>

        <div style={styles.brand}>

          <div style={styles.logo}>
            AI
          </div>

          <div>
            <div style={styles.brandName}>
              AI Interview
            </div>

            <div style={styles.brandSubtitle}>
              Preparation Platform
            </div>
          </div>

        </div>

        <div style={styles.leftContent}>

          <p style={styles.eyebrow}>
            INTERVIEW PREPARATION
          </p>

          <h1 style={styles.heroTitle}>
            Build your skills.
            <br />
            Prepare with purpose.
            <br />
            Perform with confidence.
          </h1>

          <p style={styles.heroDescription}>
            Create your candidate account to access
            technical interview preparation, AI-powered
            mock interviews, performance analytics and
            personalised feedback.
          </p>

          <div style={styles.features}>

            <Feature
              number="01"
              title="Technical Preparation"
              text="Practice Java, Python, React and coding interview questions."
            />

            <Feature
              number="02"
              title="AI Mock Interviews"
              text="Complete structured interviews and receive intelligent feedback."
            />

            <Feature
              number="03"
              title="Performance Insights"
              text="Review results, analytics and preparation progress."
            />

          </div>

        </div>

        <div style={styles.footer}>
          AI Interview Preparation Platform
        </div>

      </section>


      {/* RIGHT PANEL */}
      <section style={styles.rightPanel}>

        <div style={styles.formContainer}>

          <p style={styles.formLabel}>
            CANDIDATE PORTAL
          </p>

          <h2 style={styles.title}>
            Create your account
          </h2>

          <p style={styles.subtitle}>
            Register to start your interview preparation.
          </p>


          {/* MESSAGE */}
          {message && (
            <div
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.successMessage
                  : styles.errorMessage),
              }}
            >
              {message}
            </div>
          )}


          <form onSubmit={handleRegister}>

            {/* NAME */}
            <div style={styles.field}>

              <label style={styles.label}>
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                style={styles.input}
                autoComplete="name"
                disabled={loading}
              />

            </div>


            {/* EMAIL */}
            <div style={styles.field}>

              <label style={styles.label}>
                Email address
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                style={styles.input}
                autoComplete="email"
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}
            <div style={styles.field}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.passwordBox}>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  style={styles.passwordInput}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  style={styles.showButton}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <p style={styles.hint}>
                Minimum 6 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}
            <div style={styles.field}>

              <label style={styles.label}>
                Confirm password
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                style={styles.input}
                autoComplete="new-password"
                disabled={loading}
              />

            </div>


            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* DIVIDER */}
          <div style={styles.divider}>

            <div style={styles.line} />

            <span style={styles.dividerText}>
              Already registered?
            </span>

            <div style={styles.line} />

          </div>


          {/* SIGN IN */}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.secondaryButton}
            disabled={loading}
          >
            Sign In
          </button>


          <p style={styles.privacy}>
            Your account information is used only to
            manage your interview preparation profile
            and progress.
          </p>

        </div>

      </section>

    </div>
  );
}


/* FEATURE COMPONENT */

function Feature({ number, title, text }) {
  return (
    <div style={styles.feature}>

      <div style={styles.featureNumber}>
        {number}
      </div>

      <div>

        <div style={styles.featureTitle}>
          {title}
        </div>

        <div style={styles.featureText}>
          {text}
        </div>

      </div>

    </div>
  );
}


/* STYLES */

const styles = {

  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    background: "#F8FAFC",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  /* LEFT */

  leftPanel: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #0F1E45, #1E3A78)",
    color: "#FFFFFF",
    padding: "40px 55px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "9px",
    background: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
  },

  brandName: {
    fontSize: "17px",
    fontWeight: "700",
  },

  brandSubtitle: {
    marginTop: "3px",
    color: "#BFDBFE",
    fontSize: "10px",
  },

  leftContent: {
    margin: "auto 0",
    maxWidth: "590px",
  },

  eyebrow: {
    marginBottom: "20px",
    color: "#60A5FA",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  heroTitle: {
    margin: "0 0 25px",
    fontSize: "46px",
    lineHeight: "1.16",
    fontWeight: "700",
    letterSpacing: "-1px",
  },

  heroDescription: {
    maxWidth: "560px",
    marginBottom: "32px",
    color: "#DBEAFE",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  feature: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },

  featureNumber: {
    minWidth: "40px",
    height: "40px",
    borderRadius: "7px",
    background:
      "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#93C5FD",
    fontSize: "10px",
    fontWeight: "700",
  },

  featureTitle: {
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "650",
  },

  featureText: {
    color: "#BFDBFE",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  footer: {
    color: "#647FAF",
    fontSize: "10px",
  },


  /* RIGHT */

  rightPanel: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
  },

  formContainer: {
    width: "100%",
    maxWidth: "430px",
  },

  formLabel: {
    marginBottom: "12px",
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.8px",
  },

  title: {
    margin: "0 0 8px",
    color: "#0F172A",
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    marginBottom: "28px",
    color: "#64748B",
    fontSize: "14px",
  },


  /* FORM */

  field: {
    marginBottom: "17px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#0F172A",
    fontSize: "12px",
    fontWeight: "650",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    boxSizing: "border-box",
    border:
      "1px solid #CBD5E1",
    borderRadius: "7px",
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: "14px",
  },

  passwordBox: {
    width: "100%",
    height: "48px",
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #CBD5E1",
    borderRadius: "7px",
    background: "#FFFFFF",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  passwordInput: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    padding: "0 14px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0F172A",
    fontSize: "14px",
  },

  showButton: {
    height: "100%",
    padding: "0 16px",
    border: "none",
    background: "transparent",
    color: "#2563EB",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "650",
  },

  hint: {
    margin: "6px 0 0",
    color: "#94A3B8",
    fontSize: "10px",
  },


  /* BUTTONS */

  primaryButton: {
    width: "100%",
    height: "48px",
    marginTop: "5px",
    border: "none",
    borderRadius: "7px",
    background: "#2563EB",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
  },

  secondaryButton: {
    width: "100%",
    height: "48px",
    border:
      "1px solid #CBD5E1",
    borderRadius: "7px",
    background: "#FFFFFF",
    color: "#0F172A",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
  },


  /* MESSAGE */

  message: {
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "7px",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  successMessage: {
    background: "#F0FDF4",
    border:
      "1px solid #BBF7D0",
    color: "#15803D",
  },

  errorMessage: {
    background: "#FEF2F2",
    border:
      "1px solid #FECACA",
    color: "#B91C1C",
  },


  /* DIVIDER */

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "25px 0",
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#E2E8F0",
  },

  dividerText: {
    color: "#94A3B8",
    fontSize: "11px",
    whiteSpace: "nowrap",
  },


  /* PRIVACY */

  privacy: {
    maxWidth: "350px",
    margin: "28px auto 0",
    textAlign: "center",
    color: "#94A3B8",
    fontSize: "10px",
    lineHeight: "1.6",
  },
};

export default Register;