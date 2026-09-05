import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  // ============================================================
  // USER INFORMATION
  // ============================================================

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("Unable to load user:", error);
  }

  const username =
    user.name ||
    user.username ||
    localStorage.getItem("username") ||
    "Candidate";

  const firstLetter = username
    .charAt(0)
    .toUpperCase();

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ============================================================
  // TECHNOLOGY
  // ============================================================

  const technologies = [
    {
      code: "RE",
      title: "React",
      description:
        "Frontend application and user interface"
    },
    {
      code: "SB",
      title: "Spring Boot",
      description:
        "Backend application and REST services"
    },
    {
      code: "MY",
      title: "MySQL",
      description:
        "User and interview data storage"
    },
    {
      code: "AI",
      title: "Gemini AI",
      description:
        "AI-powered interview questions and feedback"
    }
  ];

  return (
    <div className="about-page">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="about-sidebar">

        {/* BRAND */}

        <div className="about-brand">

          <div className="about-brand-mark">
            AI
          </div>

          <div>
            <h2>AI Interview</h2>
            <p>Preparation Platform</p>
          </div>

        </div>


        <div className="about-divider" />


        {/* NAVIGATION */}

        <p className="about-menu-label">
          NAVIGATION
        </p>

        <nav className="about-menu">

          {/* Dashboard */}

          <button
            type="button"
            className="about-menu-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>DB</span>
            Dashboard
          </button>


          {/* Leaderboard */}

          <button
            type="button"
            className="about-menu-item"
            onClick={() =>
              navigate("/leaderboard")
            }
          >
            <span>LB</span>
            Leaderboard
          </button>


          {/* Profile */}

          <button
            type="button"
            className="about-menu-item"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span>PR</span>
            Profile
          </button>


          {/* About */}

          <button
            type="button"
            className="about-menu-item active"
          >
            <span>AB</span>
            About Project
          </button>

        </nav>


        {/* SIDEBAR USER */}

        <div className="about-sidebar-bottom">

          <div className="about-user">

            <div className="about-avatar">
              {firstLetter}
            </div>

            <div>

              <strong>
                {username}
              </strong>

              <p>
                Candidate
              </p>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="about-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="about-main">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="about-header">

          <div>

            <p className="about-label">
              PROJECT
            </p>

            <h1>
              About the Platform
            </h1>

            <p className="about-header-text">
              Learn about the purpose, solution and
              technology behind the AI Interview
              Preparation Platform.
            </p>

          </div>


          <button
            type="button"
            className="about-primary-button"
            onClick={() =>
              navigate("/mock-interview")
            }
          >
            Start Mock Interview
          </button>

        </header>


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="about-hero">

          <div className="about-hero-content">

            <p className="about-hero-label">
              AI INTERVIEW PREPARATION
            </p>

            <h2>
              Prepare smarter.
              Interview better.
            </h2>

            <p>
              The AI Interview Preparation Platform
              brings technical practice, mock interviews,
              resume preparation, coding practice and
              AI-powered feedback together in one place.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Explore Platform →
            </button>

          </div>


          <div className="about-hero-mark">
            AI
          </div>

        </section>


        {/* ====================================================
            PROJECT OVERVIEW
        ==================================================== */}

        <section className="about-section">

          <div className="about-section-heading">

            <p className="about-label">
              OVERVIEW
            </p>

            <h2>
              Project Overview
            </h2>

            <p>
              A centralized platform designed to make
              interview preparation simpler and more
              effective.
            </p>

          </div>


          <div className="about-overview-grid">

            {/* PROBLEM */}

            <div className="about-info-card">

              <span className="about-card-code">
                01
              </span>

              <h3>
                Problem
              </h3>

              <p>
                Interview preparation often requires
                candidates to use multiple resources
                for technical practice, mock interviews,
                resume preparation and performance review.
              </p>

            </div>


            {/* SOLUTION */}

            <div className="about-info-card">

              <span className="about-card-code">
                02
              </span>

              <h3>
                Solution
              </h3>

              <p>
                This platform combines interview
                preparation tools into one application
                with structured practice and
                AI-assisted evaluation.
              </p>

            </div>


            {/* OBJECTIVE */}

            <div className="about-info-card">

              <span className="about-card-code">
                03
              </span>

              <h3>
                Objective
              </h3>

              <p>
                Help candidates improve technical
                knowledge, communication skills and
                interview confidence before attending
                real interviews.
              </p>

            </div>

          </div>

        </section>


        {/* ====================================================
            TECHNOLOGY STACK
        ==================================================== */}

        <section className="about-section">

          <div className="about-section-heading">

            <p className="about-label">
              DEVELOPMENT
            </p>

            <h2>
              Technology Stack
            </h2>

            <p>
              Technologies used to build the platform.
            </p>

          </div>


          <div className="about-tech-grid">

            {technologies.map((technology) => (

              <div
                className="about-tech-card"
                key={technology.title}
              >

                <div className="about-tech-code">
                  {technology.code}
                </div>

                <div>

                  <h3>
                    {technology.title}
                  </h3>

                  <p>
                    {technology.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ====================================================
            PROJECT INFORMATION
        ==================================================== */}

        <section className="about-project-card">

          <div>

            <p className="about-label">
              PROJECT DEVELOPMENT
            </p>

            <h2>
              AI Interview Preparation Platform
            </h2>

            <p>
              A full-stack web application combining
              frontend, backend, database and
              AI-assisted functionality to provide
              an integrated interview preparation
              experience.
            </p>

          </div>


          <div className="about-developer">

            <span>
              DEVELOPED BY
            </span>

            <strong>
              Pranathi Yeruva
            </strong>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="about-footer">
          AI Interview Preparation Platform
        </footer>

      </main>

    </div>
  );
}

export default About;