import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // SELECT PDF
  // =========================================================

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    setFile(null);
    setResumeText("");
    setAnalysis(null);
    setMessage("");
    setError("");

    if (!selectedFile) {
      return;
    }

    // PDF only
    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      setError(
        "Please select a PDF resume."
      );

      event.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Resume must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };


  // =========================================================
  // ANALYZE RESUME
  // =========================================================

  const handleAnalyze = async () => {

    if (!file) {
      setError(
        "Please choose your resume first."
      );
      return;
    }

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    try {

      setLoading(true);
      setError("");
      setMessage("");
      setResumeText("");
      setAnalysis(null);

      console.log(
        "Uploading resume..."
      );


      // =====================================================
      // STEP 1
      // EXTRACT PDF TEXT
      // =====================================================

      const extractResponse =
        await axios.post(
          "https://ai-interview-platform-backend-production.up.railway.app/api/resume-analyzer/extract",
          formData
        );


      console.log(
        "Extract response:",
        extractResponse.data
      );


      if (
        !extractResponse.data ||
        extractResponse.data.success !== true
      ) {

        setError(
          extractResponse.data?.message ||
            "Unable to extract resume text."
        );

        return;
      }


      // =====================================================
      // GET EXTRACTED TEXT
      // =====================================================

      const extractedText =
        extractResponse.data.text || "";


      console.log(
        "Extracted resume text length:",
        extractedText.length
      );


      // =====================================================
      // IMPORTANT CHECK
      // =====================================================

      if (
        !extractedText ||
        extractedText.trim().length === 0
      ) {

        setError(
          "The PDF was uploaded, but no readable text was found. Please upload a text-based PDF resume."
        );

        return;
      }


      // =====================================================
      // DISPLAY TEXT
      // =====================================================

      setResumeText(
        extractedText
      );


      // =====================================================
      // SAVE RESUME TEXT
      // =====================================================

      localStorage.setItem(
        "resumeText",
        extractedText
      );


      localStorage.setItem(
        "resumeFileName",
        file.name
      );


      console.log(
        "Resume saved to localStorage."
      );


      // =====================================================
      // VERIFY LOCAL STORAGE
      // =====================================================

      const savedResume =
        localStorage.getItem(
          "resumeText"
        );


      console.log(
        "Saved resume verification:",
        savedResume
          ? `${savedResume.length} characters`
          : "NOT SAVED"
      );


      if (!savedResume) {

        setError(
          "Resume was extracted but could not be saved in the browser."
        );

        return;
      }


      // =====================================================
      // STEP 2
      // AI RESUME ANALYSIS
      // =====================================================

      console.log(
        "Sending resume to Gemini..."
      );


      const aiResponse =
        await axios.post(
          "https://ai-interview-platform-backend-production.up.railway.app/api/resume-analyzer/analyze",
          {
            resumeText:
              extractedText,
          }
        );


      console.log(
        "AI analysis response:",
        aiResponse.data
      );


      if (
        !aiResponse.data ||
        aiResponse.data.success !== true
      ) {

        setError(
          aiResponse.data?.message ||
            "Resume text was extracted, but AI analysis failed."
        );

        return;
      }


      // =====================================================
      // PARSE AI RESULT
      // =====================================================

      let aiResult =
        aiResponse.data.analysis;


      if (
        typeof aiResult === "string"
      ) {

        aiResult = aiResult
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

          aiResult =
            JSON.parse(
              aiResult
            );

        } catch (parseError) {

          console.error(
            "AI JSON parsing error:",
            parseError
          );

          setError(
            "Resume was extracted successfully, but AI analysis returned an invalid format."
          );

          return;
        }
      }


      // =====================================================
      // SAVE ANALYSIS
      // =====================================================

      setAnalysis(
        aiResult
      );


      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(
          aiResult
        )
      );


      // =====================================================
      // SUCCESS
      // =====================================================

      setMessage(
        "Resume analyzed successfully!"
      );


    } catch (error) {

      console.error(
        "Resume Analyzer Error:",
        error
      );


      if (
        error.response
      ) {

        console.error(
          "Backend response:",
          error.response.data
        );

        setError(
          error.response.data?.message ||
            "Backend returned an error."
        );

      } else if (
        error.request
      ) {

        setError(
          "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
        );

      } else {

        setError(
          "Unable to analyze the resume."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // REMOVE RESUME
  // =========================================================

  const removeFile = () => {

    setFile(null);
    setResumeText("");
    setAnalysis(null);
    setMessage("");
    setError("");

    localStorage.removeItem(
      "resumeText"
    );

    localStorage.removeItem(
      "resumeFileName"
    );

    localStorage.removeItem(
      "resumeAnalysis"
    );

    const input =
      document.getElementById(
        "resume-file"
      );

    if (input) {
      input.value = "";
    }
  };


  // =========================================================
  // GO TO QUESTIONS
  // =========================================================

  const goToQuestions = () => {

    const savedResume =
      localStorage.getItem(
        "resumeText"
      );

    if (
      !savedResume ||
      savedResume.trim() === ""
    ) {

      setError(
        "Please analyze your resume before generating interview questions."
      );

      return;
    }

    navigate(
      "/resume-questions"
    );
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>

          <p style={styles.label}>
            RESUME INTELLIGENCE
          </p>

          <h1 style={styles.title}>
            AI Resume Analyzer
          </h1>

          <p style={styles.subtitle}>
            Upload your resume to extract its
            content and prepare it for
            AI-powered interview analysis.
          </p>

        </div>


        {/* UPLOAD BOX */}

        <div style={styles.uploadBox}>

          <div style={styles.uploadIcon}>
            PDF
          </div>

          <h2 style={styles.uploadTitle}>
            Upload Your Resume
          </h2>

          <p style={styles.uploadText}>
            Select a PDF resume up to 5 MB.
          </p>


          <input
            id="resume-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={
              handleFileChange
            }
            style={styles.fileInput}
          />


          {file && (

            <div style={styles.fileBox}>

              <strong>
                {file.name}
              </strong>

              <span>
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)} MB
              </span>

            </div>

          )}


          <div style={styles.buttonRow}>

            <button
              type="button"
              onClick={
                handleAnalyze
              }
              disabled={
                loading ||
                !file
              }
              style={{
                ...styles.primaryButton,

                opacity:
                  loading ||
                  !file
                    ? 0.6
                    : 1,

                cursor:
                  loading ||
                  !file
                    ? "not-allowed"
                    : "pointer",
              }}
            >

              {loading
                ? "Analyzing..."
                : "Analyze Resume"}

            </button>


            {file && (

              <button
                type="button"
                onClick={
                  removeFile
                }
                style={
                  styles.secondaryButton
                }
              >
                Remove
              </button>

            )}

          </div>

        </div>


        {/* SUCCESS */}

        {message && (

          <div style={styles.successBox}>
            ✓ {message}
          </div>

        )}


        {/* ERROR */}

        {error && (

          <div style={styles.errorBox}>

            <strong>
              Resume Analysis Error
            </strong>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* EXTRACTED RESUME */}

        {resumeText && (

          <div style={styles.section}>

            <div style={styles.sectionHeader}>

              <div>

                <p style={styles.label}>
                  EXTRACTED CONTENT
                </p>

                <h2 style={styles.heading}>
                  Resume Content
                </h2>

              </div>

              <span style={styles.badge}>
                Resume Loaded
              </span>

            </div>


            <div style={styles.resumeTextBox}>
              {resumeText}
            </div>

          </div>

        )}


        {/* AI ANALYSIS */}

        {analysis && (

          <div style={styles.section}>

            <p style={styles.label}>
              AI ANALYSIS
            </p>

            <h2 style={styles.heading}>
              Resume Analysis
            </h2>


            <div style={styles.analysisBox}>

              {analysis.score !==
                undefined && (

                <div style={styles.scoreBox}>

                  <span>
                    Resume Score
                  </span>

                  <strong>
                    {analysis.score}
                  </strong>

                  <small>
                    / 100
                  </small>

                </div>

              )}


              {analysis.summary && (

                <div style={styles.analysisItem}>

                  <h3>
                    Summary
                  </h3>

                  <p>
                    {analysis.summary}
                  </p>

                </div>

              )}


              {analysis.skills && (

                <div style={styles.analysisItem}>

                  <h3>
                    Skills
                  </h3>

                  <p>
                    {Array.isArray(
                      analysis.skills
                    )
                      ? analysis.skills.join(
                          ", "
                        )
                      : analysis.skills}
                  </p>

                </div>

              )}

            </div>


            {/* QUESTIONS BUTTON */}

            <button
              type="button"
              onClick={
                goToQuestions
              }
              style={
                styles.questionsButton
              }
            >
              Generate Resume Interview Questions →
            </button>

          </div>

        )}

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
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  container: {
    width: "1100px",
    maxWidth: "100%",
    margin: "0 auto",
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "45px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.06)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    maxWidth: "720px",
    margin:
      "0 auto 40px",
  },

  label: {
    margin:
      "0 0 8px",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing:
      "1.5px",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "36px",
    fontWeight: "650",
  },

  subtitle: {
    color: "#64748B",
    fontSize: "16px",
    lineHeight: "1.7",
    marginTop: "15px",
  },

  uploadBox: {
    border:
      "1px dashed #CBD5E1",
    borderRadius: "14px",
    padding: "40px",
    textAlign: "center",
    background: "#F8FAFC",
  },

  uploadIcon: {
    width: "60px",
    height: "60px",
    margin:
      "0 auto 15px",
    borderRadius: "12px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  uploadTitle: {
    margin:
      "0 0 8px",
    color: "#0F172A",
    fontSize: "22px",
  },

  uploadText: {
    color: "#64748B",
    margin:
      "0 0 25px",
  },

  fileInput: {
    display: "block",
    margin:
      "0 auto 20px",
  },

  fileBox: {
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "inline-flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "20px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding:
      "13px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
  },

  secondaryButton: {
    background: "#FFFFFF",
    color: "#475569",
    border:
      "1px solid #CBD5E1",
    padding:
      "13px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  successBox: {
    marginTop: "20px",
    background: "#F0FDF4",
    color: "#166534",
    border:
      "1px solid #BBF7D0",
    padding: "15px",
    borderRadius: "8px",
  },

  errorBox: {
    marginTop: "20px",
    background: "#FEF2F2",
    color: "#B91C1C",
    border:
      "1px solid #FECACA",
    padding: "15px",
    borderRadius: "8px",
  },

  section: {
    marginTop: "40px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
  },

  heading: {
    margin: 0,
    color: "#0F172A",
    fontSize: "24px",
  },

  badge: {
    background: "#DCFCE7",
    color: "#15803D",
    padding:
      "8px 12px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: "600",
  },

  resumeTextBox: {
    maxHeight: "350px",
    overflowY: "auto",
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "20px",
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    color: "#334155",
    fontSize: "14px",
  },

  analysisBox: {
    marginTop: "20px",
    display: "grid",
    gap: "15px",
  },

  scoreBox: {
    background: "#EFF6FF",
    border:
      "1px solid #BFDBFE",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  analysisItem: {
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "20px",
  },

  questionsButton: {
    marginTop: "25px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding:
      "14px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

};

export default ResumeAnalyzer;