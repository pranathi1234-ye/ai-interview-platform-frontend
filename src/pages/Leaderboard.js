import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // CURRENT USER
  // =========================================

  let storedUser = {};

  try {
    storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error(
      "Unable to read user:",
      error
    );
  }

  const username =
    storedUser.name ||
    storedUser.username ||
    localStorage.getItem("username") ||
    "Candidate";

  // =========================================
  // LOAD LEADERBOARD
  // =========================================

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================
      // GET BACKEND SCORES
      // =====================================

      let backendScores = [];

      try {
        const response = await axios.get(
          "http://https://ai-interview-platform-backend-production.up.railway.app/api/scores"
        );

        if (Array.isArray(response.data)) {
          backendScores = response.data;
        }
      } catch (backendError) {
        console.log(
          "Backend leaderboard unavailable."
        );
      }

      // =====================================
      // GET LOCAL INTERVIEW HISTORY
      // =====================================

      let localHistory = [];

      try {
        const storedHistory =
          JSON.parse(
            localStorage.getItem(
              "interviewHistory"
            ) || "[]"
          );

        if (Array.isArray(storedHistory)) {
          localHistory = storedHistory;
        }
      } catch (historyError) {
        console.error(
          "Unable to read interview history:",
          historyError
        );
      }

      // =====================================
      // CONVERT LOCAL HISTORY
      // =====================================

      const localScores = localHistory
        .map((item) => {
          const score = Number(
            item?.score
          );

          if (
            Number.isNaN(score)
          ) {
            return null;
          }

          return {
            username,
            subject:
              item?.subject ||
              "Interview",
            score,
          };
        })
        .filter(Boolean);

      // =====================================
      // COMBINE SCORES
      // =====================================

      const allScores = [
        ...backendScores,
        ...localScores,
      ];

      // =====================================
      // KEEP HIGHEST SCORE PER CANDIDATE
      // =====================================

      const bestScores = {};

      allScores.forEach((item) => {
        const candidateName =
          item.username &&
          String(item.username).trim() !== ""
            ? String(item.username).trim()
            : "Unknown Candidate";

        const score =
          Number(item.score) || 0;

        if (
          !bestScores[candidateName] ||
          score >
            bestScores[candidateName].score
        ) {
          bestScores[candidateName] = {
            username: candidateName,
            subject:
              item.subject ||
              "Interview",
            score,
          };
        }
      });

      // =====================================
      // SORT
      // =====================================

      const sortedLeaderboard =
        Object.values(bestScores)
          .sort(
            (a, b) =>
              b.score - a.score
          )
          .map((item, index) => ({
            ...item,
            rank: index + 1,
          }));

      setLeaderboard(
        sortedLeaderboard
      );

      // =====================================
      // IF NOTHING EXISTS
      // =====================================

      if (
        sortedLeaderboard.length === 0
      ) {
        setError("");
      }

    } catch (err) {
      console.error(
        "Leaderboard error:",
        err
      );

      setError(
        "Unable to load leaderboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // =========================================
  // INITIAL
  // =========================================

  const getInitial = (name) => {
    if (!name) {
      return "C";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  // =========================================
  // RANK
  // =========================================

  const getRank = (rank) => {
    return String(rank).padStart(
      2,
      "0"
    );
  };

  // =========================================
  // SCORE STATUS
  // =========================================

  const getStatus = (score) => {
    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 60) {
      return "Good";
    }

    if (score >= 40) {
      return "Improving";
    }

    return "Needs Practice";
  };

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="leaderboard-page">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="leaderboard-sidebar">

        <div>

          {/* BRAND */}

          <div className="lb-brand">

            <div className="lb-brand-mark">
              AI
            </div>

            <div>
              <h2>
                AI Interview
              </h2>

              <p>
                Preparation Platform
              </p>
            </div>

          </div>

          <div className="lb-divider" />

          <p className="lb-menu-label">
            NAVIGATION
          </p>

          {/* NAVIGATION */}

          <nav className="lb-menu">

            {/* Dashboard */}

            <button
              type="button"
              className="lb-menu-item"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <span className="lb-menu-code">
                DB
              </span>

              <span>
                Dashboard
              </span>
            </button>

            {/* Leaderboard */}

            <button
              type="button"
              className="lb-menu-item active"
              onClick={() =>
                navigate("/leaderboard")
              }
            >
              <span className="lb-menu-code">
                LB
              </span>

              <span>
                Leaderboard
              </span>
            </button>

            {/* Profile */}

            <button
              type="button"
              className="lb-menu-item"
              onClick={() =>
                navigate("/profile")
              }
            >
              <span className="lb-menu-code">
                PR
              </span>

              <span>
                Profile
              </span>
            </button>

            {/* About */}

            <button
              type="button"
              className="lb-menu-item"
              onClick={() =>
                navigate("/about")
              }
            >
              <span className="lb-menu-code">
                AB
              </span>

              <span>
                About Project
              </span>
            </button>

          </nav>

        </div>

        {/* =====================================
            USER
        ====================================== */}

        <div className="lb-sidebar-bottom">

          <div className="lb-user">

            <div className="lb-user-avatar">
              {getInitial(username)}
            </div>

            <div className="lb-user-details">

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
            className="lb-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="leaderboard-main">

        {/* =====================================
            TOP HEADER
        ====================================== */}

        <header className="lb-topbar">

          <div>

            <p className="lb-page-label">
              PERFORMANCE
            </p>

            <h1>
              Leaderboard
            </h1>

            <p className="lb-page-description">
              Compare candidate performance
              across completed interviews.
            </p>

          </div>

          {/* TOP START MOCK INTERVIEW
              BUTTON REMOVED */}

        </header>

        {/* =====================================
            SUMMARY
        ====================================== */}

        {!loading &&
          !error &&
          leaderboard.length > 0 && (

            <section className="lb-summary-grid">

              {/* TOP CANDIDATE */}

              <div className="lb-summary-card">

                <div className="lb-summary-top">

                  <span>
                    Top Candidate
                  </span>

                  <span className="lb-summary-code">
                    TC
                  </span>

                </div>

                <h2>
                  {
                    leaderboard[0]
                      .username
                  }
                </h2>

                <p>
                  Highest ranked candidate
                </p>

              </div>

              {/* HIGHEST SCORE */}

              <div className="lb-summary-card">

                <div className="lb-summary-top">

                  <span>
                    Highest Score
                  </span>

                  <span className="lb-summary-code">
                    HS
                  </span>

                </div>

                <h2>
                  {
                    leaderboard[0]
                      .score
                  }
                  %
                </h2>

                <p>
                  Best recorded interview score
                </p>

              </div>

              {/* CANDIDATES */}

              <div className="lb-summary-card">

                <div className="lb-summary-top">

                  <span>
                    Candidates Ranked
                  </span>

                  <span className="lb-summary-code">
                    CR
                  </span>

                </div>

                <h2>
                  {leaderboard.length}
                </h2>

                <p>
                  Candidates on leaderboard
                </p>

              </div>

            </section>
          )}

        {/* =====================================
            RANKING SECTION
        ====================================== */}

        <section className="lb-ranking-section">

          <div className="lb-section-header">

            <div>

              <p className="lb-section-label">
                RANKINGS
              </p>

              <h2>
                Candidate Performance
              </h2>

            </div>

            {!loading &&
              !error && (

                <button
                  type="button"
                  className="lb-refresh-button"
                  onClick={
                    loadLeaderboard
                  }
                >
                  Refresh
                </button>

              )}

          </div>

          {/* ===================================
              LOADING
          ==================================== */}

          {loading && (

            <div className="lb-state-card">

              <div className="lb-loader" />

              <h3>
                Loading leaderboard
              </h3>

              <p>
                Retrieving interview scores
                from the server.
              </p>

            </div>

          )}

          {/* ===================================
              ERROR
          ==================================== */}

          {!loading &&
            error && (

              <div className="lb-state-card lb-error-card">

                <div className="lb-state-code">
                  ERR
                </div>

                <h3>
                  Unable to load leaderboard
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="lb-retry-button"
                  onClick={
                    loadLeaderboard
                  }
                >
                  Try Again
                </button>

              </div>

            )}

          {/* ===================================
              EMPTY
          ==================================== */}

          {!loading &&
            !error &&
            leaderboard.length === 0 && (

              <div className="lb-state-card">

                <div className="lb-state-code">
                  00
                </div>

                <h3>
                  No scores available
                </h3>

                <p>
                  Complete your first
                  interview to appear
                  on the leaderboard.
                </p>

                <button
                  type="button"
                  className="lb-primary-button"
                  onClick={() =>
                    navigate(
                      "/mock-interview"
                    )
                  }
                >
                  Start Interview
                </button>

              </div>

            )}

          {/* ===================================
              TABLE
          ==================================== */}

          {!loading &&
            !error &&
            leaderboard.length > 0 && (

              <div className="lb-table-card">

                <div className="lb-table-wrapper">

                  <table className="lb-table">

                    <thead>

                      <tr>

                        <th>
                          Rank
                        </th>

                        <th>
                          Candidate
                        </th>

                        <th>
                          Interview
                        </th>

                        <th>
                          Best Score
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {leaderboard.map(
                        (candidate) => (

                          <tr
                            key={
                              candidate.username
                            }
                          >

                            {/* RANK */}

                            <td>

                              <div
                                className={`lb-rank ${
                                  candidate.rank ===
                                  1
                                    ? "rank-first"
                                    : ""
                                }`}
                              >
                                {getRank(
                                  candidate.rank
                                )}
                              </div>

                            </td>

                            {/* CANDIDATE */}

                            <td>

                              <div className="lb-candidate">

                                <div className="lb-candidate-avatar">
                                  {getInitial(
                                    candidate.username
                                  )}
                                </div>

                                <div className="lb-candidate-info">

                                  <strong>
                                    {
                                      candidate.username
                                    }
                                  </strong>

                                  <span>
                                    Candidate
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* SUBJECT */}

                            <td>

                              <span className="lb-subject">

                                {
                                  candidate.subject
                                }

                              </span>

                            </td>

                            {/* SCORE */}

                            <td>

                              <strong className="lb-score">

                                {
                                  candidate.score
                                }
                                %

                              </strong>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={
                                  candidate.rank ===
                                  1
                                    ? "lb-status top"
                                    : "lb-status"
                                }
                              >

                                {candidate.rank ===
                                1
                                  ? "Top Performer"
                                  : getStatus(
                                      candidate.score
                                    )}

                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="lb-table-footer">

                  <span>

                    {leaderboard.length}{" "}

                    {leaderboard.length ===
                    1
                      ? "candidate"
                      : "candidates"}{" "}
                    ranked

                  </span>

                  <span>
                    Ranked by highest interview
                    score
                  </span>

                </div>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Leaderboard;