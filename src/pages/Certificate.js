import React from "react";
import { useNavigate } from "react-router-dom";

function Certificate() {
  const navigate = useNavigate();

  // ============================
  // GET USER
  // ============================

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("Unable to load user:", error);
  }

  const username =
    localStorage.getItem("username") ||
    user.username ||
    user.name ||
    user.fullName ||
    "Candidate";

  // ============================
  // GET SCORE FOR CERTIFICATE ID
  // ============================

  const interviewScore = Number(
    localStorage.getItem("mockInterviewScore") || 0
  );

  // ============================
  // DATE
  // ============================

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  // ============================
  // CERTIFICATE ID
  // ============================

  const cleanUsername = String(username)
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

  const certificateId = `AIP-${today.getFullYear()}-${cleanUsername}-${interviewScore}`;

  // ============================
  // PRINT
  // ============================

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`

        /* ==============================
           PRINT SETTINGS
        ============================== */

        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {

          html,
          body {
            width: 297mm !important;
            height: 210mm !important;

            margin: 0 !important;
            padding: 0 !important;

            background: white !important;

            overflow: hidden !important;
          }

          body * {
            visibility: hidden;
          }

          .certificate-container,
          .certificate-container * {
            visibility: visible;
          }

          .certificate-actions {
            display: none !important;
          }

          .certificate-page {
            position: absolute !important;

            top: 0 !important;
            left: 0 !important;

            width: 297mm !important;
            height: 210mm !important;

            min-height: 0 !important;

            padding: 0 !important;
            margin: 0 !important;

            background: white !important;

            overflow: hidden !important;
          }

          .certificate-container {
            position: absolute !important;

            top: 5mm !important;
            left: 5mm !important;

            width: 287mm !important;
            height: 200mm !important;

            max-width: none !important;

            margin: 0 !important;
            padding: 3mm !important;

            box-sizing: border-box !important;

            background: white !important;

            box-shadow: none !important;

            overflow: hidden !important;

            break-inside: avoid !important;
            page-break-inside: avoid !important;

            break-after: avoid !important;
            page-break-after: avoid !important;
          }

          .certificate-gold-border {
            height: 100% !important;

            box-sizing: border-box !important;

            padding: 2mm !important;
          }

          .certificate-content {
            height: 100% !important;

            box-sizing: border-box !important;

            padding: 8mm 16mm 6mm !important;

            overflow: hidden !important;
          }

          .certificate-logo {
            width: 42px !important;
            height: 42px !important;

            font-size: 14px !important;

            margin-bottom: 5px !important;
          }

          .certificate-brand {
            font-size: 10px !important;
            margin: 0 !important;
          }

          .certificate-brand-subtitle {
            font-size: 8px !important;
            margin: 3px 0 0 !important;
          }

          .certificate-gold-line {
            margin: 8px auto 10px !important;
          }

          .certificate-label {
            font-size: 8px !important;
            margin: 0 0 4px !important;
          }

          .certificate-title {
            font-size: 31px !important;

            margin: 3px 0 10px !important;
          }

          .certificate-presented {
            font-size: 12px !important;

            margin: 0 0 5px !important;
          }

          .certificate-name {
            font-size: 30px !important;

            margin: 5px 0 !important;
          }

          .certificate-name-line {
            margin-bottom: 10px !important;
          }

          .certificate-description {
            font-size: 10px !important;

            line-height: 1.4 !important;

            margin: 3px auto !important;
          }

          .certificate-program {
            font-size: 20px !important;

            margin: 5px 0 !important;
          }

          .certificate-decoration {
            margin: 10px auto 6px !important;
          }

          .certificate-seal {
            width: 58px !important;
            height: 58px !important;

            margin: 6px auto 12px !important;

            padding: 3px !important;
          }

          .certificate-seal-star {
            font-size: 15px !important;
          }

          .certificate-seal-text {
            font-size: 5px !important;
          }

          .certificate-footer {
            margin: 5px auto 0 !important;

            gap: 80px !important;
          }

          .certificate-signature-name {
            font-size: 10px !important;
          }

          .certificate-signature-label {
            font-size: 7px !important;

            margin-top: 3px !important;
          }

          .certificate-bottom {
            margin-top: 10px !important;

            padding-top: 7px !important;
          }

          .certificate-id {
            font-size: 7px !important;

            margin: 0 0 3px !important;
          }

          .certificate-bottom-text {
            font-size: 7px !important;
          }
        }


        /* ==============================
           MOBILE
        ============================== */

        @media screen and (max-width: 700px) {

          .certificate-content {
            padding: 35px 20px !important;
          }

          .certificate-footer {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }

          .certificate-title {
            font-size: 34px !important;
          }

          .certificate-name {
            font-size: 34px !important;
          }

        }

        `}
      </style>

      <div
        className="certificate-page"
        style={styles.page}
      >
        {/* ============================
            BUTTONS
        ============================ */}

        <div
          className="certificate-actions"
          style={styles.actions}
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={styles.backButton}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={styles.downloadButton}
          >
            Download Certificate
          </button>
        </div>

        {/* ============================
            CERTIFICATE
        ============================ */}

        <div
          className="certificate-container"
          style={styles.certificate}
        >
          <div
            className="certificate-gold-border"
            style={styles.goldBorder}
          >
            <div
              className="certificate-content"
              style={styles.content}
            >

              {/* ============================
                  LOGO / BRAND
              ============================ */}

              <div style={styles.brandSection}>

                <div
                  className="certificate-logo"
                  style={styles.logoCircle}
                >
                  AI
                </div>

                <h3
                  className="certificate-brand"
                  style={styles.brand}
                >
                  AI INTERVIEW PLATFORM
                </h3>

                <p
                  className="certificate-brand-subtitle"
                  style={styles.brandSubtitle}
                >
                  Interview Preparation & Assessment
                </p>

              </div>

              <div
                className="certificate-gold-line"
                style={styles.smallGoldLine}
              />

              {/* ============================
                  TITLE
              ============================ */}

              <p
                className="certificate-label"
                style={styles.credentialText}
              >
                CERTIFICATE
              </p>

              <h1
                className="certificate-title"
                style={styles.title}
              >
                Certificate of Achievement
              </h1>

              <p
                className="certificate-presented"
                style={styles.presentedText}
              >
                This certificate is proudly presented to
              </p>

              {/* ============================
                  CANDIDATE
              ============================ */}

              <h2
                className="certificate-name"
                style={styles.name}
              >
                {username}
              </h2>

              <div
                className="certificate-name-line"
                style={styles.nameUnderline}
              />

              {/* ============================
                  DESCRIPTION
              ============================ */}

              <p
                className="certificate-description"
                style={styles.description}
              >
                in recognition of successfully completing
                the
              </p>

              <h2
                className="certificate-program"
                style={styles.program}
              >
                AI Mock Interview Assessment
              </h2>

              <p
                className="certificate-description"
                style={styles.description}
              >
                as part of the AI Interview Preparation
                Program, demonstrating commitment to
                professional development, interview
                preparation and continuous learning.
              </p>

              {/* ============================
                  DECORATION
              ============================ */}

              <div
                className="certificate-decoration"
                style={styles.decorativeSection}
              >
                <div style={styles.decorativeLine} />

                <span style={styles.decorativeStar}>
                  ★
                </span>

                <div style={styles.decorativeLine} />
              </div>

              {/* ============================
                  VERIFIED SEAL
              ============================ */}

              <div
                className="certificate-seal"
                style={styles.seal}
              >
                <div style={styles.sealInner}>

                  <span
                    className="certificate-seal-star"
                    style={styles.sealStar}
                  >
                    ★
                  </span>

                  <span
                    className="certificate-seal-text"
                    style={styles.sealText}
                  >
                    VERIFIED
                  </span>

                </div>
              </div>

              {/* ============================
                  FOOTER
              ============================ */}

              <div
                className="certificate-footer"
                style={styles.footer}
              >

                {/* AUTHORITY */}

                <div style={styles.signature}>

                  <div style={styles.signatureLine} />

                  <strong
                    className="certificate-signature-name"
                    style={styles.signatureName}
                  >
                    AI Interview Platform
                  </strong>

                  <p
                    className="certificate-signature-label"
                    style={styles.signatureLabel}
                  >
                    Assessment Authority
                  </p>

                </div>

                {/* DATE */}

                <div style={styles.dateSection}>

                  <div style={styles.signatureLine} />

                  <strong
                    className="certificate-signature-name"
                    style={styles.signatureName}
                  >
                    {formattedDate}
                  </strong>

                  <p
                    className="certificate-signature-label"
                    style={styles.signatureLabel}
                  >
                    Date of Issue
                  </p>

                </div>

              </div>

              {/* ============================
                  CERTIFICATE ID
              ============================ */}

              <div
                className="certificate-bottom"
                style={styles.bottom}
              >
                <p
                  className="certificate-id"
                  style={styles.certificateId}
                >
                  Certificate ID: {certificateId}
                </p>

                <p
                  className="certificate-bottom-text"
                  style={styles.bottomText}
                >
                  Issued by AI Interview Platform upon
                  successful participation in the AI Mock
                  Interview Assessment.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#F1F5F9,#EFF6FF,#F8FAFC)",

    padding: "30px",

    boxSizing: "border-box",
  },


  // ============================
  // BUTTONS
  // ============================

  actions: {
    maxWidth: "1120px",

    margin: "0 auto 20px",

    display: "flex",

    justifyContent: "flex-end",

    gap: "12px",

    flexWrap: "wrap",
  },


  backButton: {
    padding: "12px 22px",

    background: "#475569",

    color: "#FFFFFF",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px",
  },


  downloadButton: {
    padding: "12px 24px",

    background: "#173B7A",

    color: "#FFFFFF",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px",
  },


  // ============================
  // CERTIFICATE
  // ============================

  certificate: {
    maxWidth: "1120px",

    margin: "auto",

    background: "#FFFFFF",

    padding: "12px",

    boxShadow:
      "0 20px 60px rgba(15,23,42,0.12)",
  },


  goldBorder: {
    border: "2px solid #B8860B",

    padding: "7px",
  },


  content: {
    border: "5px solid #173B7A",

    padding: "45px 65px",

    textAlign: "center",

    position: "relative",

    boxSizing: "border-box",

    background:
      "linear-gradient(135deg,#FFFFFF 0%,#FFFEF8 50%,#FFFFFF 100%)",
  },


  // ============================
  // BRAND
  // ============================

  brandSection: {
    marginBottom: "10px",
  },


  logoCircle: {
    width: "52px",

    height: "52px",

    margin: "0 auto 10px",

    borderRadius: "50%",

    background: "#173B7A",

    color: "#FFFFFF",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontWeight: "700",

    fontSize: "17px",

    letterSpacing: "1px",
  },


  brand: {
    color: "#173B7A",

    letterSpacing: "4px",

    fontSize: "12px",

    margin: "0",
  },


  brandSubtitle: {
    color: "#64748B",

    fontSize: "10px",

    marginTop: "6px",

    letterSpacing: "1px",
  },


  smallGoldLine: {
    width: "55px",

    height: "3px",

    background: "#B8860B",

    margin: "15px auto 22px",
  },


  // ============================
  // TITLE
  // ============================

  credentialText: {
    color: "#B8860B",

    fontWeight: "700",

    letterSpacing: "6px",

    fontSize: "11px",

    marginBottom: "8px",
  },


  title: {
    color: "#173B7A",

    fontFamily: "Georgia, serif",

    fontSize: "44px",

    fontWeight: "500",

    margin: "5px 0 22px",
  },


  presentedText: {
    color: "#64748B",

    fontSize: "16px",

    marginBottom: "8px",
  },


  // ============================
  // NAME
  // ============================

  name: {
    color: "#173B7A",

    fontFamily: "Georgia, serif",

    fontSize: "42px",

    fontWeight: "500",

    margin: "12px 0 8px",
  },


  nameUnderline: {
    width: "320px",

    maxWidth: "80%",

    height: "1px",

    background: "#B8860B",

    margin: "0 auto 22px",
  },


  // ============================
  // DESCRIPTION
  // ============================

  description: {
    color: "#475569",

    fontSize: "15px",

    lineHeight: "1.6",

    margin: "6px auto",

    maxWidth: "750px",
  },


  program: {
    color: "#173B7A",

    fontFamily: "Georgia, serif",

    fontSize: "27px",

    margin: "10px 0",
  },


  // ============================
  // DECORATION
  // ============================

  decorativeSection: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "15px",

    maxWidth: "420px",

    margin: "25px auto 15px",
  },


  decorativeLine: {
    height: "1px",

    background: "#D4AF37",

    flex: 1,
  },


  decorativeStar: {
    color: "#B8860B",

    fontSize: "16px",
  },


  // ============================
  // VERIFIED SEAL
  // ============================

  seal: {
    width: "78px",

    height: "78px",

    borderRadius: "50%",

    border: "3px solid #B8860B",

    margin: "15px auto 22px",

    padding: "4px",

    boxSizing: "border-box",
  },


  sealInner: {
    width: "100%",

    height: "100%",

    borderRadius: "50%",

    background: "#173B7A",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    color: "#FFFFFF",
  },


  sealStar: {
    color: "#D4AF37",

    fontSize: "21px",
  },


  sealText: {
    fontSize: "7px",

    fontWeight: "700",

    letterSpacing: "1.2px",

    marginTop: "3px",
  },


  // ============================
  // FOOTER
  // ============================

  footer: {
    maxWidth: "800px",

    margin: "15px auto 0",

    display: "grid",

    gridTemplateColumns: "1fr 1fr",

    gap: "100px",
  },


  signature: {
    textAlign: "center",
  },


  dateSection: {
    textAlign: "center",
  },


  signatureLine: {
    borderTop: "1px solid #475569",

    marginBottom: "10px",
  },


  signatureName: {
    color: "#1E293B",

    fontSize: "13px",
  },


  signatureLabel: {
    color: "#94A3B8",

    fontSize: "9px",

    marginTop: "5px",
  },


  // ============================
  // BOTTOM
  // ============================

  bottom: {
    marginTop: "22px",

    borderTop: "1px solid #E2E8F0",

    paddingTop: "12px",
  },


  certificateId: {
    color: "#64748B",

    fontSize: "9px",

    fontWeight: "600",

    letterSpacing: "1px",

    marginBottom: "5px",
  },


  bottomText: {
    color: "#94A3B8",

    fontSize: "9px",

    margin: "0",
  },

};

export default Certificate;