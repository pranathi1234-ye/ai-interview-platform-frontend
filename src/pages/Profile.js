import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  // ============================================================
  // GET USER INFORMATION
  // ============================================================

  let storedUser = {};

  try {
    storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("Unable to load user:", error);
  }

  const username =
    storedUser.name ||
    storedUser.username ||
    localStorage.getItem("username") ||
    "Candidate";

  const email =
    storedUser.email ||
    localStorage.getItem("userEmail") ||
    "Not available";

  // ============================================================
  // USER INITIAL
  // ============================================================

  const getInitial = () => {
    return username
      ? username.charAt(0).toUpperCase()
      : "C";
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ============================================================
  // PROFILE PAGE
  // ============================================================

  return (
    <div className="profile-page">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="profile-sidebar">

        {/* BRAND */}

        <div className="profile-sidebar-top">

          <div className="profile-brand">

            <div className="profile-brand-mark">
              AI
            </div>

            <div>
              <h2>AI Interview</h2>
              <p>Preparation Platform</p>
            </div>

          </div>


          <div className="profile-divider" />


          {/* NAVIGATION */}

          <p className="profile-menu-label">
            NAVIGATION
          </p>

          <nav className="profile-menu">

            {/* Dashboard */}

            <button
              type="button"
              className="profile-menu-item"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <span className="profile-menu-code">
                DB
              </span>

              <span>
                Dashboard
              </span>
            </button>


            {/* Leaderboard */}

            <button
              type="button"
              className="profile-menu-item"
              onClick={() =>
                navigate("/leaderboard")
              }
            >
              <span className="profile-menu-code">
                LB
              </span>

              <span>
                Leaderboard
              </span>
            </button>


            {/* Profile */}

            <button
              type="button"
              className="profile-menu-item active"
            >
              <span className="profile-menu-code">
                PR
              </span>

              <span>
                Profile
              </span>
            </button>


            {/* About */}

            <button
              type="button"
              className="profile-menu-item"
              onClick={() =>
                navigate("/about")
              }
            >
              <span className="profile-menu-code">
                AB
              </span>

              <span>
                About Project
              </span>
            </button>

          </nav>

        </div>


        {/* SIDEBAR USER */}

        <div className="profile-sidebar-bottom">

          <div className="profile-sidebar-user">

            <div className="profile-small-avatar">
              {getInitial()}
            </div>

            <div className="profile-user-details">

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
            className="profile-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="profile-main">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <header className="profile-topbar">

          <div>

            <p className="profile-page-label">
              ACCOUNT
            </p>

            <h1>
              My Profile
            </h1>

            <p className="profile-page-description">
              Manage and view your account information.
            </p>

          </div>


          <button
            type="button"
            className="profile-primary-button"
            onClick={() =>
              navigate("/mock-interview")
            }
          >
            Start Mock Interview
          </button>

        </header>


        {/* ====================================================
            PROFILE CARD
        ==================================================== */}

        <section className="profile-hero">

          {/* AVATAR */}

          <div className="profile-avatar">
            {getInitial()}
          </div>


          {/* USER DETAILS */}

          <div className="profile-identity">

            <p className="profile-candidate-label">
              CANDIDATE PROFILE
            </p>

            <h2>
              {username}
            </h2>

            <p className="profile-email">
              {email}
            </p>

            <div className="profile-tags">

              <span>
                Candidate
              </span>

              <span>
                Interview Preparation
              </span>

            </div>

          </div>


          {/* ACCOUNT STATUS */}

          <div className="profile-account-status">

            <span>
              ACCOUNT STATUS
            </span>

            <strong>
              Active
            </strong>

          </div>

        </section>


        {/* ====================================================
            ACCOUNT DETAILS
        ==================================================== */}

        <section className="profile-details-section">

          <div className="profile-section-heading">

            <p className="profile-section-label">
              ACCOUNT
            </p>

            <h2>
              Account Details
            </h2>

            <p>
              Your basic account information.
            </p>

          </div>


          <div className="profile-details-grid">

            {/* NAME */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                NM
              </div>

              <div className="profile-detail-content">

                <span>
                  Full Name
                </span>

                <strong>
                  {username}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                @
              </div>

              <div className="profile-detail-content">

                <span>
                  Email Address
                </span>

                <strong>
                  {email}
                </strong>

              </div>

            </div>


            {/* ROLE */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                RL
              </div>

              <div className="profile-detail-content">

                <span>
                  Account Type
                </span>

                <strong>
                  Candidate
                </strong>

              </div>

            </div>


            {/* STATUS */}

            <div className="profile-detail-card">

              <div className="profile-detail-icon">
                ✓
              </div>

              <div className="profile-detail-content">

                <span>
                  Account Status
                </span>

                <strong className="profile-active-text">
                  Active
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            INTERVIEW CTA
        ==================================================== */}

        <section className="profile-interview-card">

          <div>

            <p>
              READY TO PRACTICE?
            </p>

            <h2>
              Continue your interview preparation
            </h2>

            <span>
              Start an AI-powered mock interview and
              improve your interview skills.
            </span>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/mock-interview")
            }
          >
            Start Interview →
          </button>

        </section>

      </main>

    </div>
  );
}

export default Profile;