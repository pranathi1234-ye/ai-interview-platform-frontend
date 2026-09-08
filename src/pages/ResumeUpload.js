import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResumeUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
    ];

    const fileName =
      selectedFile.name.toLowerCase();

    const validExtension =
      allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!validExtension) {
      setMessage(
        "Please select a PDF, DOC or DOCX file."
      );

      setUploaded(false);

      return false;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setMessage(
        "The selected resume exceeds the 5 MB file size limit."
      );

      setUploaded(false);

      return false;
    }

    return true;
  };

  const selectFile = (selectedFile) => {
    setMessage("");
    setUploaded(false);

    if (!validateFile(selectedFile)) {
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    selectFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const selectedFile =
      event.dataTransfer.files?.[0];

    selectFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setUploaded(false);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploaded(false);

      setMessage(
        "Select a resume before uploading."
      );

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploading(true);
      setUploaded(false);
      setMessage("");

      const response = await axios.post(
        "https://ai-interview-platform-backend-production.up.railway.app/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Resume upload response:",
        response.data
      );

      setUploaded(true);

      setMessage(
        response.data?.message ||
          "Resume uploaded successfully."
      );

      localStorage.setItem(
        "uploadedResume",
        JSON.stringify({
          originalFileName:
            response.data?.originalFileName ||
            file.name,

          storedFileName:
            response.data?.storedFileName ||
            "",

          uploadedAt:
            new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setUploaded(false);

      if (!error.response) {
        setMessage(
          "Unable to connect to the server. Make sure the Spring Boot backend is running on port 8080."
        );
      } else if (
        error.response?.data?.message
      ) {
        setMessage(
          error.response.data.message
        );
      } else if (
        error.response?.status === 413
      ) {
        setMessage(
          "The resume is too large to upload."
        );
      } else if (
        error.response?.status === 404
      ) {
        setMessage(
          "The resume upload API could not be found."
        );
      } else {
        setMessage(
          "Resume upload failed. Please try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const sizeInKB = bytes / 1024;

    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }

    return `${(
      sizeInKB / 1024
    ).toFixed(2)} MB`;
  };

  const getFileExtension = () => {
    if (!file) {
      return "CV";
    }

    const parts = file.name.split(".");

    if (parts.length < 2) {
      return "CV";
    }

    return parts[
      parts.length - 1
    ].toUpperCase();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              RESUME
            </p>

            <h1 style={styles.title}>
              Upload Resume
            </h1>

            <p style={styles.subtitle}>
              Upload your resume to prepare
              personalised interview questions
              based on your skills, projects and
              experience.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.dashboardButton}
          >
            Back to Dashboard
          </button>
        </div>

        {/* PROCESS */}

        <div style={styles.steps}>
          <Step
            number="01"
            title="Upload"
            description="Select your resume"
            active
          />

          <div style={styles.stepLine} />

          <Step
            number="02"
            title="Process"
            description="Resume analysis"
            active={uploaded}
          />

          <div style={styles.stepLine} />

          <Step
            number="03"
            title="Interview"
            description="Generate questions"
            active={uploaded}
          />
        </div>

        <div style={styles.contentGrid}>

          {/* LEFT SIDE */}

          <div style={styles.uploadCard}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.eyebrow}>
                  DOCUMENT
                </p>

                <h2 style={styles.cardTitle}>
                  Resume Document
                </h2>
              </div>

              <div style={styles.documentCode}>
                CV
              </div>
            </div>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                style={{
                  ...styles.dropZone,

                  borderColor: dragging
                    ? "#2563EB"
                    : "#CBD5E1",

                  background: dragging
                    ? "#EFF6FF"
                    : "#F8FAFC",
                }}
              >
                <div style={styles.uploadMark}>
                  UP
                </div>

                <h3 style={styles.dropTitle}>
                  Upload your resume
                </h3>

                <p style={styles.dropText}>
                  Drag and drop your document here,
                  or click to browse your computer.
                </p>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    fileInputRef.current?.click();
                  }}
                  style={styles.browseButton}
                >
                  Browse Files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{
                    display: "none",
                  }}
                />

                <div style={styles.fileRules}>
                  <span>
                    PDF, DOC, DOCX
                  </span>

                  <span>
                    Maximum 5 MB
                  </span>
                </div>
              </div>
            ) : (
              <div style={styles.selectedFile}>
                <div style={styles.fileTop}>
                  <div style={styles.fileIcon}>
                    {getFileExtension()}
                  </div>

                  <div style={styles.fileDetails}>
                    <p style={styles.fileLabel}>
                      SELECTED DOCUMENT
                    </p>

                    <h3 style={styles.fileName}>
                      {file.name}
                    </h3>

                    <p style={styles.fileMeta}>
                      {formatFileSize(
                        file.size
                      )}{" "}
                      ·{" "}
                      {getFileExtension()}{" "}
                      document
                    </p>
                  </div>

                  {!uploading && (
                    <button
                      type="button"
                      onClick={removeFile}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={styles.fileStatus}>
                  <span style={styles.statusDot} />

                  <span>
                    File ready for upload
                  </span>
                </div>
              </div>
            )}

            {file && !uploaded && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  ...styles.uploadButton,

                  opacity: uploading
                    ? 0.65
                    : 1,

                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {uploading
                  ? "Uploading Resume..."
                  : "Upload and Continue"}
              </button>
            )}

            {/* MESSAGE */}

            {message && (
              <div
                style={
                  uploaded
                    ? styles.successMessage
                    : styles.errorMessage
                }
              >
                <p style={styles.messageLabel}>
                  {uploaded
                    ? "UPLOAD COMPLETE"
                    : "UPLOAD STATUS"}
                </p>

                <strong>
                  {uploaded
                    ? "Resume uploaded successfully"
                    : "Unable to upload resume"}
                </strong>

                <p style={styles.messageText}>
                  {message}
                </p>
              </div>
            )}

            {/* SUCCESS ACTION */}

            {uploaded && (
              <div style={styles.successActions}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/resume-questions"
                    )
                  }
                  style={styles.primaryButton}
                >
                  Generate Interview Questions
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/resume-analyzer"
                    )
                  }
                  style={styles.secondaryButton}
                >
                  Analyse Resume
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}

          <div style={styles.sideColumn}>
            <div style={styles.infoCard}>
              <p style={styles.eyebrow}>
                HOW IT WORKS
              </p>

              <h3 style={styles.infoTitle}>
                Resume-based preparation
              </h3>

              <p style={styles.infoDescription}>
                Your resume helps the platform
                create interview preparation
                tailored to your profile.
              </p>

              <InfoItem
                number="01"
                title="Upload resume"
                description="Select a supported resume document."
              />

              <InfoItem
                number="02"
                title="Analyse profile"
                description="Identify relevant skills, projects and experience."
              />

              <InfoItem
                number="03"
                title="Generate questions"
                description="Prepare interview questions based on your resume."
              />
            </div>

            <div style={styles.requirementsCard}>
              <p style={styles.eyebrow}>
                REQUIREMENTS
              </p>

              <h3 style={styles.infoTitle}>
                File Guidelines
              </h3>

              <Requirement
                label="Formats"
                value="PDF, DOC, DOCX"
              />

              <Requirement
                label="Maximum size"
                value="5 MB"
              />

              <Requirement
                label="Recommended"
                value="PDF"
              />

              <Requirement
                label="Content"
                value="Updated resume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  active,
}) {
  return (
    <div style={styles.step}>
      <div
        style={{
          ...styles.stepNumber,

          background: active
            ? "#2563EB"
            : "#E2E8F0",

          color: active
            ? "#FFFFFF"
            : "#64748B",
        }}
      >
        {number}
      </div>

      <div>
        <strong style={styles.stepTitle}>
          {title}
        </strong>

        <p style={styles.stepDescription}>
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  number,
  title,
  description,
}) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoNumber}>
        {number}
      </div>

      <div>
        <strong style={styles.infoItemTitle}>
          {title}
        </strong>

        <p style={styles.infoItemText}>
          {description}
        </p>
      </div>
    </div>
  );
}

