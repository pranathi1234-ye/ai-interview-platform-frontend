import React, { useState } from "react";
import axios from "axios";

const questions = [
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description:
      "Write a function that takes a string and returns the string in reverse order.",
    exampleInput: '"hello"',
    exampleOutput: '"olleh"',
    starterCode: `function reverseString(str) {
  // Write your code here
}`
  },

  {
    id: "palindrome",
    title: "Palindrome Check",
    difficulty: "Easy",
    description:
      "Write a function that checks whether a given string is a palindrome.",
    exampleInput: '"madam"',
    exampleOutput: "true",
    starterCode: `function isPalindrome(str) {
  // Write your code here
}`
  },

  {
    id: "factorial",
    title: "Factorial",
    difficulty: "Easy",
    description:
      "Write a function that returns the factorial of a given number.",
    exampleInput: "5",
    exampleOutput: "120",
    starterCode: `function factorial(n) {
  // Write your code here
}`
  },

  {
    id: "fibonacci",
    title: "Fibonacci Series",
    difficulty: "Easy",
    description:
      "Write a function that returns the first n numbers of the Fibonacci series.",
    exampleInput: "5",
    exampleOutput: "[0, 1, 1, 2, 3]",
    starterCode: `function fibonacci(n) {
  // Write your code here
}`
  },

  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of numbers and a target, return the indices of two numbers that add up to the target.",
    exampleInput: "[2, 7, 11, 15], target = 9",
    exampleOutput: "[0, 1]",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
}`
  }
];

function CodingPractice() {

  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);

  const [code, setCode] = useState(
    questions[0].starterCode
  );

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const selectQuestion = (question) => {

    setSelectedQuestion(question);

    setCode(question.starterCode);

    setResult(null);
  };

  const runCode = async () => {

    if (!code.trim()) {

      setResult({
        passed: false,
        message: "Please write some code first."
      });

      return;
    }

    setLoading(true);

    setResult(null);

    try {

      const response = await axios.post(
        "https://ai-interview-platform-backend-production.up.railway.app/api/coding/run",
        {
          questionId: selectedQuestion.id,
          code: code
        }
      );

      setResult({
        passed: response.data.passed,
        message: response.data.message
      });

    } catch (error) {

      console.error(error);

      setResult({
        passed: false,
        message:
          "Unable to connect to the coding server. Please make sure Spring Boot is running."
      });

    } finally {

      setLoading(false);
    }
  };

  const resetCode = () => {

    setCode(selectedQuestion.starterCode);

    setResult(null);
  };

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Coding Practice
          </h1>

          <p style={styles.subtitle}>
            Improve your programming skills with easy coding challenges
          </p>

        </div>

      </div>


      {/* MAIN CONTENT */}

      <div style={styles.container}>

        {/* LEFT SIDE */}

        <div style={styles.sidebar}>

          <h2 style={styles.sidebarTitle}>
            Problems
          </h2>

          {questions.map((question, index) => (

            <div
              key={question.id}
              onClick={() => selectQuestion(question)}
              style={{
                ...styles.questionItem,

                ...(selectedQuestion.id === question.id
                  ? styles.selectedQuestion
                  : {})
              }}
            >

              <div style={styles.questionNumber}>
                {index + 1}
              </div>

              <div>

                <div style={styles.questionTitle}>
                  {question.title}
                </div>

                <div style={styles.difficulty}>
                  {question.difficulty}
                </div>

              </div>

            </div>

          ))}

        </div>


        {/* RIGHT SIDE */}

        <div style={styles.content}>

          {/* QUESTION */}

          <div style={styles.questionCard}>

            <div style={styles.questionHeader}>

              <h2 style={styles.problemTitle}>
                {selectedQuestion.title}
              </h2>

              <span style={styles.easyBadge}>
                {selectedQuestion.difficulty}
              </span>

            </div>

            <p style={styles.description}>
              {selectedQuestion.description}
            </p>


            {/* EXAMPLE */}

            <div style={styles.exampleBox}>

              <h3 style={styles.exampleTitle}>
                Example
              </h3>

              <p>
                <strong>Input:</strong>{" "}
                {selectedQuestion.exampleInput}
              </p>

              <p>
                <strong>Output:</strong>{" "}
                {selectedQuestion.exampleOutput}
              </p>

            </div>

          </div>


          {/* CODE EDITOR */}

          <div style={styles.editorCard}>

            <div style={styles.editorHeader}>

              <span style={styles.editorTitle}>
                JavaScript
              </span>

              <button
                onClick={resetCode}
                style={styles.resetButton}
              >
                Reset
              </button>

            </div>


            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.editor}
              spellCheck="false"
            />


            <div style={styles.buttonContainer}>

              <button
                onClick={runCode}
                disabled={loading}
                style={styles.runButton}
              >

                {loading
                  ? "Running..."
                  : "▶ Run Code"}

              </button>

            </div>


            {/* RESULT */}

            {result && (

              <div
                style={{
                  ...styles.resultBox,

                  ...(result.passed
                    ? styles.successResult
                    : styles.failureResult)
                }}
              >

                <div style={styles.resultTitle}>

                  {result.passed
                    ? "✓ Accepted"
                    : "✗ Not Accepted"}

                </div>

                <div style={styles.resultMessage}>
                  {result.message}
                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================
   STYLES
========================= */

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "40px"
  },

  header: {
    backgroundColor: "#ffffff",
    padding: "25px 40px",
    borderBottom: "1px solid #e5e7eb"
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#1f2937"
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px"
  },

  container: {
    display: "flex",
    gap: "25px",
    maxWidth: "1250px",
    margin: "30px auto",
    padding: "0 20px"
  },

  sidebar: {
    width: "280px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    height: "fit-content"
  },

  sidebarTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "20px",
    color: "#1f2937"
  },

  questionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f8fafc"
  },

  selectedQuestion: {
    backgroundColor: "#e8f0ff",
    borderLeft: "4px solid #2563eb"
  },

  questionNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "bold"
  },

  questionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937"
  },

  difficulty: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#16a34a"
  },

  content: {
    flex: 1
  },

  questionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "20px"
  },

  questionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  problemTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#111827"
  },

  easyBadge: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  },

  description: {
    marginTop: "18px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#4b5563"
  },

  exampleBox: {
    marginTop: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "16px"
  },

  exampleTitle: {
    marginTop: 0,
    color: "#1f2937",
    fontSize: "16px"
  },

  editorCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },

  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },

  editorTitle: {
    fontWeight: "bold",
    color: "#374151"
  },

  resetButton: {
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  editor: {
    width: "100%",
    height: "320px",
    boxSizing: "border-box",
    resize: "vertical",
    backgroundColor: "#111827",
    color: "#f9fafb",
    border: "none",
    borderRadius: "8px",
    padding: "18px",
    fontSize: "14px",
    fontFamily: "Consolas, monospace",
    lineHeight: "1.6",
    outline: "none"
  },

  buttonContainer: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "flex-end"
  },

  runButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "11px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },

  resultBox: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "8px"
  },

  successResult: {
    backgroundColor: "#dcfce7",
    border: "1px solid #86efac"
  },

  failureResult: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5"
  },

  resultTitle: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "5px"
  },

  resultMessage: {
    fontSize: "14px"
  }

};

export default CodingPractice;