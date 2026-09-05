import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AIQuestions() {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // Load saved resume automatically
  // ==========================================

  useEffect(() => {
    const savedResume =
      localStorage.getItem("resumeText");

    const savedFileName =
      localStorage.getItem("resumeFileName");

    if (savedResume) {
      setResumeText(savedResume);
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  // ==========================================
  // Generate Questions
  // ==========================================

  const generateQuestions = async () => {
    if (!resumeText || resumeText.trim() === "") {
      setError(
        "No resume found. Please analyze your resume first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setQuestions([]);

      const response = await axios.post(
        "http://localhost:8080/api/interview/generate-questions",
        {
          resumeText: resumeText,
        }
      );

      console.log(
        "Interview questions response:",
        response.data
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Unable to generate questions."
        );
        return;
      }

      let result = response.data.questions;

      // Gemini returns JSON as a string
      if (typeof result === "string") {
        result = result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        result = JSON.parse(result);
      }

      if (
        result &&
        Array.isArray(result.questions)
      ) {
        setQuestions(result.questions);

        setMessage(
          "Personalized interview questions generated successfully!"
        );
      } else {
        setError(
          "Unexpected response received from AI."
        );
      }

    } catch (error) {
      console.error(
        "Generate Questions Error:",
        error
      );

      if (error.response?.data?.message) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#EEF2FF,#F0F9FF,#FDF2F8)",
        padding: "40px 20px",
      }}
    >

      <div
        style={{
          maxWidth: "950px",
          margin: "auto",
          background: "#FFFFFF",
          padding: "40px",
          borderRadius: "25px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >

          <button
            onClick={() =>
              navigate("/resume-analyzer")
            }
            style={{
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              padding: "10px 15px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← Resume Analyzer
          </button>

        </div>

        <h1
          style={{
            textAlign: "center",
            color: "#1E3A8A",
            marginBottom: "10px",
          }}
        >
          🤖 AI Resume-Based Interview
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          Gemini will analyze your resume and create
          personalized technical interview questions.
        </p>

        {/* RESUME CARD */}

        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              color: "#1E3A8A",
            }}
          >
            📄 Resume Selected
          </h3>

          {resumeText ? (
            <>
              <p
                style={{
                  color: "#166534",
                  marginBottom: "5px",
                }}
              >
                ✅ Resume loaded successfully.
              </p>

              {fileName && (
                <p
                  style={{
                    color: "#64748B",
                    margin: 0,
                  }}
                >
                  File: {fileName}
                </p>
              )}
            </>
          ) : (
            <p
              style={{
                color: "#DC2626",
                margin: 0,
              }}
            >
              ❌ No resume found.
            </p>
          )}

        </div>

        {/* GENERATE BUTTON */}

        <button
          onClick={generateQuestions}
          disabled={loading || !resumeText}
          style={{
            width: "100%",
            padding: "16px",
            background:
              loading || !resumeText
                ? "#94A3B8"
                : "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor:
              loading || !resumeText
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "🤖 AI is analyzing your resume..."
            : "✨ Generate Personalized Questions"}
        </button>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#F0FDF4",
              border:
                "1px solid #BBF7D0",
              borderRadius: "12px",
              color: "#15803D",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#FEF2F2",
              border:
                "1px solid #FECACA",
              borderRadius: "12px",
              color: "#B91C1C",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* QUESTIONS */}

        {questions.length > 0 && (
          <div
            style={{
              marginTop: "35px",
            }}
          >

            <h2
              style={{
                color: "#1E3A8A",
                marginBottom: "20px",
              }}
            >
              🎯 Personalized Interview Questions
            </h2>

            {questions.map(
              (question, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    padding: "20px",
                    background: "#F8FAFC",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius: "15px",
                  }}
                >

                  <div
                    style={{
                      minWidth: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#2563EB",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      lineHeight: "1.7",
                      fontSize: "16px",
                    }}
                  >
                    {question}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default AIQuestions;