import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import axios from "axios";

function ResumeQuestions() {

  const navigate =
    useNavigate();

  const [
    resumeText,
    setResumeText
  ] = useState("");

  const [
    questions,
    setQuestions
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");

  const [
    fileName,
    setFileName
  ] = useState("");

  // =========================================================
  // LOAD SAVED RESUME
  // =========================================================

  useEffect(() => {

    const savedResume =
      localStorage.getItem(
        "resumeText"
      );

    const savedFileName =
      localStorage.getItem(
        "resumeFileName"
      );

    const savedQuestions =
      localStorage.getItem(
        "resumeInterviewQuestions"
      );

    if (savedResume) {

      setResumeText(
        savedResume
      );

      setFileName(
        savedFileName || ""
      );

    } else {

      setError(
        "No resume found. Please analyze your resume first."
      );
    }

    if (savedQuestions) {

      try {

        const parsed =
          JSON.parse(
            savedQuestions
          );

        if (
          Array.isArray(parsed)
        ) {

          setQuestions(
            parsed
          );
        }

      } catch (error) {

        console.error(
          "Unable to load saved questions:",
          error
        );
      }
    }

  }, []);

  // =========================================================
  // PARSE QUESTIONS
  // =========================================================

  const parseQuestions =
    (value) => {

      if (!value) {
        return [];
      }

      let result =
        value;

      if (
        typeof result ===
        "string"
      ) {

        result =
          result
            .replace(
              /```json/g,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        try {

          result =
            JSON.parse(
              result
            );

        } catch (error) {

          const lines =
            result
              .split("\n")
              .map(
                (line) =>
                  line
                    .replace(
                      /^\s*\d+[\).\-\s]*/,
                      ""
                    )
                    .trim()
              )
              .filter(
                Boolean
              );

          return lines;
        }
      }

      if (
        Array.isArray(result)
      ) {

        return result
          .map(
            (item) => {

              if (
                typeof item ===
                "string"
              ) {
                return item.trim();
              }

              if (
                item &&
                typeof item ===
                  "object"
              ) {

                return (
                  item.question ||
                  item.text ||
                  item.title ||
                  ""
                ).trim();
              }

              return "";
            }
          )
          .filter(Boolean)
          .slice(0, 10);
      }

      if (
        result &&
        Array.isArray(
          result.questions
        )
      ) {

        return result.questions
          .map(
            (item) => {

              if (
                typeof item ===
                "string"
              ) {
                return item.trim();
              }

              if (
                item &&
                typeof item ===
                  "object"
              ) {

                return (
                  item.question ||
                  item.text ||
                  item.title ||
                  ""
                ).trim();
              }

              return "";
            }
          )
          .filter(Boolean)
          .slice(0, 10);
      }

      return [];
    };

  // =========================================================
  // GENERATE QUESTIONS
  // =========================================================

  const handleGenerateQuestions =
    async () => {

      const latestResume =
        localStorage.getItem(
          "resumeText"
        );

      if (
        !latestResume ||
        !latestResume.trim()
      ) {

        setError(
          "No resume found. Please analyze your resume first."
        );

        return;
      }

      setResumeText(
        latestResume
      );

      try {

        setLoading(true);

        setError("");
        setMessage("");
        setQuestions([]);

        // =====================================================
        // IMPORTANT:
        // USE RESUME ANALYZER ENDPOINT
        // =====================================================

        const response =
          await axios.post(
            "http://https://ai-interview-platform-backend-production.up.railway.app/api/resume-analyzer/generate-questions",
            {
              resumeText:
                latestResume
            }
          );

        console.log(
          "Resume questions response:",
          response.data
        );

        if (
          !response.data?.success
        ) {

          throw new Error(
            response.data?.message ||
            "Unable to generate questions."
          );
        }

        const generated =
          parseQuestions(
            response.data.questions
          );

        if (
          generated.length === 0
        ) {

          throw new Error(
            "No questions were generated by AI."
          );
        }

        setQuestions(
          generated
        );

        localStorage.setItem(
          "resumeInterviewQuestions",
          JSON.stringify(
            generated
          )
        );

        localStorage.setItem(
          "interviewSource",
          "resume"
        );

        setMessage(
          `${generated.length} personalized interview questions generated successfully.`
        );

      } catch (error) {

        console.error(
          "Question generation error:",
          error
        );

        setError(
          error.response?.data?.message ||
          error.message ||
          "Unable to generate questions."
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const handleStartInterview =
    () => {

      if (
        questions.length === 0
      ) {

        setError(
          "Please generate questions first."
        );

        return;
      }

      localStorage.setItem(
        "resumeInterviewQuestions",
        JSON.stringify(
          questions
        )
      );

      localStorage.setItem(
        "interviewSource",
        "resume"
      );

      localStorage.removeItem(
        "mockInterviewAnswers"
      );

      localStorage.removeItem(
        "mockInterviewScore"
      );

      localStorage.removeItem(
        "interviewEvaluations"
      );

      navigate(
        "/mock-interview"
      );
    };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack =
    () => {

      navigate(
        "/dashboard"
      );
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={styles.page}
    >

      <div
        style={styles.container}
      >

        <div
          style={styles.header}
        >

          <p
            style={styles.label}
          >
            RESUME ASSESSMENT
          </p>

          <h1
            style={styles.title}
          >
            Resume-Based Interview Questions
          </h1>

          <p
            style={styles.subtitle}
          >
            Generate personalized interview
            questions based on your actual
            resume.
          </p>

        </div>

        {/* RESUME STATUS */}

        <div
          style={
            styles.resumeCard
          }
        >

          <div
            style={
              styles.resumeIcon
            }
          >
            ✓
          </div>

          <div>

            <strong>
              {fileName ||
                "Resume loaded"}
            </strong>

            <p>
              Your analyzed resume is
              ready for personalized
              interview questions.
            </p>

          </div>

        </div>

        {/* GENERATE */}

        <div
          style={
            styles.generateCard
          }
        >

          <div>

            <p
              style={styles.label}
            >
              AI QUESTION GENERATOR
            </p>

            <h2>
              Generate Interview Questions
            </h2>

            <p>
              Gemini will analyze your
              resume and create questions
              based on your projects,
              skills and experience.
            </p>

          </div>

          <button
            type="button"
            onClick={
              handleGenerateQuestions
            }
            disabled={
              loading
            }
            style={{
              ...styles.primaryButton,
              opacity:
                loading
                  ? 0.6
                  : 1
            }}
          >
            {loading
              ? "Generating..."
              : "Generate Questions"}
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={
              styles.successBox
            }
          >
            ✓ {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={
              styles.errorBox
            }
          >

            <strong>
              Unable to generate questions
            </strong>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* QUESTION HEADER */}

        <div
          style={
            styles.sectionHeader
          }
        >

          <div>

            <p
              style={styles.label}
            >
              QUESTION SET
            </p>

            <h2>
              Generated Questions
            </h2>

          </div>

          <span
            style={
              styles.questionCount
            }
          >
            {questions.length}
            {" "}
            Questions
          </span>

        </div>

        {/* QUESTIONS */}

        {questions.length === 0 ? (

          <div
            style={
              styles.emptyBox
            }
          >

            <div
              style={
                styles.emptyIcon
              }
            >
              AI
            </div>

            <h3>
              No Questions Generated
            </h3>

            <p>
              Click "Generate Questions"
              to create personalized
              questions from your resume.
            </p>

          </div>

        ) : (

          <div
            style={
              styles.questions
            }
          >

            {questions.map(
              (
                question,
                index
              ) => (

                <div
                  key={index}
                  style={
                    styles.questionCard
                  }
                >

                  <div
                    style={
                      styles.questionNumber
                    }
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div>

                    <p
                      style={
                        styles.questionLabel
                      }
                    >
                      INTERVIEW QUESTION
                    </p>

                    <p
                      style={
                        styles.questionText
                      }
                    >
                      {question}
                    </p>

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* ACTIONS */}

        <div
          style={
            styles.actions
          }
        >

          <button
            type="button"
            onClick={
              handleBack
            }
            style={
              styles.secondaryButton
            }
          >
            Back to Dashboard
          </button>

          {questions.length > 0 && (

            <button
              type="button"
              onClick={
                handleStartInterview
              }
              style={
                styles.primaryButton
              }
            >
              Start Interview →
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  container: {
    width: "1100px",
    maxWidth: "100%",
    margin: "0 auto"
  },

  header: {
    textAlign: "center",
    marginBottom: "35px"
  },

  label: {
    margin: "0 0 8px",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px"
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "36px"
  },

  subtitle: {
    color: "#64748B",
    fontSize: "16px",
    lineHeight: "1.7"
  },

  resumeCard: {
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  },

  resumeIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#DCFCE7",
    color: "#15803D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800"
  },

  generateCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap"
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "13px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px"
  },

  secondaryButton: {
    background: "#FFFFFF",
    color: "#475569",
    border: "1px solid #CBD5E1",
    padding: "13px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px"
  },

  successBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    background: "#F0FDF4",
    color: "#166534",
    border: "1px solid #BBF7D0"
  },

  errorBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    background: "#FEF2F2",
    color: "#B91C1C",
    border: "1px solid #FECACA"
  },

  sectionHeader: {
    marginTop: "40px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "15px"
  },

  questionCount: {
    background: "#EFF6FF",
    color: "#1D4ED8",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13px"
  },

  questions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  questionCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    gap: "18px",
    alignItems: "flex-start"
  },

  questionNumber: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "8px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800"
  },

  questionLabel: {
    margin: "0 0 5px",
    color: "#94A3B8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px"
  },

  questionText: {
    margin: 0,
    color: "#1E293B",
    fontSize: "15px",
    lineHeight: "1.6"
  },

  emptyBox: {
    background: "#FFFFFF",
    border: "1px dashed #CBD5E1",
    borderRadius: "14px",
    padding: "60px 20px",
    textAlign: "center"
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontWeight: "800"
  },

  actions: {
    marginTop: "30px",
    paddingTop: "25px",
    borderTop: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px"
  }
};

export default ResumeQuestions;