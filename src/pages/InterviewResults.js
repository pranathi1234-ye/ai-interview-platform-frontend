import React from "react";
import { useNavigate } from "react-router-dom";
import "./InterviewResults.css";

function InterviewResults() {
  const navigate = useNavigate();

  let answers = [];
  let score = 0;

  try {
    const savedAnswers =
      localStorage.getItem("mockInterviewAnswers");

    const savedScore =
      localStorage.getItem("mockInterviewScore");

    if (savedAnswers) {
      const parsedAnswers =
        JSON.parse(savedAnswers);

      answers = Array.isArray(parsedAnswers)
        ? parsedAnswers
        : [];
    }

    if (savedScore) {
      score = Number(savedScore) || 0;
    }
  } catch (error) {
    console.error(
      "Unable to load interview results:",
      error
    );
  }

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error(
      "Unable to load user:",
      error
    );
  }

  const username =
    localStorage.getItem("username") ||
    user.username ||
    user.name ||
    "Candidate";

  const totalQuestions = answers.length;

  const answeredQuestions = answers.filter(
    (item) =>
      item.answer &&
      item.answer.trim() !== ""
  ).length;

  const unansweredQuestions =
    totalQuestions - answeredQuestions;

  /*
   * mockInterviewScore is already stored
   * as a percentage from 0 to 100.
   */
  const percentage = Math.min(
    100,
    Math.max(0, Math.round(score))
  );

  // =========================================
  // PERFORMANCE
  // =========================================

  const getPerformance = () => {
    if (percentage >= 80) {
      return {
        level: "Excellent",
        message:
          "You completed the interview with strong overall participation. Continue refining your answers with specific examples and clear explanations.",
      };
    }

    if (percentage >= 60) {
      return {
        level: "Good",
        message:
          "You completed a solid interview attempt. Focus on providing more complete answers and supporting them with relevant examples.",
      };
    }

    if (percentage >= 40) {
      return {
        level: "Developing",
        message:
          "Your interview preparation is progressing. Focus on answering more questions completely and structuring your responses clearly.",
      };
    }

    return {
      level: "Needs Practice",
      message:
        "More interview practice is recommended. Build clear responses for common questions and practise explaining your experience confidently.",
    };
  };

  const performance = getPerformance();

  // =========================================
  // RESTART INTERVIEW
  // =========================================

  const restartInterview = () => {
    localStorage.removeItem(
      "mockInterviewAnswers"
    );

    localStorage.removeItem(
      "mockInterviewScore"
    );

    navigate("/mock-interview");
  };

  // =========================================
  // NAVIGATION
  // =========================================

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToAnalytics = () => {
    navigate("/analytics");
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="results-page">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="results-sidebar">

        <div>

          {/* BRAND */}

          <div className="results-brand">

            <div className="results-brand-mark">
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

          <div className="results-divider" />

          <p className="results-menu-label">
            INTERVIEW COMPLETE
          </p>

          <div className="results-sidebar-info">

            <div>
              <span>
                Candidate
              </span>

              <strong>
                {username}
              </strong>
            </div>

            <div>
              <span>
                Assessment
              </span>

              <strong>
                Mock Interview
              </strong>
            </div>

            <div>
              <span>
                Questions
              </span>

              <strong>
                {totalQuestions}
              </strong>
            </div>

            <div>
              <span>
                Status
              </span>

              <strong>
                Completed
              </strong>
            </div>

          </div>

        </div>

        {/* SIDEBAR BUTTON */}

        <div className="results-sidebar-bottom">

          <button
            type="button"
            className="results-sidebar-button"
            onClick={goToDashboard}
          >
            Back to Dashboard
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="results-main">

        {/* =====================================
            HEADER
            TOP-RIGHT START NEW INTERVIEW
            BUTTON REMOVED
        ====================================== */}

        <header className="results-topbar">

          <div>

            <p className="results-page-label">
              ASSESSMENT REPORT
            </p>

            <h1>
              Interview Results
            </h1>

            <p className="results-description">
              Review your mock interview
              performance and submitted answers.
            </p>

          </div>

        </header>

        {/* =====================================
            NO RESULTS
        ====================================== */}

        {answers.length === 0 ? (

          <section className="results-empty">

            <div className="results-empty-code">
              NR
            </div>

            <h2>
              No Results Available
            </h2>

            <p>
              Complete a mock interview to
              generate your performance report.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/mock-interview")
              }
            >
              Start Mock Interview
            </button>

          </section>

        ) : (

          <>

            {/* =================================
                SCORE SUMMARY
            ================================== */}

            <section className="results-summary">

              <div className="results-score-area">

                <div
                  className="results-score-circle"
                  style={{
                    "--score": `${percentage * 3.6}deg`,
                  }}
                >

                  <div className="results-score-inner">

                    <strong>
                      {percentage}%
                    </strong>

                    <span>
                      Overall Score
                    </span>

                  </div>

                </div>

              </div>

              <div className="results-performance">

                <p className="results-section-label">
                  PERFORMANCE
                </p>

                <h2>
                  {performance.level}
                </h2>

                <p>
                  {performance.message}
                </p>

                <div className="results-performance-meta">

                  <div>

                    <span>
                      Answered
                    </span>

                    <strong>
                      {answeredQuestions}/
                      {totalQuestions}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Completion
                    </span>

                    <strong>
                      {totalQuestions > 0
                        ? Math.round(
                            (answeredQuestions /
                              totalQuestions) *
                              100
                          )
                        : 0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Status
                    </span>

                    <strong>
                      Completed
                    </strong>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================
                STATS
            ================================== */}

            <section className="results-section">

              <div className="results-section-header">

                <div>

                  <p className="results-section-label">
                    OVERVIEW
                  </p>

                  <h2>
                    Assessment Summary
                  </h2>

                </div>

                <button
                  type="button"
                  className="results-text-button"
                  onClick={goToAnalytics}
                >
                  View Analytics
                </button>

              </div>

              <div className="results-stats-grid">

                {/* OVERALL SCORE */}

                <div className="results-stat-card">

                  <div className="results-stat-header">

                    <span>
                      Overall Score
                    </span>

                    <div>
                      OS
                    </div>

                  </div>

                  <h3>
                    {percentage}%
                  </h3>

                  <p>
                    Interview completion score
                  </p>

                </div>

                {/* ANSWERED */}

                <div className="results-stat-card">

                  <div className="results-stat-header">

                    <span>
                      Answered
                    </span>

                    <div>
                      AN
                    </div>

                  </div>

                  <h3>
                    {answeredQuestions}
                  </h3>

                  <p>
                    Questions with responses
                  </p>

                </div>

                {/* UNANSWERED */}

                <div className="results-stat-card">

                  <div className="results-stat-header">

                    <span>
                      Unanswered
                    </span>

                    <div>
                      UA
                    </div>

                  </div>

                  <h3>
                    {unansweredQuestions}
                  </h3>

                  <p>
                    Questions without responses
                  </p>

                </div>

                {/* TOTAL QUESTIONS */}

                <div className="results-stat-card">

                  <div className="results-stat-header">

                    <span>
                      Total Questions
                    </span>

                    <div>
                      TQ
                    </div>

                  </div>

                  <h3>
                    {totalQuestions}
                  </h3>

                  <p>
                    Questions in assessment
                  </p>

                </div>

              </div>

            </section>

            {/* =================================
                FEEDBACK
            ================================== */}

            <section className="results-section">

              <div className="results-section-header">

                <div>

                  <p className="results-section-label">
                    FEEDBACK
                  </p>

                  <h2>
                    Interview Insights
                  </h2>

                </div>

              </div>

              <div className="results-feedback-grid">

                {/* COMPLETION */}

                <div className="results-feedback-card">

                  <span className="results-feedback-code">
                    01
                  </span>

                  <h3>
                    Completion
                  </h3>

                  <p>
                    You answered{" "}
                    {answeredQuestions} of{" "}
                    {totalQuestions} questions
                    during this interview
                    session.
                  </p>

                </div>

                {/* IMPROVEMENT */}

                <div className="results-feedback-card">

                  <span className="results-feedback-code">
                    02
                  </span>

                  <h3>
                    Improvement Area
                  </h3>

                  <p>
                    Add specific examples from
                    projects, technical work and
                    practical experience to make
                    your responses stronger.
                  </p>

                </div>

                {/* STRATEGY */}

                <div className="results-feedback-card">

                  <span className="results-feedback-code">
                    03
                  </span>

                  <h3>
                    Interview Strategy
                  </h3>

                  <p>
                    For behavioural questions,
                    structure responses around
                    Situation, Task, Action and
                    Result.
                  </p>

                </div>

              </div>

              <div className="results-note">

                <strong>
                  Current scoring method
                </strong>

                <p>
                  This result currently measures
                  interview completion. It does not
                  yet evaluate the technical
                  correctness or quality of each
                  answer.
                </p>

              </div>

            </section>

            {/* =================================
                ANSWER REVIEW
            ================================== */}

            <section className="results-section">

              <div className="results-section-header">

                <div>

                  <p className="results-section-label">
                    RESPONSE REVIEW
                  </p>

                  <h2>
                    Your Answers
                  </h2>

                </div>

                <span className="results-answer-count">
                  {answeredQuestions} of{" "}
                  {totalQuestions} answered
                </span>

              </div>

              <div className="results-answers">

                {answers.map(
                  (item, index) => {

                    const hasAnswer =
                      item.answer &&
                      item.answer.trim() !==
                        "";

                    return (
                      <article
                        className="results-answer-card"
                        key={index}
                      >

                        <div className="results-question-row">

                          <span className="results-question-number">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div className="results-question-content">

                            <div className="results-question-heading">

                              <h3>
                                {item.question}
                              </h3>

                              <span
                                className={
                                  hasAnswer
                                    ? "results-status answered"
                                    : "results-status unanswered"
                                }
                              >
                                {hasAnswer
                                  ? "Answered"
                                  : "Not Answered"}
                              </span>

                            </div>

                            <p className="results-answer-label">
                              YOUR RESPONSE
                            </p>

                            <p
                              className={
                                hasAnswer
                                  ? "results-answer-text"
                                  : "results-answer-text empty"
                              }
                            >
                              {hasAnswer
                                ? item.answer
                                : "No response was provided for this question."}
                            </p>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </section>

            {/* =================================
                ACTIONS
            ================================== */}

            <section className="results-actions">

              <div>

                <p className="results-section-label">
                  NEXT STEP
                </p>

                <h2>
                  Continue Your Preparation
                </h2>

                <p>
                  Review your responses, practise
                  another interview or explore
                  your overall performance.
                </p>

              </div>

              <div className="results-action-buttons">

                {/* DASHBOARD */}

                <button
                  type="button"
                  className="results-secondary-button"
                  onClick={goToDashboard}
                >
                  Dashboard
                </button>

                {/* ANALYTICS */}

                <button
                  type="button"
                  className="results-secondary-button"
                  onClick={goToAnalytics}
                >
                  Analytics
                </button>

                {/* NEW INTERVIEW */}

                <button
                  type="button"
                  className="results-primary-button"
                  onClick={restartInterview}
                >
                  New Interview
                </button>

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default InterviewResults;