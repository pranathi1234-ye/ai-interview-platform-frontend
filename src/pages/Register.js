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

  const displayMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleRegister = async () => {
    setMessage("");

    // Check empty fields
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      displayMessage(
        "Please complete all required fields.",
        "error"
      );
      return;
    }

    // Validate email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      displayMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    // Validate password length
    if (password.length < 6) {
      displayMessage(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      displayMessage(
        "Passwords do not match.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password,
        }
      );

      console.log(
        "Registration response:",
        response.data
      );

      displayMessage(
        "Account created successfully. Redirecting to sign in...",
        "success"
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      if (error.response?.status === 409) {
        displayMessage(
          "An account already exists with this email address.",
          "error"
        );
      } else {
        displayMessage(
          "Unable to create your account. Please try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div style={styles.page}>

      {/* LEFT SIDE */}
      <section style={styles.leftPanel}>

        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandMark}>
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

        {/* Main left content */}
        <div style={styles.leftContent}>

          <p style={styles.leftLabel}>
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

          <div style={styles.featureList}>

            <Feature
              number="01"
              title="Technical Preparation"
              description="Practice Java, Python, React and coding interview questions."
            />

            <Feature
              number="02"
              title="AI Mock Interviews"
              description="Complete structured interviews and receive intelligent feedback."
            />

            <Feature
              number="03"
              title="Performance Insights"
              description="Review results, analytics and preparation progress."
            />

          </div>
        </div>

        <div style={styles.leftFooter}>
          AI Interview Preparation Platform
        </div>

        <div style={styles.circleDecoration} />

      </section>

      {/* RIGHT SIDE */}
      <section style={styles.rightPanel}>

        <div style={styles.formContainer}>

          <p style={styles.formLabel}>
            CANDIDATE PORTAL
          </p>

          <h2 style={styles.formTitle}>
            Create your account
          </h2>

          <p style={styles.formSubtitle}>
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

          {/* FULL NAME */}

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
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="name"
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
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}

          <div style={styles.field}>

            <label style={styles.label}>
              Password
            </label>

            <div style={styles.passwordContainer}>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                style={styles.passwordInput}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={styles.showButton}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            <p style={styles.passwordHint}>
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
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="new-password"
            />

          </div>

          {/* REGISTER */}

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            style={{
              ...styles.primaryButton,

              opacity:
                loading ? 0.65 : 1,

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* DIVIDER */}

          <div style={styles.divider}>

            <div style={styles.dividerLine} />

            <span style={styles.dividerText}>
              Already registered?
            </span>

            <div style={styles.dividerLine} />

          </div>

          {/* LOGIN */}

          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.secondaryButton}
          >
            Sign In
          </button>

          <p style={styles.privacyText}>
            Your account information is used only to
            manage your interview preparation profile
            and progress.
          </p>

        </div>

      </section>

    </div>
  );
}


/* ===========================
   FEATURE COMPONENT
=========================== */

function Feature({
  number,
  title,
  description,
}) {
  return (
    <div style={styles.feature}>

      <div style={styles.featureNumber}>
        {number}
      </div>

      <div>
        <div style={styles.featureTitle}>
          {title}
        </div>

        <div style={styles.featureDescription}>
          {description}
        </div>
      </div>

    </div>
  );
}


/* ===========================
   STYLES
=========================== */

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


  /* LEFT PANEL */

  leftPanel: {
    minHeight: "100vh",

    background:
      "linear-gradient(145deg,#0F1E45,#1E3A78)",

    color: "#FFFFFF",

    padding: "40px 55px",

    boxSizing: "border-box",

    position: "relative",

    overflow: "hidden",

    display: "flex",

    flexDirection: "column",
  },


  brand: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    position: "relative",

    zIndex: 2,
  },


  brandMark: {
    width: "44px",

    height: "44px",

    background: "#2563EB",

    borderRadius: "9px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "700",

    fontSize: "16px",

    letterSpacing: "0.5px",
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

    position: "relative",

    zIndex: 2,
  },


  leftLabel: {
    marginBottom: "22px",

    color: "#60A5FA",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "2px",
  },


  heroTitle: {
    margin: "0 0 25px",

    color: "#FFFFFF",

    fontSize: "48px",

    fontWeight: "700",

    lineHeight: "1.16",

    letterSpacing: "-1px",
  },


  heroDescription: {
    maxWidth: "570px",

    marginBottom: "32px",

    color: "#DBEAFE",

    fontSize: "14px",

    lineHeight: "1.8",
  },


  featureList: {
    display: "flex",

    flexDirection: "column",

    gap: "20px",
  },


  feature: {
    display: "flex",

    alignItems: "flex-start",

    gap: "16px",
  },


  featureNumber: {
    minWidth: "40px",

    height: "40px",

    border:
      "1px solid rgba(255,255,255,0.18)",

    borderRadius: "7px",

    background:
      "rgba(255,255,255,0.06)",

    color: "#93C5FD",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "10px",

    fontWeight: "700",
  },


  featureTitle: {
    marginBottom: "7px",

    fontSize: "13px",

    fontWeight: "650",
  },


  featureDescription: {
    color: "#BFDBFE",

    fontSize: "11px",

    lineHeight: "1.5",
  },


  leftFooter: {
    position: "relative",

    zIndex: 2,

    color: "#647FAF",

    fontSize: "10px",
  },


  circleDecoration: {
    position: "absolute",

    width: "370px",

    height: "370px",

    right: "-180px",

    bottom: "-150px",

    borderRadius: "50%",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },


  /* RIGHT PANEL */

  rightPanel: {
    minHeight: "100vh",

    background: "#F8FAFC",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

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


  formTitle: {
    margin: "0 0 8px",

    color: "#0F172A",

    fontSize: "32px",

    fontWeight: "700",
  },


  formSubtitle: {
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

    border: "1px solid #CBD5E1",

    borderRadius: "7px",

    outline: "none",

    background: "#FFFFFF",

    color: "#0F172A",

    fontSize: "14px",
  },


  passwordContainer: {
    width: "100%",

    height: "48px",

    display: "flex",

    alignItems: "center",

    overflow: "hidden",

    border: "1px solid #CBD5E1",

    borderRadius: "7px",

    background: "#FFFFFF",

    boxSizing: "border-box",
  },


  passwordInput: {
    flex: 1,

    height: "100%",

    minWidth: 0,

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


  passwordHint: {
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

    fontSize: "13px",

    fontWeight: "650",
  },


  secondaryButton: {
    width: "100%",

    height: "48px",

    border: "1px solid #CBD5E1",

    borderRadius: "7px",

    background: "#FFFFFF",

    color: "#0F172A",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "650",
  },


  /* DIVIDER */

  divider: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    margin: "25px 0",
  },


  dividerLine: {
    flex: 1,

    height: "1px",

    background: "#E2E8F0",
  },


  dividerText: {
    color: "#94A3B8",

    fontSize: "11px",

    whiteSpace: "nowrap",
  },


  /* MESSAGES */

  message: {
    marginBottom: "20px",

    padding: "12px 14px",

    borderRadius: "7px",

    fontSize: "12px",

    lineHeight: "1.5",
  },


  successMessage: {
    background: "#F0FDF4",

    border: "1px solid #BBF7D0",

    color: "#15803D",
  },


  errorMessage: {
    background: "#FEF2F2",

    border: "1px solid #FECACA",

    color: "#B91C1C",
  },


  privacyText: {
    maxWidth: "350px",

    margin: "28px auto 0",

    textAlign: "center",

    color: "#94A3B8",

    fontSize: "10px",

    lineHeight: "1.6",
  },
};


export default Register;