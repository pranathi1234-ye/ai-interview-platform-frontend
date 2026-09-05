import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function DynamicInterview() {
  const { language: languageParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // LANGUAGE
  // =====================================================

  const selectedLanguage =
    location.state?.language;

  const language =
    selectedLanguage || {
      id: languageParam,
      name: decodeURIComponent(
        languageParam || "Programming"
      ),
      category: "Programming",
    };

  const languageId =
    language.id ||
    languageParam ||
    "programming";

  const languageName =
    language.name ||
    decodeURIComponent(
      languageParam || "Programming"
    );

  // =====================================================
  // INTERVIEW SETUP
  // =====================================================

  const difficulty =
    location.state?.difficulty ||
    "Intermediate";

  const interviewType =
    location.state?.interviewType ||
    "Mixed";

  const numberOfQuestions =
    Number(
      location.state?.numberOfQuestions
    ) || 10;

  // =====================================================
  // STATE
  // =====================================================

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState([]);

  const [scores, setScores] =
    useState([]);

  const [feedback, setFeedback] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [loading, setLoading] =
    useState(true);

  const [evaluating, setEvaluating] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [savingScore, setSavingScore] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // GET USERNAME
  // =====================================================

  const getUsername = () => {
    try {
      const savedUser =
        JSON.parse(
          localStorage.getItem("user") ||
            "{}"
        );

      return (
        localStorage.getItem(
          "username"
        ) ||
        savedUser.name ||
        savedUser.username ||
        savedUser.fullName ||
        "Candidate"
      );
    } catch (error) {
      console.error(
        "Unable to load user:",
        error
      );

      return "Candidate";
    }
  };

  // =====================================================
  // GENERATE QUESTIONS
  // =====================================================

  const generateQuestions =
    useCallback(async () => {
      setLoading(true);
      setError("");
      setCompleted(false);

      try {
        console.log(
          "========================================"
        );

        console.log(
          "Generating interview questions"
        );

        console.log(
          "Language:",
          languageName
        );

        console.log(
          "Difficulty:",
          difficulty
        );

        console.log(
          "Interview Type:",
          interviewType
        );

        console.log(
          "Number of Questions:",
          numberOfQuestions
        );

        console.log(
          "========================================"
        );

        // =================================================
        // BACKEND API
        // =================================================

        const response =
          await fetch(
            "http://localhost:8080/api/interview/generate-questions",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                language:
                  languageName,

                difficulty:
                  difficulty,

                interviewType:
                  interviewType,

                numberOfQuestions:
                  numberOfQuestions,
              }),
            }
          );

        // =================================================
        // READ RESPONSE
        // =================================================

        let data;

        try {
          data =
            await response.json();
        } catch (jsonError) {
          throw new Error(
            "The backend returned an invalid response."
          );
        }

        console.log(
          "Generated questions:",
          data
        );

        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to generate interview questions."
          );
        }

        // =================================================
        // GET QUESTIONS
        // =================================================

        let generated =
          data?.questions;

        // =================================================
        // QUESTIONS RETURNED AS STRING
        // =================================================

        if (
          typeof generated ===
          "string"
        ) {
          try {
            const parsed =
              JSON.parse(
                generated
              );

            generated =
              parsed?.questions ||
              parsed?.data ||
              parsed?.result ||
              parsed;
          } catch (parseError) {
            generated =
              generated
                .split("\n")
                .map((item) =>
                  item
                    .replace(
                      /^\s*\d+[\).\-\s]*/,
                      ""
                    )
                    .trim()
                )
                .filter(Boolean);
          }
        }

        // =================================================
        // NESTED QUESTIONS OBJECT
        // =================================================

        if (
          generated &&
          !Array.isArray(
            generated
          ) &&
          Array.isArray(
            generated.questions
          )
        ) {
          generated =
            generated.questions;
        }

        // =================================================
        // VALIDATE
        // =================================================

        if (
          !Array.isArray(
            generated
          )
        ) {
          throw new Error(
            "The backend did not return a questions array."
          );
        }

        // =================================================
        // CLEAN QUESTIONS
        // =================================================

        const finalQuestions =
          generated
            .map((question) => {
              if (
                typeof question ===
                "string"
              ) {
                return question.trim();
              }

              if (
                question &&
                typeof question ===
                  "object"
              ) {
                return (
                  question.question ||
                  question.text ||
                  question.title ||
                  ""
                ).trim();
              }

              return "";
            })
            .filter(Boolean)
            .slice(
              0,
              numberOfQuestions
            );

        // =================================================
        // CHECK
        // =================================================

        if (
          finalQuestions.length ===
          0
        ) {
          throw new Error(
            "No interview questions were generated."
          );
        }

        // =================================================
        // INITIALIZE INTERVIEW
        // =================================================

        setQuestions(
          finalQuestions
        );

        setAnswers(
          Array(
            finalQuestions.length
          ).fill("")
        );

        setScores(
          Array(
            finalQuestions.length
          ).fill(null)
        );

        setFeedback(
          Array(
            finalQuestions.length
          ).fill("")
        );

        setSuggestions(
          Array(
            finalQuestions.length
          ).fill("")
        );

        setCurrentQuestion(0);

        setTimeLeft(60);

        setError("");

      } catch (err) {
        console.error(
          "Question generation error:",
          err
        );

        setQuestions([]);

        setError(
          err?.message ||
            "Unable to generate interview questions. Please check that the backend is running."
        );

      } finally {
        setLoading(false);
      }
    }, [
      languageName,
      difficulty,
      interviewType,
      numberOfQuestions,
    ]);

  // =====================================================
  // START INTERVIEW
  // =====================================================

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (
      loading ||
      completed ||
      evaluating ||
      questions.length === 0
    ) {
      return undefined;
    }

    if (timeLeft <= 0) {
      handleNext(true);

      return undefined;
    }

    const timer =
      setTimeout(() => {
        setTimeLeft(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearTimeout(timer);

  }, [
    timeLeft,
    loading,
    completed,
    evaluating,
    questions.length,
  ]);

  // =====================================================
  // ANSWER CHANGE
  // =====================================================

  const handleAnswerChange =
    (event) => {
      const updatedAnswers =
        [...answers];

      updatedAnswers[
        currentQuestion
      ] = event.target.value;

      setAnswers(
        updatedAnswers
      );

      setError("");
    };

  // =====================================================
  // EVALUATE ANSWER
  // =====================================================

  const evaluateAnswer =
    async () => {
      const question =
        questions[
          currentQuestion
        ] || "";

      const answer =
        answers[
          currentQuestion
        ]?.trim() || "";

      // -------------------------------------------------
      // EMPTY ANSWER
      // -------------------------------------------------

      if (!answer) {
        return {
          score: 0,

          feedback:
            "No answer was provided.",

          suggestion:
            "Provide an answer before moving to the next question.",
        };
      }

      setEvaluating(true);
      setError("");

      try {
        // =================================================
        // FEEDBACK API
        // =================================================

        const response =
          await fetch(
            "http://localhost:8080/api/feedback/evaluate",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                answers: [
                  {
                    question:
                      question,

                    answer:
                      answer,
                  },
                ],
              }),
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch (jsonError) {
          throw new Error(
            "The backend returned an invalid evaluation response."
          );
        }

        console.log(
          "AI evaluation:",
          data
        );

        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to evaluate answer."
          );
        }

        // =================================================
        // GET EVALUATION
        // =================================================

        let evaluation =
          Array.isArray(data)
            ? data[0]
            : data;

        if (
          evaluation &&
          typeof evaluation ===
            "object" &&
          Array.isArray(
            evaluation.results
          )
        ) {
          evaluation =
            evaluation.results[0];
        }

        if (!evaluation) {
          throw new Error(
            "The backend returned no evaluation."
          );
        }

        // =================================================
        // SCORE
        // =================================================

        let score =
          Number(
            evaluation.score
          );

        if (
          Number.isNaN(score)
        ) {
          score = 0;
        }

        score = Math.max(
          0,
          Math.min(10, score)
        );

        // =================================================
        // FEEDBACK
        // =================================================

        const feedbackText =
          evaluation.feedback ||
          evaluation.feedbackText ||
          evaluation.comment ||
          "No feedback was provided.";

        const suggestionText =
          evaluation.suggestion ||
          evaluation.how_to_improve ||
          evaluation.improvement ||
          "Try to provide a clearer and more complete answer.";

        return {
          score: score,

          feedback:
            feedbackText,

          suggestion:
            suggestionText,
        };

      } catch (err) {
        console.error(
          "Evaluation error:",
          err
        );

        setError(
          err?.message ||
            "Unable to connect to the backend."
        );

        return null;

      } finally {
        setEvaluating(false);
      }
    };

  // =====================================================
  // SAVE SCORE TO MYSQL
  // =====================================================

  const saveScoreToDatabase =
    async (finalScore) => {
      const username =
        getUsername();

      console.log(
        "========================================"
      );

      console.log(
        "Saving interview score to MySQL"
      );

      console.log(
        "Username:",
        username
      );

      console.log(
        "Subject:",
        languageName
      );

      console.log(
        "Score:",
        finalScore
      );

      console.log(
        "========================================"
      );

      const response =
        await fetch(
          "http://localhost:8080/api/scores",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                username,

              subject:
                languageName,

              score:
                finalScore,
            }),
          }
        );

      let data = null;

      try {
        data =
          await response.json();
      } catch (error) {
        console.warn(
          "Score response was not JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save interview score to database."
        );
      }

      console.log(
        "Score saved successfully:",
        data
      );

      return data;
    };

  // =====================================================
  // FINISH INTERVIEW
  // =====================================================

  const finishInterview =
    async (finalScores = scores) => {
      try {
        setSavingScore(true);
        setError("");

        // =================================================
        // CALCULATE SCORE
        // =================================================

        const evaluatedScores =
          finalScores.filter(
            (score) =>
              score !== null
          );

        const total =
          evaluatedScores.reduce(
            (sum, score) =>
              sum + Number(score),
            0
          );

        const average =
          evaluatedScores.length >
          0
            ? total /
              evaluatedScores.length
            : 0;

        const finalScore =
          Math.round(
            average * 10
          );

        // =================================================
        // USER
        // =================================================

        const username =
          getUsername();

        // =================================================
        // SAVE LOCAL STORAGE
        // =================================================

        localStorage.setItem(
          `interview_${languageId}_score`,
          String(finalScore)
        );

        localStorage.setItem(
          `interview_${languageId}_answers`,
          JSON.stringify(
            answers
          )
        );

        localStorage.setItem(
          `interview_${languageId}_scores`,
          JSON.stringify(
            finalScores
          )
        );

        localStorage.setItem(
          `interview_${languageId}_feedback`,
          JSON.stringify(
            feedback
          )
        );

        localStorage.setItem(
          `interview_${languageId}_suggestions`,
          JSON.stringify(
            suggestions
          )
        );

        // =================================================
        // SAVE INTERVIEW HISTORY
        // =================================================

        try {
          const existingHistory =
            JSON.parse(
              localStorage.getItem(
                "interviewHistory"
              ) || "[]"
            );

          const history =
            Array.isArray(
              existingHistory
            )
              ? existingHistory
              : [];

          history.push({
            username:
              username,

            subject:
              languageName,

            languageId:
              languageId,

            difficulty:
              difficulty,

            interviewType:
              interviewType,

            score:
              finalScore,

            averageScore:
              average,

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

        } catch (historyError) {
          console.error(
            "History save error:",
            historyError
          );
        }

        // =================================================
        // SAVE TO SPRING BOOT + MYSQL
        // =================================================

        await saveScoreToDatabase(
          finalScore
        );

        // =================================================
        // COMPLETE
        // =================================================

        setCompleted(true);

        console.log(
          "Interview completed successfully."
        );

      } catch (err) {
        console.error(
          "Finish interview error:",
          err
        );

        setError(
          err?.message ||
            "Unable to save interview result."
        );

      } finally {
        setSavingScore(false);
      }
    };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const handleNext =
    async (fromTimer = false) => {

      if (
        evaluating ||
        savingScore ||
        questions.length === 0
      ) {
        return;
      }

      const answer =
        answers[
          currentQuestion
        ]?.trim() || "";

      // =================================================
      // EMPTY ANSWER
      // =================================================

      if (
        !fromTimer &&
        answer === ""
      ) {
        const shouldSkip =
          window.confirm(
            "You have not entered an answer. Do you want to skip this question?"
          );

        if (!shouldSkip) {
          return;
        }
      }

      // =================================================
      // COPY SCORES
      // =================================================

      let finalScores =
        [...scores];

      // =================================================
      // EVALUATE CURRENT QUESTION
      // =================================================

      if (
        finalScores[
          currentQuestion
        ] === null
      ) {
        const evaluation =
          await evaluateAnswer();

        if (!evaluation) {
          return;
        }

        finalScores[
          currentQuestion
        ] = evaluation.score;

        // ------------------------------------------------
        // UPDATE FEEDBACK
        // ------------------------------------------------

        const updatedFeedback =
          [...feedback];

        updatedFeedback[
          currentQuestion
        ] =
          evaluation.feedback;

        setFeedback(
          updatedFeedback
        );

        // ------------------------------------------------
        // UPDATE SUGGESTION
        // ------------------------------------------------

        const updatedSuggestions =
          [...suggestions];

        updatedSuggestions[
          currentQuestion
        ] =
          evaluation.suggestion;

        setSuggestions(
          updatedSuggestions
        );

        // ------------------------------------------------
        // UPDATE SCORE STATE
        // ------------------------------------------------

        setScores(
          finalScores
        );
      }

      // =================================================
      // GO TO NEXT QUESTION
      // =================================================

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

      // =================================================
      // LAST QUESTION
      // =================================================

      await finishInterview(
        finalScores
      );
    };

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  const handlePrevious =
    () => {
      if (
        currentQuestion ===
          0 ||
        evaluating ||
        savingScore
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

  // =====================================================
  // RESTART INTERVIEW
  // =====================================================

  const restartInterview =
    () => {
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

      setError("");
    };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

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
            Preparing your
            interview
          </h2>

          <p>
            Generating{" "}
            {languageName}{" "}
            interview questions...
          </p>

          <p
            style={
              styles.smallText
            }
          >
            Please wait while
            the AI prepares your
            questions.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPLETED SCREEN
  // =====================================================

  if (completed) {
    const evaluatedScores =
      scores.filter(
        (score) =>
          score !== null
      );

    const total =
      evaluatedScores.reduce(
        (sum, score) =>
          sum + Number(score),
        0
      );

    const average =
      evaluatedScores.length >
      0
        ? total /
          evaluatedScores.length
        : 0;

    const finalScore =
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
            styles.resultContainer
          }
        >
          <p
            style={
              styles.label
            }
          >
            INTERVIEW COMPLETE
          </p>

          <h1
            style={
              styles.resultTitle
            }
          >
            {languageName}{" "}
            Interview Completed
          </h1>

          <p
            style={
              styles.subtitle
            }
          >
            Your answers have
            been evaluated by
            AI.
          </p>

          {/* SCORE */}

          <div
            style={
              styles.scoreCard
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
              {finalScore}%
            </h2>

            <p>
              Average score:{" "}
              {average.toFixed(1)}
              /10
            </p>
          </div>

          {/* STATS */}

          <div
            style={
              styles.stats
            }
          >
            <div
              style={
                styles.stat
              }
            >
              <span>
                Questions
              </span>

              <strong>
                {questions.length}
              </strong>
            </div>

            <div
              style={
                styles.stat
              }
            >
              <span>
                Evaluated
              </span>

              <strong>
                {
                  evaluatedScores.length
                }
              </strong>
            </div>

            <div
              style={
                styles.stat
              }
            >
              <span>
                Skipped
              </span>

              <strong>
                {questions.length -
                  evaluatedScores.length}
              </strong>
            </div>
          </div>

          {/* QUESTION RESULTS */}

          <div
            style={
              styles.questionResults
            }
          >
            <h3>
              Question Scores
            </h3>

            {questions.map(
              (
                question,
                index
              ) => (
                <div
                  key={index}
                  style={
                    styles.questionResult
                  }
                >
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <strong>
                      Question{" "}
                      {index + 1}
                    </strong>

                    <p>
                      {question}
                    </p>

                    {feedback[
                      index
                    ] && (
                      <p
                        style={
                          styles.resultFeedback
                        }
                      >
                        {
                          feedback[
                            index
                          ]
                        }
                      </p>
                    )}

                    {suggestions[
                      index
                    ] && (
                      <p
                        style={
                          styles.resultFeedback
                        }
                      >
                        <strong>
                          Suggestion:
                        </strong>{" "}
                        {
                          suggestions[
                            index
                          ]
                        }
                      </p>
                    )}
                  </div>

                  <strong>
                    {scores[
                      index
                    ] !== null
                      ? `${scores[index]}/10`
                      : "Skipped"}
                  </strong>
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
              onClick={() =>
                navigate(
                  "/languages"
                )
              }
              style={
                styles.primaryButton
              }
            >
              Choose Another
              Language
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO QUESTIONS
  // =====================================================

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
            styles.loadingCard
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
            Unable to start
            interview
          </h2>

          <p>
            {error ||
              "No questions were generated."}
          </p>

          <button
            onClick={
              generateQuestions
            }
            style={
              styles.primaryButton
            }
          >
            Try Again
          </button>

          <button
            onClick={() =>
              navigate(
                "/languages"
              )
            }
            style={{
              ...styles.secondaryButton,
              marginTop: "10px",
              width: "100%",
            }}
          >
            Choose Another
            Language
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  // =====================================================
  // INTERVIEW SCREEN
  // =====================================================

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
            styles.header
          }
        >
          <div>
            <p
              style={
                styles.label
              }
            >
              TECHNICAL INTERVIEW
            </p>

            <h1
              style={
                styles.title
              }
            >
              {languageName}{" "}
              Interview
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              {difficulty} ·{" "}
              {interviewType} ·{" "}
              {questions.length}{" "}
              Questions
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/languages"
              )
            }
            style={
              styles.exitButton
            }
          >
            Exit Interview
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={
              styles.errorBox
            }
          >
            <strong>
              Something went
              wrong
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                setError("")
              }
              style={
                styles.retryButton
              }
            >
              Close
            </button>
          </div>
        )}

        {/* INTERVIEW INFO */}

        <div
          style={
            styles.infoRow
          }
        >
          <div
            style={
              styles.infoItem
            }
          >
            <span>
              QUESTION
            </span>

            <strong>
              {currentQuestion +
                1}{" "}
              / {questions.length}
            </strong>
          </div>

          <div
            style={
              styles.infoItem
            }
          >
            <span>
              TIME REMAINING
            </span>

            <strong
              style={{
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
            style={{
              ...styles.infoItem,
              borderRight:
                "none",
            }}
          >
            <span>
              EVALUATED
            </span>

            <strong>
              {
                scores.filter(
                  (score) =>
                    score !== null
                ).length
              }{" "}
              / {questions.length}
            </strong>
          </div>
        </div>

        {/* PROGRESS */}

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

        {/* QUESTION */}

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
            {
              questions[
                currentQuestion
              ]
            }
          </h2>
        </div>

        {/* AI EVALUATION */}

        {scores[
          currentQuestion
        ] !== null && (
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

              <strong>
                {
                  scores[
                    currentQuestion
                  ]
                }
                /10
              </strong>
            </div>

            <p>
              {
                feedback[
                  currentQuestion
                ]
              }
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

        {/* ANSWER */}

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
            <label>
              Your Answer
            </label>

            <span>
              {
                answers[
                  currentQuestion
                ]?.length || 0
              }{" "}
              characters
            </span>
          </div>

          <textarea
            value={
              answers[
                currentQuestion
              ] || ""
            }
            onChange={
              handleAnswerChange
            }
            disabled={
              evaluating ||
              savingScore ||
              scores[
                currentQuestion
              ] !== null
            }
            placeholder={`Enter your ${languageName} answer here...`}
            style={
              styles.textarea
            }
          />

          <p
            style={
              styles.helpText
            }
          >
            Provide a clear
            explanation and
            include an example
            where appropriate.
          </p>
        </div>

        {/* NAVIGATION */}

        <div
          style={
            styles.navigation
          }
        >
          <button
            onClick={
              handlePrevious
            }
            disabled={
              currentQuestion ===
                0 ||
              evaluating ||
              savingScore
            }
            style={{
              ...styles.previousButton,
              opacity:
                currentQuestion ===
                  0 ||
                evaluating ||
                savingScore
                  ? 0.5
                  : 1,
            }}
          >
            Previous
          </button>

          <button
            onClick={() =>
              handleNext(false)
            }
            disabled={
              evaluating ||
              savingScore
            }
            style={{
              ...styles.nextButton,
              opacity:
                evaluating ||
                savingScore
                  ? 0.7
                  : 1,
            }}
          >
            {savingScore
              ? "Saving Result..."
              : evaluating
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

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  centerPage: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  loadingCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "45px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxSizing: "border-box",
  },

  loadingIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#2563EB",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  errorIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#FEF2F2",
    color: "#DC2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "24px",
  },

  smallText: {
    color: "#94A3B8",
    fontSize: "12px",
  },

  container: {
    maxWidth: "1050px",
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    paddingBottom: "25px",
    borderBottom:
      "1px solid #E2E8F0",
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

  resultTitle: {
    color: "#0F172A",
    fontSize: "30px",
  },

  subtitle: {
    color: "#64748B",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  exitButton: {
    padding: "11px 18px",
    background: "#FFFFFF",
    color: "#475569",
    border:
      "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  errorBox: {
    marginTop: "20px",
    padding: "16px",
    background: "#FEF2F2",
    color: "#B91C1C",
    border:
      "1px solid #FECACA",
    borderRadius: "10px",
  },

  retryButton: {
    padding: "9px 15px",
    background: "#FFFFFF",
    color: "#B91C1C",
    border:
      "1px solid #FCA5A5",
    borderRadius: "7px",
    cursor: "pointer",
  },

  infoRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    marginTop: "28px",
    border:
      "1px solid #E2E8F0",
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

  progressArea: {
    marginTop: "28px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#64748B",
    fontSize: "12px",
    marginBottom: "8px",
  },

  progressTrack: {
    height: "7px",
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
    marginTop: "30px",
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "28px",
  },

  questionLabel: {
    color: "#2563EB",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },

  question: {
    margin: 0,
    color: "#0F172A",
    fontSize: "25px",
    lineHeight: "1.4",
  },

  evaluationBox: {
    marginTop: "20px",
    padding: "20px",
    background: "#EFF6FF",
    border:
      "1px solid #BFDBFE",
    borderRadius: "10px",
  },

  evaluationHeader: {
    display: "flex",
    justifyContent:
      "space-between",
  },

  suggestionBox: {
    marginTop: "15px",
    padding: "14px",
    background: "#FFFFFF",
    borderRadius: "8px",
  },

  answerSection: {
    marginTop: "25px",
  },

  answerHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "8px",
    color: "#334155",
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    padding: "16px",
    boxSizing: "border-box",
    border:
      "1px solid #CBD5E1",
    borderRadius: "10px",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "15px",
    outlineColor: "#2563EB",
  },

  helpText: {
    color: "#94A3B8",
    fontSize: "12px",
  },

  navigation: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "15px",
    marginTop: "25px",
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
    cursor: "pointer",
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
    maxWidth: "900px",
    margin: "30px auto",
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box",
  },

  scoreCard: {
    marginTop: "25px",
    padding: "30px",
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "12px",
    textAlign: "center",
  },

  scoreLabel: {
    color: "#64748B",
    fontSize: "11px",
    fontWeight: "700",
  },

  scoreValue: {
    margin: "8px 0",
    color: "#2563EB",
    fontSize: "50px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "20px",
  },

  stat: {
    padding: "18px",
    border:
      "1px solid #E2E8F0",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  questionResults: {
    marginTop: "30px",
  },

  questionResult: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "20px",
    padding: "16px",
    border:
      "1px solid #E2E8F0",
    borderRadius: "9px",
    marginBottom: "10px",
  },

  resultFeedback: {
    color: "#64748B",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  resultButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
  },

  primaryButton: {
    flex: 1,
    padding: "13px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryButton: {
    flex: 1,
    padding: "13px",
    background: "#FFFFFF",
    color: "#334155",
    border:
      "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default DynamicInterview;