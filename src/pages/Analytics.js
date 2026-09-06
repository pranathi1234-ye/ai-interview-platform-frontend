import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Analytics() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET USERNAME
  // =====================================================

  const getUsername = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      return (
        localStorage.getItem("username") ||
        user.name ||
        user.username ||
        user.fullName ||
        "Candidate"
      );
    } catch (err) {
      console.error("Unable to read user:", err);
      return "Candidate";
    }
  };

  // =====================================================
  // LOAD SCORES FROM BACKEND
  // =====================================================

  const loadScores = async () => {
    setLoading(true);
    setError("");

    const username = getUsername();

    try {
      const response = await axios.get(
        `http://https://ai-interview-platform-backend-production.up.railway.app/api/scores/${encodeURIComponent(
          username
        )}`
      );

      if (Array.isArray(response.data)) {
        setScores(response.data);
      } else {
        setScores([]);
      }
    } catch (err) {
      console.error("Unable to load scores:", err);

      setError(
        "Unable to connect to the backend. Please make sure Spring Boot is running."
      );

      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadScores();
  }, []);

  // =====================================================
  // CONVERT SCORE
  // Backend score = 0 to 10
  // Analytics score = 0 to 100
  // =====================================================

  const getPercentage = (score) => {
    const value = Number(score);

    if (Number.isNaN(value)) {
      return 0;
    }

    // If score is 0-10
    if (value <= 10) {
      return Math.round(value * 10);
    }

    // If already percentage
    return Math.min(Math.round(value), 100);
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const totalInterviews = scores.length;

  const percentages = scores.map((item) =>
    getPercentage(item.score)
  );

  const latestScore =
    percentages.length > 0
      ? percentages[percentages.length - 1]
      : 0;

  const averageScore =
    percentages.length > 0
      ? Math.round(
          percentages.reduce(
            (total, score) => total + score,
            0
          ) / percentages.length
        )
      : 0;

  const bestScore =
    percentages.length > 0
      ? Math.max(...percentages)
      : 0;

  // =====================================================
  // BEST SUBJECT
  // =====================================================

  let bestSubject = "No data";

  if (scores.length > 0) {
    let bestIndex = 0;

    percentages.forEach((score, index) => {
      if (score > percentages[bestIndex]) {
        bestIndex = index;
      }
    });

    bestSubject =
      scores[bestIndex]?.subject || "Interview";
  }

  // =====================================================
  // SUBJECT PERFORMANCE
  // =====================================================

  const subjectMap = {};

  scores.forEach((item) => {
    const subject = item.subject || "Interview";
    const percentage = getPercentage(item.score);

    if (!subjectMap[subject]) {
      subjectMap[subject] = [];
    }

    subjectMap[subject].push(percentage);
  });

  const subjectScores = Object.keys(subjectMap).map(
    (subject) => {
      const values = subjectMap[subject];

      const average = Math.round(
        values.reduce(
          (total, value) => total + value,
          0
        ) / values.length
      );

      return {
        name: subject,
        score: average,
      };
    }
  );

  // =====================================================
  // RECENT INTERVIEWS
  // =====================================================

  const recentInterviews = [...scores]
    .reverse()
    .slice(0, 5)
    .map((item, index) => ({
      id: item.id || index,
      subject: item.subject || "Interview",
      score: getPercentage(item.score),
      rawScore: item.score,
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "Recent",
    }));

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (score) => {
    if (score >= 80) {
      return {
        text: "Excellent",
        background: "#DCFCE7",
        color: "#15803D",
      };
    }

    if (score >= 60) {
      return {
        text: "Good",
        background: "#DBEAFE",
        color: "#1D4ED8",
      };
    }

    if (score >= 40) {
      return {
        text: "Improving",
        background: "#FEF3C7",
        color: "#B45309",
      };
    }

    return {
      text: "Needs Practice",
      background: "#FEE2E2",
      color: "#B91C1C",
    };
  };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

  const getPerformanceMessage = () => {
    if (totalInterviews === 0) {
      return "Complete your first interview to start tracking your performance.";
    }

    if (averageScore >= 80) {
      return "Excellent performance. Continue practising advanced questions to maintain your level.";
    }

    if (averageScore >= 60) {
      return "You are making good progress. Focus on weaker subjects and improve the quality of your answers.";
    }

    if (averageScore >= 40) {
      return "Your preparation is improving. Continue practising technical concepts and interview communication.";
    }

    return "Keep practising regularly and review your AI feedback after every interview.";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <h2>Loading Analytics...</h2>
          <p>
            Getting your interview performance from the
            server.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              PERFORMANCE
            </p>

            <h1 style={styles.title}>
              Analytics
            </h1>

            <p style={styles.subtitle}>
              Review your interview performance,
              progress and preparation insights.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={styles.dashboardButton}
          >
            ← Dashboard
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div style={styles.errorBox}>
            <strong>Backend Connection Error</strong>
            <p>{error}</p>

            <button
              onClick={loadScores}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* OVERVIEW */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              OVERVIEW
            </p>

            <h2 style={styles.sectionHeading}>
              Performance Overview
            </h2>
          </div>

          <button
            type="button"
            onClick={loadScores}
            style={styles.refreshButton}
          >
            Refresh
          </button>
        </div>

        {/* STAT CARDS */}

        <div style={styles.statsGrid}>

          <StatCard
            code="TI"
            label="Total Interviews"
            value={totalInterviews}
            description="Completed interview attempts"
          />

          <StatCard
            code="LS"
            label="Latest Score"
            value={`${latestScore}%`}
            description="Most recent interview result"
          />

          <StatCard
            code="AS"
            label="Average Score"
            value={`${averageScore}%`}
            description="Overall interview performance"
          />

          <StatCard
            code="BS"
            label="Best Score"
            value={`${bestScore}%`}
            description="Highest recorded score"
          />

        </div>

        {/* PROGRESS */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              PROGRESS
            </p>

            <h2 style={styles.sectionHeading}>
              Preparation Progress
            </h2>
          </div>
        </div>

        <div style={styles.progressLayout}>

          <div style={styles.progressCard}>

            <div style={styles.progressTop}>

              <div>
                <p style={styles.cardLabel}>
                  Overall Performance
                </p>

                <h2 style={styles.largeScore}>
                  {averageScore}%
                </h2>
              </div>

              <div style={styles.bestSubjectBox}>
                <span style={styles.cardLabel}>
                  BEST SUBJECT
                </span>

                <strong style={styles.bestSubject}>
                  {bestSubject}
                </strong>
              </div>

            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${averageScore}%`,
                }}
              />
            </div>

            <div style={styles.progressScale}>
              <span>0%</span>
              <span>100%</span>
            </div>

          </div>

          <div style={styles.summaryCard}>

            <p style={styles.eyebrow}>
              PERFORMANCE SUMMARY
            </p>

            <h3 style={styles.summaryTitle}>
              Preparation Insight
            </h3>

            <p style={styles.summaryText}>
              {getPerformanceMessage()}
            </p>

          </div>

        </div>

        {/* SUBJECT PERFORMANCE */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              INTERVIEWS
            </p>

            <h2 style={styles.sectionHeading}>
              Subject Performance
            </h2>
          </div>
        </div>

        {subjectScores.length === 0 ? (

          <div style={styles.noDataCard}>
            <h3>No interview data yet</h3>

            <p>
              Complete an interview to see your
              performance here.
            </p>

            <button
              onClick={() =>
                navigate("/languages")
              }
              style={styles.primaryButton}
            >
              Start Interview
            </button>
          </div>

        ) : (

          <div style={styles.subjectGrid}>

            {subjectScores.map((subject) => {

              const status = getStatus(
                subject.score
              );

              return (
                <div
                  key={subject.name}
                  style={styles.subjectCard}
                >

                  <div style={styles.subjectTop}>

                    <div>
                      <p style={styles.subjectName}>
                        {subject.name}
                      </p>

                      <p
                        style={
                          styles.subjectDescription
                        }
                      >
                        Interview performance
                      </p>
                    </div>

                    <div style={styles.subjectCode}>
                      {subject.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>

                  </div>

                  <h2 style={styles.subjectScore}>
                    {subject.score}%
                  </h2>

                  <div style={styles.miniTrack}>
                    <div
                      style={{
                        ...styles.miniBar,
                        width: `${subject.score}%`,
                      }}
                    />
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        status.background,
                      color: status.color,
                    }}
                  >
                    {status.text}
                  </span>

                </div>
              );
            })}

          </div>
        )}

        {/* RECENT INTERVIEWS */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              ACTIVITY
            </p>

            <h2 style={styles.sectionHeading}>
              Recent Interviews
            </h2>
          </div>
        </div>

        <div style={styles.tableCard}>

          {recentInterviews.length === 0 ? (

            <div style={styles.emptyState}>

              <h3>
                No interview data yet
              </h3>

              <p>
                Complete an interview to start
                building your performance history.
              </p>

              <button
                onClick={() =>
                  navigate("/languages")
                }
                style={styles.primaryButton}
              >
                Start Interview
              </button>

            </div>

          ) : (

            <>
              <div style={styles.tableHeader}>
                <span>INTERVIEW</span>
                <span>SCORE</span>
                <span>DATE</span>
                <span>STATUS</span>
              </div>

              {recentInterviews.map(
                (interview) => {

                  const status =
                    getStatus(
                      interview.score
                    );

                  return (
                    <div
                      key={interview.id}
                      style={styles.tableRow}
                    >

                      <div
                        style={
                          styles.interviewNameCell
                        }
                      >

                        <div
                          style={
                            styles.tableAvatar
                          }
                        >
                          {interview.subject
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {interview.subject}
                          </strong>

                          <p
                            style={
                              styles.tableSubtext
                            }
                          >
                            Interview
                          </p>
                        </div>

                      </div>

                      <strong
                        style={styles.tableScore}
                      >
                        {interview.score}%
                      </strong>

                      <span>
                        {interview.date}
                      </span>

                      <div>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background:
                              status.background,
                            color:
                              status.color,
                          }}
                        >
                          {status.text}
                        </span>
                      </div>

                    </div>
                  );
                }
              )}
            </>
          )}

        </div>

        {/* QUICK ACTIONS */}

        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>
              PREPARATION
            </p>

            <h2 style={styles.sectionHeading}>
              Quick Actions
            </h2>
          </div>
        </div>

        <div style={styles.actionsGrid}>

          <ActionCard
            code="MI"
            title="Start Interview"
            description="Start another AI-powered interview."
            onClick={() =>
              navigate("/languages")
            }
          />

          <ActionCard
            code="RS"
            title="Results"
            description="Review your latest interview result."
            onClick={() =>
              navigate("/interview-results")
            }
          />

          <ActionCard
            code="DB"
            title="Dashboard"
            description="Return to your interview workspace."
            onClick={() =>
              navigate("/dashboard")
            }
          />

        </div>

      </div>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  code,
  label,
  value,
  description,
}) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statTop}>

        <span style={styles.cardLabel}>
          {label}
        </span>

        <span style={styles.codeBox}>
          {code}
        </span>

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

// =====================================================
// ACTION CARD
// =====================================================

function ActionCard({
  code,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={styles.actionCard}
    >

      <div style={styles.actionIcon}>
        {code}
      </div>

      <div style={styles.actionContent}>

        <strong style={styles.actionTitle}>
          {title}
        </strong>

        <p style={styles.actionDescription}>
          {description}
        </p>

      </div>

      <span style={styles.arrow}>
        →
      </span>

    </button>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "35px 40px 60px",
    boxSizing: "border-box",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#0F172A",
  },

  container: {
    maxWidth: "1500px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  eyebrow: {
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    margin: "0 0 8px",
  },

  title: {
    fontSize: "34px",
    color: "#0F172A",
    margin: 0,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748B",
    margin: "8px 0 0",
    fontSize: "14px",
  },

  dashboardButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "13px 20px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  errorBox: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#991B1B",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "25px",
  },

  retryButton: {
    marginTop: "8px",
    background: "#DC2626",
    color: "#FFFFFF",
    border: "none",
    padding: "9px 15px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "700",
  },

  loadingCard: {
    maxWidth: "600px",
    margin: "150px auto",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
  },

  refreshButton: {
    background: "transparent",
    color: "#2563EB",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginTop: "35px",
    marginBottom: "15px",
  },

  sectionHeading: {
    margin: 0,
    color: "#0F172A",
    fontSize: "22px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },

  statCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
    boxShadow:
      "0 2px 8px rgba(15,23,42,0.03)",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: "#64748B",
    fontSize: "12px",
    fontWeight: "600",
    margin: 0,
  },

  codeBox: {
    background: "#EFF6FF",
    color: "#2563EB",
    padding: "7px 8px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "800",
  },

  statValue: {
    fontSize: "30px",
    margin: "18px 0 5px",
    color: "#0F172A",
  },

  statDescription: {
    color: "#94A3B8",
    fontSize: "12px",
    margin: 0,
  },

  progressLayout: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,2fr) minmax(260px,1fr)",
    gap: "16px",
  },

  progressCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "25px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
  },

  largeScore: {
    fontSize: "32px",
    margin: "8px 0 20px",
  },

  bestSubjectBox: {
    textAlign: "right",
  },

  bestSubject: {
    display: "block",
    color: "#2563EB",
    fontSize: "18px",
    marginTop: "6px",
  },

  progressTrack: {
    height: "8px",
    background: "#E2E8F0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563EB",
    borderRadius: "20px",
    transition: "width 0.4s ease",
  },

  progressScale: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94A3B8",
    fontSize: "10px",
    marginTop: "7px",
  },

  summaryCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "25px",
  },

  summaryTitle: {
    margin: "10px 0",
    fontSize: "19px",
  },

  summaryText: {
    color: "#64748B",
    lineHeight: "1.7",
    fontSize: "13px",
    margin: 0,
  },

  subjectGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(230px,1fr))",
    gap: "16px",
  },

  subjectCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  subjectTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },

  subjectName: {
    margin: 0,
    fontWeight: "800",
    fontSize: "16px",
  },

  subjectDescription: {
    margin: "5px 0 0",
    color: "#94A3B8",
    fontSize: "11px",
  },

  subjectCode: {
    width: "34px",
    height: "34px",
    background: "#EFF6FF",
    color: "#2563EB",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "800",
  },

  subjectScore: {
    fontSize: "28px",
    margin: "25px 0 12px",
  },

  miniTrack: {
    height: "6px",
    background: "#E2E8F0",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "15px",
  },

  miniBar: {
    height: "100%",
    background: "#2563EB",
    borderRadius: "10px",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  noDataCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    color: "#64748B",
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  tableCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr",
    padding: "14px 20px",
    background: "#F8FAFC",
    color: "#64748B",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    borderBottom: "1px solid #E2E8F0",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #F1F5F9",
    fontSize: "13px",
  },

  interviewNameCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  tableAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
  },

  tableSubtext: {
    color: "#94A3B8",
    fontSize: "10px",
    margin: "3px 0 0",
  },

  tableScore: {
    fontSize: "16px",
  },

  emptyState: {
    textAlign: "center",
    padding: "45px 20px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "15px",
  },

  actionCard: {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left",
    color: "#0F172A",
  },

  actionIcon: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "8px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "800",
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: "13px",
  },

  actionDescription: {
    color: "#64748B",
    fontSize: "10px",
    margin: "5px 0 0",
    lineHeight: "1.5",
  },

  arrow: {
    color: "#94A3B8",
    fontSize: "18px",
  },
};

export default Analytics;