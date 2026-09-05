import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LanguageSelection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const languages = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "C",
    "C#",
    "TypeScript",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "Dart",
    "Scala",
    "Groovy",
    "Haskell",
    "Elixir",
    "Lua",
    "R",
    "MATLAB",
    "Perl",
    "Objective-C",
    "Shell",
    "SQL",
    "Assembly",
    "Fortran",
    "COBOL",
    "Pascal",
    "D",
    "Julia",
    "Golang",
    "Bash",
    "PowerShell",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Vue.js",
    "Angular",
    "Django",
    "Flutter",
    "Solidity",
    "Kotlin",
    "JavaFX",
    "Spring",
    "Clojure",
  ];

  const filteredLanguages =
    languages.filter((language) =>
      language
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const handleLanguageClick = (
    languageName
  ) => {
    navigate("/interview-setup", {
      state: {
        language: {
          id: languageName.toLowerCase(),
          name: languageName,
          category: "Programming",
        },
      },
    });
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>
            <p style={styles.label}>
              TECHNICAL INTERVIEW
            </p>

            <h1 style={styles.title}>
              Choose a Programming Language
            </h1>

            <p style={styles.subtitle}>
              Select any programming language
              to start your AI-powered
              technical interview.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.dashboardButton}
          >
            ← Dashboard
          </button>

        </div>

        {/* SEARCH */}

        <div style={styles.searchBox}>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search programming language..."
            style={styles.searchInput}
          />

        </div>

        <p style={styles.count}>
          {filteredLanguages.length} languages
          available
        </p>

        {/* LANGUAGE GRID */}

        <div style={styles.grid}>

          {filteredLanguages.map(
            (language, index) => (

              <button
                type="button"
                key={`${language}-${index}`}
                onClick={() =>
                  handleLanguageClick(
                    language
                  )
                }
                style={styles.languageCard}
              >

                <div
                  style={
                    styles.languageIcon
                  }
                >
                  {language
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <h2>
                  {language}
                </h2>

                <span
                  style={styles.selectText}
                >
                  Start Setup →
                </span>

              </button>

            )
          )}

        </div>

        {/* NO RESULTS */}

        {filteredLanguages.length ===
          0 && (
          <div style={styles.noResults}>
            No programming language found.
          </div>
        )}

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "35px 20px",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
  },

  label: {
    margin: "0 0 8px",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "32px",
  },

  subtitle: {
    color: "#64748B",
    fontSize: "14px",
    marginTop: "10px",
  },

  dashboardButton: {
    padding: "11px 18px",
    background: "#FFFFFF",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#334155",
    fontWeight: "600",
  },

  searchBox: {
    marginTop: "35px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px",
    border: "1px solid #CBD5E1",
    borderRadius: "9px",
    background: "#FFFFFF",
    fontSize: "14px",
    outlineColor: "#2563EB",
  },

  count: {
    color: "#64748B",
    fontSize: "13px",
    margin: "15px 0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px",
  },

  languageCard: {
    minHeight: "150px",
    padding: "20px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "11px",
    cursor: "pointer",
    textAlign: "left",
    transition:
      "transform 0.2s ease, border-color 0.2s ease",
  },

  languageIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
  },

  selectText: {
    color: "#2563EB",
    fontSize: "12px",
    fontWeight: "600",
  },

  noResults: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
    color: "#64748B",
  },

};

export default LanguageSelection;