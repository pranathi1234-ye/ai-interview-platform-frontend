import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Java() {
  const navigate = useNavigate();

  // =========================================================
  // QUESTIONS
  // =========================================================

  const questions = [
    "What is Java?",
    "Explain the main concepts of Object-Oriented Programming.",
    "What is inheritance in Java?",
    "What is polymorphism in Java?",
    "What is abstraction in Java?",
    "What is encapsulation in Java?",
    "What is the difference between JDK, JRE and JVM?",
    "What is the JVM and how does it work?",
    "What is exception handling in Java?",
    "What is multithreading in Java?",
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill("")
  );

  const [scores, setScores] = useState(
    Array(questions.length).fill(null)
  );

  const [feedback, setFeedback] = useState(
    Array(questions.length).fill("")
  );

  const [suggestions, setSuggestions] = useState(
    Array(questions.length).fill("")
  );

  const [timeLeft, setTimeLeft] = useState(60);

  const [completed, setCompleted] = useState(false);

  const [evaluating, setEvaluating] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // CURRENT DATA
  // =========================================================

  const currentAnswer =
    answers[currentQuestion];

  const currentScore =
    scores[currentQuestion];

  const answeredCount =
    scores.filter(
      (score) => score !== null
    ).length;

  // Only count evaluated answers
  const totalScore =
    scores.reduce(
      (total, score) =>
        total + (score || 0),
      0
    );

  const finalScore =
    answeredCount > 0
      ? Math.round(
          (totalScore / answeredCount) * 10
        )
      : 0;

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (completed || evaluating) {
      return;
    }

    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    completed,
    evaluating,
  ]);

  // =========================================================
  // ANSWER CHANGE
  // =========================================================

  const handleAnswerChange = (event) => {
    const updatedAnswers = [
      ...answers,
    ];

    updatedAnswers[currentQuestion] =
      event.target.value;

    setAnswers(updatedAnswers);

    setError("");
  };

  // =========================================================
  // EVALUATE ANSWER WITH SPRING BOOT + GEMINI
  // =========================================================

  const evaluateCurrentAnswer =
    async () => {
      const question =
        questions[currentQuestion];

      const answer =
        answers[currentQuestion].trim();

      setEvaluating(true);
      setError("");

      try {
        console.log(
          "Evaluating Java answer..."
        );

        const response =
          await fetch(
            "http://https://ai-interview-platform-backend-production.up.railway.app/api/interview/evaluate-answer",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                question: question,
                answer: answer,
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "Evaluation response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to evaluate answer."
          );
        }

        /*
         * The backend may return:
         *
         * {
         *   success: true,
         *   evaluation: "{...}"
         * }
         *
         * OR
         *
         * {
         *   success: true,
         *   score: 8,
         *   feedback: "...",
         *   suggestion: "..."
         * }
         */

        let evaluation =
          data.evaluation ||
          data.analysis ||
          data.result ||
          data;

        // ---------------------------------------------
        // Parse JSON string if necessary
        // ---------------------------------------------

        if (
          typeof evaluation ===
          "string"
        ) {
          try {
            evaluation =
              JSON.parse(
                evaluation
              );
          } catch {
            // Gemini may have returned
            // plain text.
            evaluation = {
              score: 5,
              feedback:
                evaluation,
              suggestion:
                "Try to make your answer more complete and technically specific.",
            };
          }
        }

        // ---------------------------------------------
        // Extract score
        // ---------------------------------------------

        let score =
          Number(
            evaluation.score
          );

        if (
          Number.isNaN(score)
        ) {
          score = 0;
        }

        // Keep score between 0 and 10
        score = Math.max(
          0,
          Math.min(10, score)
        );

        // ---------------------------------------------
        // Extract feedback
        // ---------------------------------------------

        const feedbackText =
          evaluation.feedback ||
          evaluation.feedbackText ||
          evaluation.comment ||
          "No detailed feedback was provided.";

        // ---------------------------------------------
        // Extract suggestion
        // ---------------------------------------------

        const suggestionText =
          evaluation.suggestion ||
          evaluation.how_to_improve ||
          evaluation.improvement ||
          "Try to provide a clearer and more complete answer.";

        // ---------------------------------------------
        // Save score
        // ---------------------------------------------

        const updatedScores = [
          ...scores,
        ];

        updatedScores[
          currentQuestion
        ] = score;

        setScores(
          updatedScores
        );

        // ---------------------------------------------
        // Save feedback
        // ---------------------------------------------

        const updatedFeedback =
          [...feedback];

        updatedFeedback[
          currentQuestion
        ] = feedbackText;

        setFeedback(
          updatedFeedback
        );

        // ---------------------------------------------
        // Save suggestion
        // ---------------------------------------------

        const updatedSuggestions =
          [...suggestions];

        updatedSuggestions[
          currentQuestion
        ] = suggestionText;

        setSuggestions(
          updatedSuggestions
        );

        return true;

      } catch (error) {
        console.error(
          "Java answer evaluation error:",
          error
        );

        setError(
          error.message ||
            "Unable to connect to the backend."
        );

        return false;

      } finally {
        setEvaluating(false);
      }
    };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNext = async (
    fromTimer = false
  ) => {
    if (evaluating) {
      return;
    }

    const answer =
      currentAnswer.trim();

    // ---------------------------------------------
    // Empty answer
    // ---------------------------------------------

    if (
      !fromTimer &&
      answer === ""
    ) {
      const skip =
        window.confirm(
          "You have not entered an answer. Do you want to skip this question?"
        );

      if (!skip) {
        return;
      }
    }

    // ---------------------------------------------
    // Evaluate only if not already evaluated
    // ---------------------------------------------

    if (
      scores[currentQuestion] ===
      null
    ) {
      const success =
        await evaluateCurrentAnswer();

      if (!success) {
        return;
      }
    }

    // ---------------------------------------------
    // Move to next question
    // ---------------------------------------------

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setTimeLeft(60);

      setError("");

      return;
    }

    // ---------------------------------------------
    // Finish interview
    // ---------------------------------------------

    finishInterview();
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePrevious = () => {
    if (
      currentQuestion === 0 ||
      evaluating
    ) {
      return;
    }

    setCurrentQuestion(
      (previous) =>
        previous - 1
    );

    setTimeLeft(60);

    setError("");
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const finishInterview = () => {
    const evaluatedScores =
      scores.filter(
        (score) =>
          score !== null
      );

    const total =
      evaluatedScores.reduce(
        (sum, score) =>
          sum + score,
        0
      );

    const average =
      evaluatedScores.length > 0
        ? total /
          evaluatedScores.length
        : 0;

    const percentage =
      Math.round(
        average * 10
      );

    // ---------------------------------------------
    // Save Java score
    // ---------------------------------------------

    localStorage.setItem(
      "javaScore",
      String(percentage)
    );

    // ---------------------------------------------
    // Save answers
    // ---------------------------------------------

    localStorage.setItem(
      "javaAnswers",
      JSON.stringify(
        answers
      )
    );

    // ---------------------------------------------
    // Save AI scores
    // ---------------------------------------------

    localStorage.setItem(
      "javaQuestionScores",
      JSON.stringify(
        scores
      )
    );

    // ---------------------------------------------
    // Save feedback
    // ---------------------------------------------

    localStorage.setItem(
      "javaFeedback",
      JSON.stringify(
        feedback
      )
    );

    // ---------------------------------------------
    // Save suggestions
    // ---------------------------------------------

    localStorage.setItem(
      "javaSuggestions",
      JSON.stringify(
        suggestions
      )
    );

    // ---------------------------------------------
    // Interview history
    // ---------------------------------------------

    const history =
      JSON.parse(
        localStorage.getItem(
          "interviewHistory"
        ) || "[]"
      );

    history.push({
      subject: "Java",

      score: percentage,

      answered:
        evaluatedScores.length,

      totalQuestions:
        questions.length,

      date:
        new Date().toISOString(),
    });

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(
        history
      )
    );

    // ---------------------------------------------
    // Complete
    // ---------------------------------------------

    setCompleted(true);
  };

  // =========================================================
  // RESTART
  // =========================================================

  const restartInterview = () => {
    setAnswers(
      Array(
        questions.length
      ).fill("")
    );

    setScores(
      Array(
        questions.length
      ).fill(null)
    );

    setFeedback(
      Array(
        questions.length
      ).fill("")
    );

    setSuggestions(
      Array(
        questions.length
      ).fill("")
    );

    setCurrentQuestion(0);

    setTimeLeft(60);

    setCompleted(false);

    setEvaluating(false);

    setError("");
  };

  // =========================================================
  // RESULTS PAGE
  // =========================================================

  if (completed) {
    const evaluatedScores =
      scores.filter(
        (score) =>
          score !== null
      );

    const finalAnswered =
      evaluatedScores.length;

    const total =
      evaluatedScores.reduce(
        (sum, score) =>
          sum + score,
        0
      );

    const average =
      finalAnswered > 0
        ? total /
          finalAnswered
        : 0;

    const finalPercentage =
      Math.round(
        average * 10
      );

    return (
      <div style={styles.page}>
        <div
          style={
            styles.resultContainer
          }
        >
          <p
            style={
              styles.pageLabel
            }
          >
            INTERVIEW COMPLETE
          </p>

          <h1
            style={
              styles.resultTitle
            }
          >
            Java Interview Completed
          </h1>

          <p
            style={
              styles.resultSubtitle
            }
          >
            Your interview responses
            have been evaluated by AI.
          </p>

          {/* SCORE */}

          <div
            style={
              styles.resultScore
            }
          >
            <p
              style={
                styles.scoreLabel
              }
            >
              FINAL SCORE
            </p>

            <h2
              style={
                styles.scoreValue
              }
            >
              {finalPercentage}%
            </h2>

            <p
              style={
                styles.scoreDescription
              }
            >
              Average AI score:{" "}
              {average.toFixed(1)}
              /10
            </p>
          </div>

          {/* STATS */}

          <div
            style={
              styles.resultStats
            }
          >
            <div
              style={
                styles.resultStat
              }
            >
              <span
                style={
                  styles.resultStatLabel
                }
              >
                Questions
              </span>

              <strong
                style={
                  styles.resultStatValue
                }
              >
                {questions.length}
              </strong>
            </div>

            <div
              style={
                styles.resultStat
              }
            >
              <span
                style={
                  styles.resultStatLabel
                }
              >
                Evaluated
              </span>

              <strong
                style={
                  styles.resultStatValue
                }
              >
                {finalAnswered}
              </strong>
            </div>

            <div
              style={
                styles.resultStat
              }
            >
              <span
                style={
                  styles.resultStatLabel
                }
              >
                Skipped
              </span>

              <strong
                style={
                  styles.resultStatValue
                }
              >
                {questions.length -
                  finalAnswered}
              </strong>
            </div>
          </div>

          {/* QUESTION SCORES */}

          <div
            style={
              styles.questionResults
            }
          >
            <h3
              style={
                styles.questionResultsTitle
              }
            >
              Question Scores
            </h3>

            {questions.map(
              (question, index) => (
                <div
                  key={index}
                  style={
                    styles.questionResult
                  }
                >
                  <div>
                    <strong>
                      Question{" "}
                      {index + 1}
                    </strong>

                    <p
                      style={
                        styles.questionResultText
                      }
                    >
                      {question}
                    </p>
                  </div>

                  <div
                    style={{
                      ...styles.questionScore,
                      color:
                        scores[index] >= 7
                          ? "#16A34A"
                          : scores[index] >= 4
                          ? "#D97706"
                          : "#DC2626",
                    }}
                  >
                    {scores[index] !== null
                      ? `${scores[index]}/10`
                      : "Skipped"}
                  </div>
                </div>
              )
            )}
          </div>

          {/* BUTTONS */}

          <div
            style={
              styles.resultButtons
            }
          >
            <button
              type="button"
              onClick={
                restartInterview
              }
              style={
                styles.secondaryButton
              }
            >
              Retake Interview
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              style={
                styles.primaryButton
              }
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW PAGE
  // =========================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =================================================
            HEADER
        ================================================== */}

        <div style={styles.header}>
          <div>
            <p
              style={
                styles.pageLabel
              }
            >
              TECHNICAL INTERVIEW
            </p>

            <h1
              style={styles.title}
            >
              Java Interview
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Answer each question clearly
              and concisely. You have 60
              seconds for each question.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            style={
              styles.exitButton
            }
          >
            Exit Interview
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            style={
              styles.errorBox
            }
          >
            <strong>
              Evaluation failed
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                evaluateCurrentAnswer()
              }
              style={
                styles.retryButton
              }
            >
              Retry Evaluation
            </button>
          </div>
        )}

        {/* =================================================
            INTERVIEW INFORMATION
        ================================================== */}

        <div
          style={styles.infoRow}
        >
          <div
            style={styles.infoItem}
          >
            <span
              style={
                styles.infoLabel
              }
            >
              QUESTION
            </span>

            <strong
              style={
                styles.infoValue
              }
            >
              {currentQuestion + 1} /{" "}
              {questions.length}
            </strong>
          </div>

          <div
            style={styles.infoItem}
          >
            <span
              style={
                styles.infoLabel
              }
            >
              TIME REMAINING
            </span>

            <strong
              style={{
                ...styles.infoValue,

                color:
                  timeLeft <= 10
                    ? "#DC2626"
                    : "#0F172A",
              }}
            >
              {timeLeft}s
            </strong>
          </div>

          <div
            style={styles.infoItem}
          >
            <span
              style={
                styles.infoLabel
              }
            >
              EVALUATED
            </span>

            <strong
              style={
                styles.infoValue
              }
            >
              {answeredCount} /{" "}
              {questions.length}
            </strong>
          </div>
        </div>

        {/* =================================================
            PROGRESS
        ================================================== */}

        <div
          style={
            styles.progressArea
          }
        >
          <div
            style={
              styles.progressHeader
            }
          >
            <span>
              Interview Progress
            </span>

            <span>
              {Math.round(
                progress
              )}
              %
            </span>
          </div>

          <div
            style={
              styles.progressTrack
            }
          >
            <div
              style={{
                ...styles.progressBar,

                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* =================================================
            QUESTION
        ================================================== */}

        <div
          style={
            styles.questionSection
          }
        >
          <p
            style={
              styles.questionLabel
            }
          >
            QUESTION{" "}
            {currentQuestion + 1}
          </p>

          <h2
            style={
              styles.question
            }
          >
            {questions[
              currentQuestion
            ]}
          </h2>
        </div>

        {/* =================================================
            PREVIOUS AI EVALUATION
        ================================================== */}

        {currentScore !== null && (
          <div
            style={
              styles.evaluationBox
            }
          >
            <div
              style={
                styles.evaluationHeader
              }
            >
              <strong>
                AI Evaluation
              </strong>

              <span
                style={
                  styles.evaluationScore
                }
              >
                {currentScore}/10
              </span>
            </div>

            <p
              style={
                styles.evaluationText
              }
            >
              {feedback[
                currentQuestion
              ]}
            </p>

            <div
              style={
                styles.suggestionBox
              }
            >
              <strong>
                How to improve
              </strong>

              <p>
                {
                  suggestions[
                    currentQuestion
                  ]
                }
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ANSWER
        ================================================== */}

        <div
          style={
            styles.answerSection
          }
        >
          <div
            style={
              styles.answerHeader
            }
          >
            <label
              style={
                styles.answerLabel
              }
            >
              Your Answer
            </label>

            <span
              style={
                styles.characterCount
              }
            >
              {currentAnswer.length}{" "}
              characters
            </span>
          </div>

          <textarea
            rows={9}
            value={currentAnswer}
            onChange={
              handleAnswerChange
            }
            placeholder={
              "Enter your answer here..."
            }
            disabled={
              evaluating ||
              currentScore !== null
            }
            style={
              styles.textarea
            }
          />

          <p
            style={
              styles.answerHelp
            }
          >
            Provide a clear explanation
            and include an example where
            appropriate.
          </p>
        </div>

        {/* =================================================
            BUTTONS
        ================================================== */}

        <div
          style={
            styles.navigation
          }
        >
          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              currentQuestion === 0 ||
              evaluating
            }
            style={{
              ...styles.previousButton,

              opacity:
                currentQuestion === 0 ||
                evaluating
                  ? 0.45
                  : 1,

              cursor:
                currentQuestion === 0 ||
                evaluating
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() =>
              handleNext(false)
            }
            disabled={
              evaluating
            }
            style={{
              ...styles.nextButton,

              opacity:
                evaluating
                  ? 0.7
                  : 1,
            }}
          >
            {evaluating
              ? "AI Evaluating..."
              : currentQuestion ===
                questions.length - 1
              ? "Finish Interview"
              : "Save & Continue"}
          </button>
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
    padding: "45px 20px",
    boxSizing: "border-box",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    paddingBottom: "28px",
    borderBottom:
      "1px solid #E2E8F0",
  },

  pageLabel: {
    margin: "0 0 8px",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.7px",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#64748B",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  exitButton: {
    padding: "11px 18px",
    background: "#FFFFFF",
    color: "#475569",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  errorBox: {
    marginTop: "20px",
    padding: "16px 18px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    color: "#B91C1C",
  },

  retryButton: {
    marginTop: "10px",
    padding: "9px 14px",
    background: "#FFFFFF",
    border: "1px solid #FCA5A5",
    borderRadius: "7px",
    color: "#B91C1C",
    cursor: "pointer",
    fontWeight: "600",
  },

  infoRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    marginTop: "28px",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  infoItem: {
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    borderRight:
      "1px solid #E2E8F0",
  },

  infoLabel: {
    color: "#64748B",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.2px",
  },

  infoValue: {
    color: "#0F172A",
    fontSize: "18px",
  },

  progressArea: {
    marginTop: "28px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#64748B",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "9px",
  },

  progressTrack: {
    height: "7px",
    width: "100%",
    background: "#E2E8F0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563EB",
    borderRadius: "20px",
    transition:
      "width 0.3s ease",
  },

  questionSection: {
    marginTop: "32px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "28px",
  },

  questionLabel: {
    margin: "0 0 10px",
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.4px",
  },

  question: {
    margin: 0,
    color: "#0F172A",
    fontSize: "25px",
    fontWeight: "600",
    lineHeight: "1.4",
  },

  evaluationBox: {
    marginTop: "20px",
    padding: "22px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "12px",
  },

  evaluationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#1E3A8A",
    fontSize: "16px",
  },

  evaluationScore: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#2563EB",
  },

  evaluationText: {
    color: "#334155",
    lineHeight: "1.6",
    margin:
      "14px 0 0",
  },

  suggestionBox: {
    marginTop: "16px",
    padding: "14px",
    background: "#FFFFFF",
    borderRadius: "8px",
    border:
      "1px solid #DBEAFE",
    color: "#334155",
  },

  answerSection: {
    marginTop: "26px",
  },

  answerHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "9px",
  },

  answerLabel: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: "650",
  },

  characterCount: {
    color: "#94A3B8",
    fontSize: "12px",
  },

  textarea: {
    width: "100%",
    padding: "18px",
    border:
      "1px solid #CBD5E1",
    borderRadius: "10px",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#0F172A",
    outlineColor: "#2563EB",
    boxSizing: "border-box",
  },

  answerHelp: {
    color: "#94A3B8",
    fontSize: "12px",
    margin: "8px 0 0",
  },

  navigation: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "15px",
    marginTop: "30px",
    paddingTop: "25px",
    borderTop:
      "1px solid #E2E8F0",
  },

  previousButton: {
    padding: "12px 22px",
    background: "#FFFFFF",
    color: "#334155",
    border:
      "1px solid #CBD5E1",
    borderRadius: "8px",
    fontWeight: "600",
  },

  nextButton: {
    padding: "12px 25px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  resultContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "50px auto",
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "50px",
    boxSizing: "border-box",
    textAlign: "center",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.06)",
  },

  resultTitle: {
    color: "#0F172A",
    fontSize: "32px",
    margin:
      "5px 0 10px",
  },

  resultSubtitle: {
    color: "#64748B",
    marginBottom: "30px",
  },

  resultScore: {
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "30px",
  },

  scoreLabel: {
    color: "#64748B",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    margin: 0,
  },

  scoreValue: {
    color: "#1E3A8A",
    fontSize: "50px",
    margin: "8px 0",
  },

  scoreDescription: {
    color: "#64748B",
    margin: 0,
  },

  resultStats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "20px",
  },

  resultStat: {
    border:
      "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  resultStatLabel: {
    color: "#64748B",
    fontSize: "11px",
  },

  resultStatValue: {
    color: "#0F172A",
    fontSize: "23px",
  },

  questionResults: {
    marginTop: "25px",
    textAlign: "left",
  },

  questionResultsTitle: {
    color: "#0F172A",
    fontSize: "20px",
    marginBottom: "15px",
  },

  questionResult: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "16px",
    border:
      "1px solid #E2E8F0",
    borderRadius: "9px",
    marginBottom: "10px",
  },

  questionResultText: {
    color: "#64748B",
    fontSize: "13px",
    margin:
      "5px 0 0",
    lineHeight: "1.5",
  },

  questionScore: {
    fontSize: "18px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  resultButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
  },

  primaryButton: {
    flex: 1,
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    flex: 1,
    padding: "13px",
    border:
      "1px solid #CBD5E1",
    borderRadius: "8px",
    background: "#FFFFFF",
    color: "#334155",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Java;