import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("Unable to load user:", error);
  }

  const username =
    localStorage.getItem("username") ||
    user.name ||
    user.username ||
    user.fullName ||
    "Candidate";

  // ============================================================
  // INTERVIEW WORKSPACE FEATURES
  // ============================================================

  const features = [
    {
      title: "Java Interview",
      description:
        "Practice Java concepts and technical interview questions.",
      code: "JA",
      path: "/java",
    },

    {
      title: "Python Interview",
      description:
        "Prepare for Python programming and technical interviews.",
      code: "PY",
      path: "/python",
    },

    {
      title: "React Interview",
      description:
        "Strengthen React concepts and frontend interview skills.",
      code: "RE",
      path: "/react",
    },

    {
      title: "Voice Interview",
      description:
        "Practise answering interview questions using voice.",
      code: "VI",
      path: "/voice-interview",
    },

    {
      title: "AI Mock Interview",
      description:
        "Complete a structured interview and receive results.",
      code: "AI",
      path: "/mock-interview",
    },

    {
      title: "Analytics",
      description:
        "Review interview performance and progress insights.",
      code: "AN",
      path: "/analytics",
    },

    {
      title: "Resume Upload",
      description:
        "Upload your resume for interview preparation.",
      code: "RU",
      path: "/resume-upload",
    },

    {
      title: "Resume Questions",
      description:
        "Practise interview questions generated from your resume.",
      code: "RQ",
      path: "/resume-questions",
    },

    {
      title: "Coding Practice",
      description:
        "Improve problem-solving skills with coding exercises.",
      code: "CP",
      path: "/coding",
    },

    {
      title: "AI Feedback",
      description:
        "Review detailed feedback from your mock interview.",
      code: "FB",
      path: "/feedback",
    },

    {
      title: "HR Chatbot",
      description:
        "Practise common HR and behavioural interview questions.",
      code: "HR",
      path: "/hr-chatbot",
    },

    {
      title: "Resume AI Analyzer",
      description:
        "Analyse your resume and identify areas for improvement.",
      code: "RA",
      path: "/resume-analyzer",
    },

    {
      title: "Certificate",
      description:
        "View and download your interview programme certificate.",
      code: "CE",
      path: "/certificate",
    },
  ];

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="dashboard">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-mark">
            AI
          </div>

          <div>
            <h2>AI Interview</h2>
            <p>Preparation Platform</p>
          </div>

        </div>

        <div className="sidebar-divider" />

        <p className="menu-label">
          NAVIGATION
        </p>

        <nav className="sidebar-menu">

          {/* Dashboard */}

          <button
            type="button"
            className="menu-item active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="menu-code">
              DB
            </span>

            <span>
              Dashboard
            </span>
          </button>


          {/* Leaderboard */}

          <button
            type="button"
            className="menu-item"
            onClick={() =>
              navigate("/leaderboard")
            }
          >
            <span className="menu-code">
              LB
            </span>

            <span>
              Leaderboard
            </span>
          </button>


          {/* Profile */}

          <button
            type="button"
            className="menu-item"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span className="menu-code">
              PR
            </span>

            <span>
              Profile
            </span>
          </button>


          {/* About */}

          <button
            type="button"
            className="menu-item"
            onClick={() =>
              navigate("/about")
            }
          >
            <span className="menu-code">
              AB
            </span>

            <span>
              About Project
            </span>
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-details">

              <strong>
                {username}
              </strong>

              <span>
                Candidate
              </span>

            </div>

          </div>


          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <p className="page-label">
              OVERVIEW
            </p>

            <h1>
              Dashboard
            </h1>

          </div>


          <button
            type="button"
            className="primary-action"
            onClick={() =>
              navigate("/mock-interview")
            }
          >
            Start Mock Interview
          </button>

        </header>


        {/* ====================================================
            WELCOME CARD
        ==================================================== */}

        <section className="welcome-card">

          <div className="welcome-content">

            <p className="welcome-label">
              AI INTERVIEW PREPARATION
            </p>

            <h2>
              Welcome back, {username}
            </h2>

            <p>
              Continue your interview preparation,
              practise technical skills and review
              your performance from one place.
            </p>

            <button
              type="button"
              className="welcome-button"
              onClick={() =>
                navigate("/mock-interview")
              }
            >
              Begin Interview
            </button>

          </div>


          <div className="welcome-decoration">

            <div className="decoration-circle">
              AI
            </div>

          </div>

        </section>


        {/* ====================================================
            INTERVIEW WORKSPACE
        ==================================================== */}

        <section className="section">

          <div className="section-header">

            <div>

              <p className="section-label">
                PREPARATION TOOLS
              </p>

              <h2>
                Interview Workspace
              </h2>

            </div>

          </div>


          {/* FEATURE CARDS */}

          <div className="features-grid">

            {features.map((item) => (

              <button
                type="button"
                key={item.title}
                className="feature-card"
                onClick={() =>
                  navigate(item.path)
                }
              >

                <div className="feature-top">

                  <div className="feature-icon">
                    {item.code}
                  </div>

                  <span className="feature-arrow">
                    →
                  </span>

                </div>


                <h3>
                  {item.title}
                </h3>


                <p>
                  {item.description}
                </p>


                <span className="feature-link">
                  Open Module
                </span>

              </button>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;