function Requirement({
  label,
  value,
}) {
  return (
    <div style={styles.requirement}>
      <span style={styles.requirementLabel}>
        {label}
      </span>

      <strong style={styles.requirementValue}>
        {value}
      </strong>
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
    maxWidth: "1250px",
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
    maxWidth: "650px",
    margin: "9px 0 0",
    lineHeight: "1.6",
    fontSize: "14px",
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

  steps: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "18px 25px",
  },

  step: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "160px",
  },

  stepNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "9px",
    fontWeight: "800",
  },

  stepTitle: {
    fontSize: "12px",
  },

  stepDescription: {
    margin: "3px 0 0",
    color: "#94A3B8",
    fontSize: "9px",
  },

  stepLine: {
    flex: 1,
    height: "1px",
    background: "#E2E8F0",
    margin: "0 20px",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,2fr) minmax(280px,1fr)",
    gap: "20px",
  },

  uploadCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "25px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
  },

  documentCode: {
    width: "40px",
    height: "40px",
    background: "#EFF6FF",
    color: "#2563EB",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "11px",
  },

  dropZone: {
    border: "2px dashed #CBD5E1",
    borderRadius: "12px",
    padding: "50px 25px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.2s",
  },

  uploadMark: {
    width: "52px",
    height: "52px",
    margin: "0 auto 16px",
    borderRadius: "10px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "10px",
  },

  dropTitle: {
    margin: 0,
    fontSize: "17px",
  },

  dropText: {
    maxWidth: "420px",
    margin: "9px auto 20px",
    color: "#64748B",
    lineHeight: "1.6",
    fontSize: "12px",
  },

  browseButton: {
    padding: "11px 20px",
    background: "#FFFFFF",
    border: "1px solid #CBD5E1",
    color: "#334155",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "650",
  },

  fileRules: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "20px",
    color: "#94A3B8",
    fontSize: "10px",
  },

  selectedFile: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "20px",
  },

  fileTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  fileIcon: {
    minWidth: "50px",
    height: "50px",
    borderRadius: "9px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "800",
  },

  fileDetails: {
    flex: 1,
    minWidth: 0,
  },

  fileLabel: {
    color: "#2563EB",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
    margin: "0 0 5px",
  },

  fileName: {
    margin: 0,
    fontSize: "14px",
    wordBreak: "break-word",
  },

  fileMeta: {
    color: "#94A3B8",
    fontSize: "10px",
    margin: "5px 0 0",
  },

  removeButton: {
    background: "transparent",
    border: "none",
    color: "#DC2626",
    cursor: "pointer",
    fontWeight: "650",
    fontSize: "11px",
  },

  fileStatus: {
    marginTop: "17px",
    paddingTop: "15px",
    borderTop: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#15803D",
    fontSize: "11px",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22C55E",
  },

  uploadButton: {
    width: "100%",
    marginTop: "20px",
    padding: "13px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
  },

  successMessage: {
    marginTop: "20px",
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    borderRadius: "9px",
    padding: "17px",
    color: "#166534",
  },

  errorMessage: {
    marginTop: "20px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "9px",
    padding: "17px",
    color: "#B91C1C",
  },

  messageLabel: {
    margin: "0 0 5px",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  messageText: {
    margin: "6px 0 0",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  successActions: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563EB",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "650",
  },

  secondaryButton: {
    padding: "12px 18px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    background: "#FFFFFF",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "650",
  },

  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  infoCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  infoTitle: {
    margin: "0 0 8px",
    fontSize: "16px",
  },

  infoDescription: {
    color: "#64748B",
    lineHeight: "1.6",
    fontSize: "11px",
    marginBottom: "22px",
  },

  infoItem: {
    display: "flex",
    gap: "12px",
    padding: "14px 0",
    borderTop: "1px solid #F1F5F9",
  },

  infoNumber: {
    minWidth: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "8px",
    fontWeight: "800",
  },

  infoItemTitle: {
    fontSize: "11px",
  },

  infoItemText: {
    color: "#94A3B8",
    margin: "4px 0 0",
    fontSize: "9px",
    lineHeight: "1.5",
  },

  requirementsCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "22px",
  },

  requirement: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "12px 0",
    borderTop: "1px solid #F1F5F9",
  },

  requirementLabel: {
    color: "#64748B",
    fontSize: "10px",
  },

  requirementValue: {
    color: "#334155",
    fontSize: "10px",
  },
};

export default ResumeUpload;