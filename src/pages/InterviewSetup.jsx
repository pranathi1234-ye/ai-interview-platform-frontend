import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get language from previous page
  const selectedLanguage =
    location.state?.language;

  const languageName =
    selectedLanguage?.name ||
    location.state?.languageName ||
    "Python";

  const [difficulty, setDifficulty] =
    useState("Intermediate");

  const [interviewType, setInterviewType] =
    useState("Mixed");

  const [numberOfQuestions, setNumberOfQuestions] =
    useState(10);

  const handleStartInterview = () => {
    navigate(
      `/interview/${encodeURIComponent(
        languageName
      )}`,
      {
        state: {
          language: selectedLanguage || {
            id: languageName.toLowerCase(),
            name: languageName,
            category: "Programming",
          },

          difficulty: difficulty,

          interviewType: interviewType,

          numberOfQuestions:
            Number(numberOfQuestions),
        },
      }
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <p style={styles.label}>
          AI MOCK INTERVIEW
        </p>

        <h1 style={styles.title}>
          Interview Setup
        </h1>

        <p style={styles.subtitle}>
          Configure your interview before
          you begin.
        </p>

        {/* LANGUAGE */}

        <div style={styles.card}>
          <label style={styles.labelText}>
            Programming Language
          </label>

          <div style={styles.languageBox}>
            <div style={styles.languageIcon}>
              {languageName
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {languageName}
              </strong>

              <p style={styles.smallText}>
                Selected programming language
              </p>
            </div>
          </div>
        </div>

        {/* DIFFICULTY */}

        <div style={styles.card}>
          <label style={styles.labelText}>
            Difficulty Level
          </label>

          <div style={styles.options}>
            {[
              "Beginner",
              "Intermediate",
              "Advanced",
            ].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setDifficulty(level)
                }
                style={{
                  ...styles.option,
                  ...(difficulty === level
                    ? styles.selectedOption
                    : {}),
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* INTERVIEW TYPE */}

        <div style={styles.card}>
          <label style={styles.labelText}>
            Interview Type
          </label>

          <div style={styles.options}>
            {[
              "Technical",
              "Coding",
              "HR",
              "Mixed",
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setInterviewType(type)
                }
                style={{
                  ...styles.option,
                  ...(interviewType === type
                    ? styles.selectedOption
                    : {}),
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* NUMBER OF QUESTIONS */}

        <div style={styles.card}>
          <label style={styles.labelText}>
            Number of Questions
          </label>

          <div style={styles.options}>
            {[5, 10, 15, 20].map(
              (number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() =>
                    setNumberOfQuestions(
                      number
                    )
                  }
                  style={{
                    ...styles.option,
                    ...(numberOfQuestions ===
                    number
                      ? styles.selectedOption
                      : {}),
                  }}
                >
                  {number}
                </button>
              )
            )}
          </div>
        </div>

        {/* SUMMARY */}

        <div style={styles.summary}>
          <h3>
            Interview Summary
          </h3>

          <div style={styles.summaryRow}>
            <span>Language</span>

            <strong>
              {languageName}
            </strong>
          </div>

          <div style={styles.summaryRow}>
            <span>Difficulty</span>

            <strong>
              {difficulty}
            </strong>
          </div>

          <div style={styles.summaryRow}>
            <span>Interview Type</span>

            <strong>
              {interviewType}
            </strong>
          </div>

          <div style={styles.summaryRow}>
            <span>Questions</span>

            <strong>
              {numberOfQuestions}
            </strong>
          </div>
        </div>

        {/* START */}

        <button
          type="button"
          onClick={
            handleStartInterview
          }
          style={styles.startButton}
        >
          Start Interview →
        </button>

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          style={styles.backButton}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 20px",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  label: {
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#0F172A",
  },

  subtitle: {
    color: "#64748B",
    marginBottom: "30px",
  },

  card: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "18px",
  },

  labelText: {
    display: "block",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "15px",
  },

  languageBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  languageIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  smallText: {
    margin: "5px 0 0",
    color: "#94A3B8",
    fontSize: "13px",
  },

  options: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  option: {
    padding: "12px 20px",
    background: "#FFFFFF",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#334155",
    fontWeight: "600",
  },

  selectedOption: {
    background: "#2563EB",
    color: "#FFFFFF",
    borderColor: "#2563EB",
  },

  summary: {
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "25px",
    marginBottom: "20px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom:
      "1px solid #DBEAFE",
    color: "#475569",
  },

  startButton: {
    width: "100%",
    padding: "15px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "9px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  backButton: {
    width: "100%",
    padding: "13px",
    marginTop: "10px",
    background: "#FFFFFF",
    color: "#334155",
    border: "1px solid #CBD5E1",
    borderRadius: "9px",
    cursor: "pointer",
  },
};

export default InterviewSetup;