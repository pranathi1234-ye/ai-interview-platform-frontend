import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import axios from "axios";

function MockInterview() {

  const navigate =
    useNavigate();

  const [
    questions,
    setQuestions
  ] = useState([]);

  const [
    currentQuestion,
    setCurrentQuestion
  ] = useState(0);

  const [
    answers,
    setAnswers
  ] = useState([]);

  const [
    scores,
    setScores
  ] = useState([]);

  const [
    feedback,
    setFeedback
  ] = useState([]);

  const [
    suggestions,
    setSuggestions
  ] = useState([]);

  const [
    answer,
    setAnswer
  ] = useState("");

  const [
    evaluation,
    setEvaluation
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    evaluating,
    setEvaluating
  ] = useState(false);

  const [
    completed,
    setCompleted
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  // =========================================================
  // LOAD QUESTIONS
  // =========================================================

  useEffect(() => {

    try {

      const savedQuestions =
        localStorage.getItem(
          "resumeInterviewQuestions"
        );

      if (!savedQuestions) {

        setError(
          "No interview questions found. Please generate resume questions first."
        );

        setLoading(false);

        return;
      }

      const parsed =
        JSON.parse(
          savedQuestions
        );

      if (
        !Array.isArray(parsed) ||
        parsed.length === 0
      ) {

        setError(
          "No valid interview questions found."
        );

        setLoading(false);

        return;
      }

      const cleanedQuestions =
        parsed
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
          .filter(Boolean);

      if (
        cleanedQuestions.length === 0
      ) {

        setError(
          "No valid interview questions found."
        );

        setLoading(false);

        return;
      }

      setQuestions(
        cleanedQuestions
      );

      setAnswers(
        Array(
          cleanedQuestions.length
        ).fill("")
      );

      setScores(
        Array(
          cleanedQuestions.length
        ).fill(null)
      );

      setFeedback(
        Array(
          cleanedQuestions.length
        ).fill("")
      );

      setSuggestions(
        Array(
          cleanedQuestions.length
        ).fill("")
      );

      setLoading(false);

    } catch (error) {

      console.error(
        "Question loading error:",
        error
      );

      setError(
        "Unable to load interview questions."
      );

      setLoading(false);
    }

  }, []);

  // =========================================================
  // SAVE CURRENT ANSWER
  // =========================================================

  const saveCurrentAnswer =
    (value) => {

      setAnswer(
        value
      );

      setAnswers(
        (previous) => {

          const updated =
            [...previous];

          updated[
            currentQuestion
          ] = value;

          localStorage.setItem(
            "mockInterviewAnswers",
            JSON.stringify(
              updated.map(
                (
                  item,
                  index
                ) => ({
                  question:
                    questions[index],
                  answer:
                    item
                })
              )
            )
          );

          return updated;
        }
      );
    };

  // =========================================================
  // EVALUATE ANSWER
  // =========================================================

  const evaluateAnswer =
    async () => {

      if (
        !answer.trim()
      ) {

        setError(
          "Please enter an answer before submitting."
        );

        return null;
      }

      try {

        setEvaluating(
          true
        );

        setError("");

        const response =
          await axios.post(
            "http://https://ai-interview-platform-backend-production.up.railway.app/api/interview/evaluate-answer",
            {
              question:
                questions[
                  currentQuestion
                ],

              answer:
                answer
            }
          );

        if (
          !response.data?.success
        ) {

          throw new Error(
            response.data?.message ||
            "Unable to evaluate answer."
          );
        }

        let result =
          response.data.evaluation;

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

          result =
            JSON.parse(
              result
            );
        }

        const score =
          Math.max(
            0,
            Math.min(
              10,
              Number(
                result.score
              ) || 0
            )
          );

        const finalEvaluation = {
          question:
            questions[
              currentQuestion
            ],

          answer:
            answer,

          score:
            score,

          feedback:
            result.feedback ||
            "No feedback provided.",

          suggestion:
            result.suggestion ||
            "No suggestion provided."
        };

        setScores(
          (previous) => {

            const updated =
              [...previous];

            updated[
              currentQuestion
            ] = score;

            return updated;
          }
        );

        setFeedback(
          (previous) => {

            const updated =
              [...previous];

            updated[
              currentQuestion
            ] =
              finalEvaluation.feedback;

            return updated;
          }
        );

        setSuggestions(
          (previous) => {

            const updated =
              [...previous];

            updated[
              currentQuestion
            ] =
              finalEvaluation.suggestion;

            return updated;
          }
        );

        setEvaluation(
          finalEvaluation
        );

        return finalEvaluation;

      } catch (error) {

        console.error(
          "Evaluation error:",
          error
        );

        setError(
          error.response?.data?.message ||
          error.message ||
          "Unable to evaluate answer."
        );

        return null;

      } finally {

        setEvaluating(
          false
        );
      }
    };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNext =
    async () => {

      let currentScore =
        scores[
          currentQuestion
        ];

      if (
        currentScore === null ||
        currentScore === undefined
      ) {

        const result =
          await evaluateAnswer();

        if (!result) {
          return;
        }

        currentScore =
          result.score;
      }

      if (
        currentQuestion <
        questions.length - 1
      ) {

        setCurrentQuestion(
          (previous) =>
            previous + 1
        );

        setAnswer("");

        setEvaluation(
          null
        );

        setError("");

        return;
      }

      finishInterview();
    };

  // =========================================================
  // FINISH
  // =========================================================

  const finishInterview =
    () => {

      const finalScores =
        [...scores];

      if (
        finalScores[
          currentQuestion
        ] === null ||
        finalScores[
          currentQuestion
        ] === undefined
      ) {

        finalScores[
          currentQuestion
        ] = 0;
      }

      const validScores =
        finalScores.filter(
          (score) =>
            score !== null &&
            score !== undefined
        );

      if (
        validScores.length === 0
      ) {

        setError(
          "No evaluated answers found."
        );

        return;
      }

      const total =
        validScores.reduce(
          (
            sum,
            score
          ) =>
            sum +
            Number(score),
          0
        );

      const average =
        total /
        validScores.length;

      const percentage =
        Math.round(
          average * 10
        );

      const answerObjects =
        questions.map(
          (
            question,
            index
          ) => ({
            question:
              question,

            answer:
              answers[index] ||
              "",

            score:
              finalScores[index] ??
              0,

            feedback:
              feedback[index] ||
              "",

            suggestion:
              suggestions[index] ||
              ""
          })
        );

      localStorage.setItem(
        "mockInterviewAnswers",
        JSON.stringify(
          answerObjects
        )
      );

      localStorage.setItem(
        "mockInterviewScore",
        String(
          percentage
        )
      );

      localStorage.setItem(
        "completedInterviewType",
        "Resume-Based Interview"
      );

      localStorage.setItem(
        "completedInterviewSource",
        "resume"
      );

      // =====================================================
      // INTERVIEW HISTORY
      // =====================================================

      const history =
        JSON.parse(
          localStorage.getItem(
            "interviewHistory"
          ) || "[]"
        );

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        );

      const username =
        localStorage.getItem(
          "username"
        ) ||
        user.name ||
        "Candidate";

      const historyItem = {
        subject:
          "Resume Interview",

        score:
          percentage,

        answered:
          answers.filter(
            (item) =>
              item &&
              item.trim() !== ""
          ).length,

        totalQuestions:
          questions.length,

        date:
          new Date().toISOString()
      };

      history.push(
        historyItem
      );

      localStorage.setItem(
        "interviewHistory",
        JSON.stringify(
          history
        )
      );

      // =====================================================
      // SAVE SCORE TO DATABASE
      // =====================================================

      axios.post(
        "http://https://ai-interview-platform-backend-production.up.railway.app/api/scores",
        {
          username:
            username,

          subject:
            "Resume Interview",

          score:
            percentage
        }
      ).catch(
        (error) => {

          console.error(
            "Unable to save score:",
            error
          );
        }
      );

      setCompleted(
        true
      );
    };

  // =========================================================
  // RESTART
  // =========================================================

  const restartInterview =
    () => {

      setCurrentQuestion(
        0
      );

      setAnswer(
        ""
      );

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

      setEvaluation(
        null
      );

      setCompleted(
        false
      );

      setError("");

      localStorage.removeItem(
        "mockInterviewAnswers"
      );

      localStorage.removeItem(
        "mockInterviewScore"
      );
    };

  // =========================================================
  // DASHBOARD
  // =========================================================

  const goToDashboard =
    () => {

      navigate(
        "/dashboard"
      );
    };

  // =========================================================
  // QUESTIONS
  // =========================================================

  const goToQuestions =
    () => {

      navigate(
        "/resume-questions"
      );
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div
        style={
          styles.centerPage
        }
      >

        <div
          style={
            styles.loadingCard
          }
        >

          <div
            style={
              styles.loadingIcon
            }
          >
            AI
          </div>

          <h2>
            Loading Interview...
          </h2>

          <p>
            Preparing your personalized
            interview questions.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // NO QUESTIONS / ERROR
  // =========================================================

  if (
    questions.length === 0
  ) {

    return (
      <div
        style={
          styles.centerPage
        }
      >

        <div
          style={
            styles.errorCard
          }
        >

          <div
            style={
              styles.errorIcon
            }
          >
            !
          </div>

          <h2>
            Interview Not Ready
          </h2>

          <p>
            {error ||
              "Please generate resume-based questions first."}
          </p>

          <div
            style={
              styles.actionRow
            }
          >

            <button
              type="button"
              onClick={
                goToQuestions
              }
              style={
                styles.primaryButton
              }
            >
              Generate Questions
            </button>

            <button
              type="button"
              onClick={
                goToDashboard
              }
              style={
                styles.secondaryButton
              }
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // COMPLETED
  // =========================================================

  if (completed) {

    const validScores =
      scores.filter(
        (score) =>
          score !== null &&
          score !== undefined
      );

    const total =
      validScores.reduce(
        (
          sum,
          score
        ) =>
          sum +
          Number(score),
        0
      );

    const average =
      validScores.length > 0
        ? total /
          validScores.length
        : 0;

    const percentage =
      Math.round(
        average * 10
      );

    return (
      <div
        style={
          styles.page
        }
      >

        <div
          style={
            styles.container
          }
        >

          <div
            style={
              styles.completedCard
            }
          >

            <div
              style={
                styles.completedIcon
              }
            >
              ✓
            </div>

            <p
              style={styles.label}
            >
              INTERVIEW COMPLETED
            </p>

            <h1>
              Great Job!
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Your resume-based AI interview
              has been completed.
            </p>

            <div
              style={
                styles.finalScoreCard
              }
            >

              <span>
                FINAL SCORE
              </span>

              <strong>
                {percentage}%
              </strong>

              <small>
                Average:{" "}
                {average.toFixed(
                  1
                )}
                /10
              </small>

            </div>

            <div
              style={
                styles.statsGrid
              }
            >

              <div
                style={
                  styles.statCard
                }
              >

                <strong>
                  {questions.length}
                </strong>

                <span>
                  Questions
                </span>

              </div>

              <div
                style={
                  styles.statCard
                }
              >

                <strong>
                  {
                    validScores.length
                  }
                </strong>

                <span>
                  Evaluated
                </span>

              </div>

              <div
                style={
                  styles.statCard
                }
              >

                <strong>
                  {
                    validScores.filter(
                      (score) =>
                        score >= 7
                    ).length
                  }
                </strong>

                <span>
                  Strong Answers
                </span>

              </div>

            </div>

            <div
              style={
                styles.review
              }
            >

              <h2>
                Answer Review
              </h2>

              {questions.map(
                (
                  question,
                  index
                ) => (

                  <div
                    key={index}
                    style={
                      styles.reviewCard
                    }
                  >

                    <div
                      style={
                        styles.reviewTop
                      }
                    >

                      <strong>
                        Q{index + 1}
                      </strong>

                      <span>
                        {scores[index] ??
                          0}
                        /10
                      </span>

                    </div>

                    <p>
                      {question}
                    </p>

                    {answers[
                      index
                    ] && (
                      <div
                        style={
                          styles.reviewAnswer
                        }
                      >
                        <strong>
                          Your Answer
                        </strong>

                        <p>
                          {
                            answers[
                              index
                            ]
                          }
                        </p>
                      </div>
                    )}

                    {feedback[
                      index
                    ] && (
                      <div
                        style={
                          styles.feedback
                        }
                      >

                        <strong>
                          Feedback
                        </strong>

                        <p>
                          {
                            feedback[
                              index
                            ]
                          }
                        </p>

                      </div>
                    )}

                    {suggestions[
                      index
                    ] && (
                      <div
                        style={
                          styles.suggestion
                        }
                      >

                        <strong>
                          Suggestion
                        </strong>

                        <p>
                          {
                            suggestions[
                              index
                            ]
                          }
                        </p>

                      </div>
                    )}

                  </div>

                )
              )}

            </div>

            <div
              style={
                styles.actionRow
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
                Try Again
              </button>

              <button
                type="button"
                onClick={
                  goToQuestions
                }
                style={
                  styles.secondaryButton
                }
              >
                View Questions
              </button>

              <button
                type="button"
                onClick={
                  goToDashboard
                }
                style={
                  styles.primaryButton
                }
              >
                Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN INTERVIEW
  // =========================================================

  const question =
    questions[
      currentQuestion
    ];

  const progress =
    Math.round(
      (
        (currentQuestion + 1) /
        questions.length
      ) * 100
    );

  return (
    <div
      style={
        styles.page
      }
    >

      <div
        style={
          styles.container
        }
      >

        {/* HEADER */}

        <div
          style={
            styles.headerRow
          }
        >

          <div>

            <p
              style={styles.label}
            >
              AI MOCK INTERVIEW
            </p>

            <h1>
              Resume-Based Interview
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Answer each question clearly.
              Your response will be evaluated
              by AI.
            </p>

          </div>

          <button
            type="button"
            onClick={
              goToQuestions
            }
            style={
              styles.secondaryButton
            }
          >
            ← Questions
          </button>

        </div>

        {/* PROGRESS */}

        <div
          style={
            styles.progressCard
          }
        >

          <div
            style={
              styles.progressHeader
            }
          >

            <span>
              Question{" "}
              {currentQuestion + 1}
              {" "}
              of{" "}
              {questions.length}
            </span>

            <span>
              {progress}%
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
                width:
                  `${progress}%`
              }}
            />

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div
            style={
              styles.errorBox
            }
          >
            {error}
          </div>
        )}

        {/* QUESTION */}

        <div
          style={
            styles.questionCard
          }
        >

          <div
            style={
              styles.questionHeader
            }
          >

            <span>
              QUESTION{" "}
              {currentQuestion + 1}
            </span>

            <span>
              Resume Interview
            </span>

          </div>

          <h2>
            {question}
          </h2>

        </div>

        {/* ANSWER */}

        {!evaluation && (

          <div
            style={
              styles.answerCard
            }
          >

            <label>
              YOUR ANSWER
            </label>

            <textarea
              value={
                answer
              }
              onChange={
                (event) =>
                  saveCurrentAnswer(
                    event.target.value
                  )
              }
              placeholder="Type your answer here..."
              disabled={
                evaluating
              }
              style={
                styles.textarea
              }
            />

            <div
              style={
                styles.answerFooter
              }
            >

              <span>
                {
                  answer.length
                }
                {" "}
                characters
              </span>

              <button
                type="button"
                onClick={
                  evaluateAnswer
                }
                disabled={
                  evaluating ||
                  !answer.trim()
                }
                style={{
                  ...styles.primaryButton,
                  opacity:
                    evaluating ||
                    !answer.trim()
                      ? 0.6
                      : 1
                }}
              >
                {evaluating
                  ? "AI Evaluating..."
                  : "Submit Answer →"}
              </button>

            </div>

          </div>
        )}

        {/* EVALUATION */}

        {evaluation && (

          <div
            style={
              styles.evaluationCard
            }
          >

            <div
              style={
                styles.evaluationHeader
              }
            >

              <div>

                <p
                  style={
                    styles.label
                  }
                >
                  AI EVALUATION
                </p>

                <h2>
                  Your Answer Score
                </h2>

              </div>

              <div
                style={
                  styles.scoreCircle
                }
              >

                {
                  evaluation.score
                }

                <small>
                  /10
                </small>

              </div>

            </div>

            <div
              style={
                styles.feedback
              }
            >

              <h3>
                Feedback
              </h3>

              <p>
                {
                  evaluation.feedback
                }
              </p>

            </div>

            <div
              style={
                styles.suggestion
              }
            >

              <h3>
                How to Improve
              </h3>

              <p>
                {
                  evaluation.suggestion
                }
              </p>

            </div>

            <div
              style={
                styles.reviewAnswer
              }
            >

              <strong>
                Your Answer
              </strong>

              <p>
                {
                  evaluation.answer
                }
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleNext
              }
              style={
                styles.nextButton
              }
            >
              {currentQuestion <
              questions.length - 1
                ? "Next Question →"
                : "Finish Interview →"}
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
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  centerPage: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  container: {
    width: "1050px",
    maxWidth: "100%",
    margin: "0 auto"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "25px"
  },

  label: {
    margin: "0 0 8px",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px"
  },

  subtitle: {
    color: "#64748B",
    lineHeight: "1.7"
  },

  loadingCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "60px",
    textAlign: "center",
    maxWidth: "500px"
  },

  loadingIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontWeight: "800"
  },

  errorCard: {
    background: "#FFFFFF",
    border: "1px solid #FECACA",
    borderRadius: "16px",
    padding: "45px",
    textAlign: "center",
    maxWidth: "600px"
  },

  errorIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#FEE2E2",
    color: "#B91C1C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontWeight: "800",
    fontSize: "25px"
  },

  progressCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "20px"
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "10px"
  },

  progressTrack: {
    height: "7px",
    background: "#E2E8F0",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progressBar: {
    height: "100%",
    background: "#2563EB",
    borderRadius: "10px",
    transition: "width 0.3s ease"
  },

  errorBox: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px"
  },

  questionCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "30px",
    marginBottom: "20px"
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    color: "#64748B",
    fontSize: "12px",
    fontWeight: "700"
  },

  answerCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "25px"
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    boxSizing: "border-box",
    marginTop: "10px",
    padding: "16px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    resize: "vertical",
    fontSize: "15px",
    lineHeight: "1.7"
  },

  answerFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
    gap: "15px"
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "13px 23px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700"
  },

  secondaryButton: {
    background: "#FFFFFF",
    color: "#475569",
    border: "1px solid #CBD5E1",
    padding: "13px 23px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700"
  },

  evaluationCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    padding: "30px"
  },

  evaluationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  scoreCircle: {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800"
  },

  feedback: {
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "15px"
  },

  suggestion: {
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "15px"
  },

  reviewAnswer: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px"
  },

  nextButton: {
    width: "100%",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700"
  },

  completedCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "45px"
  },

  completedIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#DCFCE7",
    color: "#15803D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    fontSize: "30px",
    fontWeight: "800"
  },

  finalScoreCard: {
    background: "#EFF6FF",
    borderRadius: "14px",
    padding: "25px",
    textAlign: "center",
    maxWidth: "260px",
    margin: "30px auto"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    marginBottom: "30px"
  },

  statCard: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },

  review: {
    marginTop: "30px"
  },

  reviewCard: {
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "12px"
  },

  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  actionRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "30px"
  }
};

export default MockInterview;