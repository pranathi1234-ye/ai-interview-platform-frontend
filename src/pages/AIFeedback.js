import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AIFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved mock interview answers
  const answers = useMemo(() => {
    try {
      const savedAnswers = localStorage.getItem(
        "mockInterviewAnswers"
      );

      if (!savedAnswers) {
        return [];
      }

      const parsedAnswers = JSON.parse(savedAnswers);

      return Array.isArray(parsedAnswers)
        ? parsedAnswers
        : [];
    } catch (error) {
      console.error(
        "Unable to load interview answers:",
        error
      );

      return [];
    }
  }, []);

  const answeredCount = answers.filter(
    (item) =>
      item &&
      item.answer &&
      item.answer.trim() !== ""
  ).length;

  const unansweredCount =
    answers.length - answeredCount;

  const completionRate =
    answers.length > 0
      ? Math.round(
          (answeredCount / answers.length) * 100
        )
      : 0;

  const mockScore = Number(
    localStorage.getItem("mockInterviewScore") || 0
  );

  const generateFeedback = async () => {
    if (answers.length === 0) {
      setError(
        "Complete a mock interview before generating feedback."
      );

      return;
    }

    if (answeredCount === 0) {
      setError(
        "No answers are available for evaluation."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedback([]);

      const response = await axios.post(
        "http://https://ai-interview-platform-backend-production.up.railway.app/api/feedback/evaluate",
        {
          answers,
        }
      );

      console.log(
        "AI feedback response:",
        response.data
      );

      const result = response.data;

      if (Array.isArray(result)) {
        setFeedback(result);
      } else if (
        result &&
        Array.isArray(result.feedback)
      ) {
        setFeedback(result.feedback);
      } else if (
        result &&
        Array.isArray(result.results)
      ) {
        setFeedback(result.results);
      } else {
        console.error(
          "Unexpected feedback response:",
          result
        );

        setError(
          "The server returned an unexpected feedback format."
        );
      }
    } catch (error) {
      console.error(
        "Unable to generate feedback:",
        error
      );

      if (!error.response) {
        setError(
          "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      } else if (error.response.status === 404) {
        setError(
          "The feedback API was not found. Check the backend feedback controller."
        );
      } else if (error.response.status >= 500) {
        setError(
          "The backend could not generate feedback. Check the Spring Boot terminal for the error."
        );
      } else {
        setError(
          "Feedback could not be generated. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreStyle = (score) => {
    const numericScore = Number(score);

    if (numericScore >= 8) {
      return {
        background: "#DCFCE7",
        color: "#15803D",
      };
    }

    if (numericScore >= 6) {
      return {
        background: "#DBEAFE",
        color: "#1D4ED8",
      };
    }

    if (numericScore >= 4) {
      return {
        background: "#FEF3C7",
        color: "#B45309",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#B91C1C",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              INTERVIEW ANALYSIS
            </p>

            <h1 style={styles.title}>
              AI Feedback
            </h1>

            <p style={styles.subtitle}>
              Review your interview responses and
              receive personalised improvement
              recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={styles.dashboardButton}
          >
            Back to Dashboard
          </button>
        </div>

        {/* OVERVIEW */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              OVERVIEW
            </p>

            <h2 style={styles.sectionTitle}>
              Interview Summary
            </h2>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <StatCard
            code="TQ"
            label="Total Questions"
            value={answers.length}
            description="Questions in the interview"
          />

          <StatCard
            code="AN"
            label="Answered"
            value={answeredCount}
            description="Responses completed"
          />

          <StatCard
            code="UA"
            label="Unanswered"
            value={unansweredCount}
            description="Questions without responses"
          />

          <StatCard
            code="SC"
            label="Interview Score"
            value={`${mockScore}%`}
            description="Latest mock interview score"
          />
        </div>

        {/* COMPLETION */}

        {answers.length > 0 && (
          <div style={styles.completionCard}>
            <div style={styles.completionHeader}>
              <div>
                <p style={styles.cardLabel}>
                  INTERVIEW COMPLETION
                </p>

                <h3 style={styles.completionTitle}>
                  Response Progress
                </h3>
              </div>

              <strong style={styles.completionValue}>
                {completionRate}%
              </strong>
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${completionRate}%`,
                }}
              />
            </div>

            <p style={styles.completionDescription}>
              You answered {answeredCount} of{" "}
              {answers.length} interview questions.
            </p>
          </div>
        )}

        {/* NO INTERVIEW */}

        {answers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyCode}>
              AI
            </div>

            <h2 style={styles.emptyTitle}>
              No interview available
            </h2>

            <p style={styles.emptyText}>
              Complete a mock interview before
              generating AI feedback.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/resume-questions")
              }
              style={styles.primaryButton}
            >
              Start Mock Interview
            </button>
          </div>
        ) : (
          <>
            {/* ANSWERS */}

            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.eyebrow}>
                  RESPONSES
                </p>

                <h2 style={styles.sectionTitle}>
                  Interview Answers
                </h2>
              </div>
            </div>

            <div style={styles.answersContainer}>
              {answers.map((item, index) => {
                const hasAnswer =
                  item &&
                  item.answer &&
                  item.answer.trim() !== "";

                return (
                  <div
                    key={index}
                    style={styles.answerCard}
                  >
                    <div style={styles.questionHeader}>
                      <div style={styles.questionNumber}>
                        {index + 1}
                      </div>

                      <div style={styles.questionContent}>
                        <p style={styles.questionLabel}>
                          QUESTION {index + 1}
                        </p>

                        <h3 style={styles.question}>
                          {item.question}
                        </h3>
                      </div>

                      <span
                        style={
                          hasAnswer
                            ? styles.answeredBadge
                            : styles.unansweredBadge
                        }
                      >
                        {hasAnswer
                          ? "Answered"
                          : "Unanswered"}
                      </span>
                    </div>

                    <div style={styles.answerArea}>
                      <p style={styles.answerLabel}>
                        YOUR RESPONSE
                      </p>

                      <p
                        style={
                          hasAnswer
                            ? styles.answerText
                            : styles.noAnswerText
                        }
                      >
                        {hasAnswer
                          ? item.answer
                          : "No answer was provided for this question."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GENERATE */}

            <div style={styles.generateSection}>
              <div>
                <h3 style={styles.generateTitle}>
                  Ready for analysis?
                </h3>

                <p style={styles.generateDescription}>
                  Generate detailed feedback for your
                  interview responses.
                </p>
              </div>

              <button
                type="button"
                onClick={generateFeedback}
                disabled={loading}
                style={{
                  ...styles.generateButton,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "Analysing Responses..."
                  : feedback.length > 0
                  ? "Regenerate Feedback"
                  : "Generate AI Feedback"}
              </button>
            </div>
          </>
        )}

        {/* ERROR */}

        {error && (
          <div style={styles.errorBox}>
            <strong>
              Feedback unavailable
            </strong>

            <p style={styles.errorText}>
              {error}
            </p>
          </div>
        )}

        {/* FEEDBACK */}

        {feedback.length > 0 && (
          <>
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.eyebrow}>
                  AI ANALYSIS
                </p>

                <h2 style={styles.sectionTitle}>
                  Feedback Results
                </h2>
              </div>

              <span style={styles.feedbackCount}>
                {feedback.length} evaluations
              </span>
            </div>

            <div style={styles.feedbackContainer}>
              {feedback.map((item, index) => {
                const scoreStyle = getScoreStyle(
                  item.score
                );

                return (
                  <div
                    key={index}
                    style={styles.feedbackCard}
                  >
                    <div style={styles.feedbackHeader}>
                      <div>
                        <p style={styles.questionLabel}>
                          QUESTION {index + 1}
                        </p>

                        <h3
                          style={
                            styles.feedbackQuestion
                          }
                        >
                          {item.question ||
                            answers[index]?.question ||
                            "Interview Question"}
                        </h3>
                      </div>

                      <span
                        style={{
                          ...styles.scoreBadge,
                          ...scoreStyle,
                        }}
                      >
                        {item.score ?? 0}/10
                      </span>
                    </div>

                    <FeedbackSection
                      title="Your Answer"
                      content={
                        item.answer ||
                        answers[index]?.answer ||
                        "No answer provided."
                      }
                    />

                    <FeedbackSection
                      title="Evaluation"
                      content={
                        item.feedback ||
                        "No evaluation provided."
                      }
                    />

                    <FeedbackSection
                      title="Recommended Improvement"
                      content={
                        item.suggestion ||
                        "No recommendation provided."
                      }
                      highlighted
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ACTIONS */}

        <div style={styles.bottomActions}>
          <button
            type="button"
            onClick={() =>
              navigate("/interview-results")
            }
            style={styles.secondaryButton}
          >
            View Interview Results
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/analytics")
            }
            style={styles.secondaryButton}
          >
            View Analytics
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.primaryButton}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  code,
  label,
  value,
  description,
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statHeader}>
        <p style={styles.statLabel}>
          {label}
        </p>

        <div style={styles.statCode}>
          {code}
        </div>
      </div>

      <h2 style={styles.statValue}>
        {value}
      </h2>

      <p style={styles.statDescription}>
        {description}
      </p>
    </div>
  );
}

function FeedbackSection({
  title,
  content,
  highlighted = false,
}) {
  return (
    <div
      style={
        highlighted
          ? styles.highlightSection
          : styles.feedbackSection
      }
    >
      <p style={styles.feedbackLabel}>
        {title.toUpperCase()}
      </p>

      <p style={styles.feedbackText}>
        {content}
      </p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 30px 60px",
    boxSizing: "border-box",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#0F172A",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "35px",
  },

  eyebrow: {
    margin: "0 0 7px",
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.7px",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "34px",
    fontWeight: "750",
  },

  subtitle: {
    color: "#64748B",
    margin: "9px 0 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  dashboardButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563EB",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "650",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    margin: "35px 0 16px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0F172A",
    fontSize: "21px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: "15px",
  },

  statCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statLabel: {
    margin: 0,
    color: "#64748B",
    fontSize: "12px",
    fontWeight: "600",
  },

  statCode: {
    width: "32px",
    height: "32px",
    borderRadius: "7px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "800",
  },

  statValue: {
    margin: "18px 0 5px",
    fontSize: "29px",
    color: "#0F172A",
  },

  statDescription: {
    margin: 0,
    color: "#94A3B8",
    fontSize: "11px",
  },

  completionCard: {
    marginTop: "18px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  completionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.3px",
    margin: 0,
  },

  completionTitle: {
    margin: "7px 0 18px",
  },

  completionValue: {
    color: "#2563EB",
    fontSize: "24px",
  },

  progressTrack: {
    width: "100%",
    height: "8px",
    background: "#E2E8F0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563EB",
    borderRadius: "20px",
  },

  completionDescription: {
    color: "#64748B",
    fontSize: "12px",
    margin: "10px 0 0",
  },

  emptyState: {
    marginTop: "35px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "50px 20px",
    textAlign: "center",
  },

  emptyCode: {
    width: "55px",
    height: "55px",
    margin: "0 auto 18px",
    borderRadius: "12px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  emptyTitle: {
    margin: 0,
  },

  emptyText: {
    color: "#64748B",
    fontSize: "13px",
    margin: "10px 0 20px",
  },

  answersContainer: {
    display: "grid",
    gap: "12px",
  },

  answerCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    overflow: "hidden",
  },

  questionHeader: {
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    borderBottom: "1px solid #F1F5F9",
  },

  questionNumber: {
    minWidth: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "12px",
  },

  questionContent: {
    flex: 1,
  },

  questionLabel: {
    margin: "0 0 5px",
    color: "#2563EB",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },

  question: {
    margin: 0,
    color: "#0F172A",
    fontSize: "15px",
  },

  answeredBadge: {
    background: "#DCFCE7",
    color: "#15803D",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  unansweredBadge: {
    background: "#FEE2E2",
    color: "#B91C1C",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
  },

  answerArea: {
    padding: "18px 20px",
  },

  answerLabel: {
    margin: "0 0 8px",
    color: "#64748B",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  answerText: {
    margin: 0,
    color: "#334155",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  noAnswerText: {
    margin: 0,
    color: "#94A3B8",
    fontSize: "13px",
    fontStyle: "italic",
  },

  generateSection: {
    marginTop: "20px",
    padding: "22px",
    background: "#172554",
    color: "#FFFFFF",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  generateTitle: {
    margin: 0,
    fontSize: "18px",
  },

  generateDescription: {
    margin: "6px 0 0",
    color: "#CBD5E1",
    fontSize: "12px",
  },

  generateButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    background: "#FFFFFF",
    color: "#1E3A8A",
    fontWeight: "700",
  },

  errorBox: {
    marginTop: "20px",
    padding: "17px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    color: "#B91C1C",
  },

  errorText: {
    margin: "5px 0 0",
    fontSize: "12px",
  },

  feedbackCount: {
    color: "#64748B",
    fontSize: "12px",
  },

  feedbackContainer: {
    display: "grid",
    gap: "15px",
  },

  feedbackCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  feedbackHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    paddingBottom: "18px",
    borderBottom: "1px solid #E2E8F0",
  },

  feedbackQuestion: {
    margin: 0,
    fontSize: "17px",
  },

  scoreBadge: {
    minWidth: "55px",
    padding: "8px 10px",
    textAlign: "center",
    borderRadius: "8px",
    fontWeight: "800",
    fontSize: "12px",
  },

  feedbackSection: {
    marginTop: "18px",
  },

  highlightSection: {
    marginTop: "18px",
    padding: "15px",
    background: "#EFF6FF",
    borderRadius: "8px",
  },

  feedbackLabel: {
    color: "#64748B",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    margin: "0 0 7px",
  },

  feedbackText: {
    color: "#334155",
    fontSize: "13px",
    lineHeight: "1.7",
    margin: 0,
    whiteSpace: "pre-wrap",
  },

  bottomActions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "40px",
    paddingTop: "25px",
    borderTop: "1px solid #E2E8F0",
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "650",
  },

  secondaryButton: {
    background: "#FFFFFF",
    color: "#334155",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "650",
  },
};

export default AIFeedback;