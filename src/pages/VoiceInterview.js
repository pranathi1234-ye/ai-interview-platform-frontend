import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function VoiceInterview() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const questions = [
    "Tell me about yourself.",
    "What is Java?",
    "Explain OOP concepts.",
    "What are your strongest technical skills?",
    "Describe one project you have worked on.",
    "What challenge did you face in your project?",
    "What are your strengths?",
    "What is your weakness?",
    "Why should we hire you?",
    "Where do you see yourself in five years?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill("")
  );

  const [listening, setListening] = useState(false);

  const currentAnswer = answers[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported. Please use Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setAnswers((previousAnswers) => {
        const updatedAnswers = [...previousAnswers];

        updatedAnswers[currentQuestion] = transcript;

        return updatedAnswers;
      });
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was blocked. Please allow microphone access."
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(error);
      setListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      event.target.value;

    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (listening) {
      stopListening();
    }

    if (!currentAnswer.trim()) {
      alert(
        "Please record or type your answer before continuing."
      );

      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(
        (previousQuestion) => previousQuestion + 1
      );
    } else {
      finishInterview();
    }
  };

  const previousQuestion = () => {
    if (listening) {
      stopListening();
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previousQuestion) => previousQuestion - 1
      );
    }
  };

  const finishInterview = () => {
    const answered = answers.filter(
      (answer) => answer.trim() !== ""
    ).length;

    const score = Math.round(
      (answered / questions.length) * 100
    );

    localStorage.setItem(
      "voiceInterviewAnswers",
      JSON.stringify(answers)
    );

    localStorage.setItem(
      "voiceInterviewScore",
      String(score)
    );

    alert(
      `Voice Interview Completed!\nScore: ${score}%`
    );

    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <p style={styles.label}>
              VOICE INTERVIEW
            </p>

            <h1 style={styles.title}>
              AI Voice Interview
            </h1>

            <p style={styles.subtitle}>
              Answer each interview question using your
              microphone or keyboard.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={styles.exitButton}
          >
            Exit Interview
          </button>
        </div>

        <div style={styles.questionInfo}>
          <span>
            Question {currentQuestion + 1} of{" "}
            {questions.length}
          </span>

          <span>
            {Math.round(progress)}% Complete
          </span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
            }}
          />
        </div>

        <div style={styles.questionBox}>
          <p style={styles.questionLabel}>
            QUESTION {currentQuestion + 1}
          </p>

          <h2 style={styles.question}>
            {questions[currentQuestion]}
          </h2>
        </div>

        <div style={styles.voiceBox}>
          <div>
            <h3 style={styles.voiceTitle}>
              Voice Response
            </h3>

            <p style={styles.voiceDescription}>
              Click Start Recording and answer the
              question naturally.
            </p>
          </div>

          {!listening ? (
            <button
              onClick={startListening}
              style={styles.recordButton}
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopListening}
              style={styles.stopButton}
            >
              Stop Recording
            </button>
          )}
        </div>

        {listening && (
          <div style={styles.listening}>
            Recording... Speak now.
          </div>
        )}

        <div style={styles.answerSection}>
          <div style={styles.answerHeader}>
            <label style={styles.answerLabel}>
              Your Answer
            </label>

            <span style={styles.characterCount}>
              {currentAnswer.length} characters
            </span>
          </div>

          <textarea
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder="Your speech will appear here. You can also type your answer."
            rows={7}
            style={styles.textarea}
          />
        </div>

        <div style={styles.navigation}>
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            style={{
              ...styles.previousButton,
              opacity:
                currentQuestion === 0 ? 0.4 : 1,
            }}
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            style={styles.nextButton}
          >
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Save & Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    maxWidth: "950px",
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box",
    boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: "25px",
  },

  label: {
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    margin: "0 0 7px",
  },

  title: {
    color: "#0F172A",
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    color: "#64748B",
    margin: "10px 0 0",
    fontSize: "14px",
  },

  exitButton: {
    background: "#FFFFFF",
    border: "1px solid #CBD5E1",
    color: "#334155",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  questionInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "28px",
    marginBottom: "10px",
    color: "#64748B",
    fontSize: "13px",
    fontWeight: "600",
  },

  progressTrack: {
    height: "8px",
    background: "#E2E8F0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563EB",
    transition: "width 0.3s ease",
  },

  questionBox: {
    marginTop: "30px",
    padding: "28px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
  },

  questionLabel: {
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.4px",
    margin: "0 0 10px",
  },

  question: {
    color: "#0F172A",
    fontSize: "25px",
    margin: 0,
  },

  voiceBox: {
    marginTop: "25px",
    padding: "20px",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  voiceTitle: {
    margin: 0,
    color: "#0F172A",
  },

  voiceDescription: {
    margin: "6px 0 0",
    color: "#64748B",
    fontSize: "13px",
  },

  recordButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  stopButton: {
    background: "#DC2626",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  listening: {
    marginTop: "12px",
    background: "#FEF2F2",
    color: "#B91C1C",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
  },

  answerSection: {
    marginTop: "25px",
  },

  answerHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "9px",
  },

  answerLabel: {
    color: "#334155",
    fontWeight: "600",
  },

  characterCount: {
    color: "#94A3B8",
    fontSize: "12px",
  },

  textarea: {
    width: "100%",
    padding: "18px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "inherit",
    lineHeight: "1.6",
    resize: "vertical",
    boxSizing: "border-box",
  },

  navigation: {
    marginTop: "30px",
    paddingTop: "25px",
    borderTop: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "space-between",
  },

  previousButton: {
    padding: "12px 24px",
    background: "#FFFFFF",
    color: "#334155",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
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
};

export default VoiceInterview;