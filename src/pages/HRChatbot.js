import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HRChatbot.css";

function HRChatbot() {

  const navigate = useNavigate();

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // USER
  // =========================================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const username =
    localStorage.getItem("username") ||
    user.username ||
    user.name ||
    "Candidate";

  // =========================================================
  // COMMON HR QUESTIONS
  // =========================================================

  const suggestions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "What is your biggest weakness?",
    "Where do you see yourself in 5 years?",
    "Why do you want to join our company?",
  ];

  // =========================================================
  // ASK AI
  // =========================================================

  const askAI = async (selectedQuestion) => {

    const finalQuestion =
      typeof selectedQuestion === "string"
        ? selectedQuestion
        : question;

    if (
      !finalQuestion.trim() ||
      loading
    ) {
      return;
    }

    // ---------------------------------------------
    // USER MESSAGE
    // ---------------------------------------------

    const userMessage = {
      role: "user",
      text: finalQuestion.trim(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {

      console.log(
        "Sending HR question to backend:",
        finalQuestion
      );

      // ---------------------------------------------
      // CALL SPRING BOOT
      // ---------------------------------------------

      const response =
        await axios.post(
          "https://ai-interview-platform-backend-production.up.railway.app/api/hr/chat",
          {
            question:
              finalQuestion.trim(),
          }
        );

      console.log(
        "HR backend response:",
        response.data
      );

      // ---------------------------------------------
      // CHECK RESPONSE
      // ---------------------------------------------

      if (!response.data.success) {

        throw new Error(
          response.data.message ||
          "Unable to generate HR response."
        );
      }

      // ---------------------------------------------
      // AI MESSAGE
      // ---------------------------------------------

      const answer =
        response.data.answer;

      const aiMessage = {
        role: "assistant",
        text:
          answer ||
          "No response was generated.",
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

    } catch (error) {

      console.error(
        "HR chatbot error:",
        error
      );

      let errorMessage =
        "I couldn't generate a response.";

      if (error.response) {

        console.error(
          "Backend error:",
          error.response.data
        );

        errorMessage =
          error.response.data?.message ||
          "The backend returned an error.";

      } else if (error.request) {

        errorMessage =
          "Cannot connect to the backend. Please make sure Spring Boot is running on port 8080.";

      } else if (error.message) {

        errorMessage =
          error.message;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: errorMessage,
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      askAI();
    }
  };

  // =========================================================
  // CLEAR CHAT
  // =========================================================

  const clearChat = () => {

    setMessages([]);
    setQuestion("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="hr-page">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="hr-sidebar">

        <div className="hr-brand">

          <div className="hr-logo">
            AI
          </div>

          <div>
            <h2>
              AI Interview
            </h2>

            <p>
              Preparation Platform
            </p>
          </div>

        </div>

        <div className="hr-divider" />

        <p className="hr-menu-title">
          AI ASSISTANT
        </p>

        <div className="hr-active-menu">

          <span className="hr-menu-icon">
            HR
          </span>

          HR Interview Coach

        </div>

        <div className="hr-info-box">

          <p className="hr-small-label">
            CURRENT SESSION
          </p>

          <div className="hr-info-row">

            <span>
              Candidate
            </span>

            <strong>
              {username}
            </strong>

          </div>

          <div className="hr-info-row">

            <span>
              Assistant
            </span>

            <strong>
              HR Coach
            </strong>

          </div>

          <div className="hr-info-row">

            <span>
              Messages
            </span>

            <strong>
              {messages.length}
            </strong>

          </div>

        </div>

        <div className="hr-sidebar-bottom">

          <button
            type="button"
            className="hr-dashboard-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="hr-main">

        <header className="hr-header">

          <div>

            <p className="hr-page-label">
              INTERVIEW PREPARATION
            </p>

            <h1>
              HR Interview Coach
            </h1>

            <p className="hr-description">
              Prepare for common HR questions,
              improve your answers and build
              interview confidence.
            </p>

          </div>

          <button
            type="button"
            className="hr-clear-button"
            onClick={clearChat}
          >
            Clear Chat
          </button>

        </header>

        <div className="hr-content">

          {/* =================================================
              CHAT
          ================================================== */}

          <section className="hr-chat-card">

            <div className="hr-chat-header">

              <div className="hr-ai-avatar">
                AI
              </div>

              <div>

                <h3>
                  HR Interview Assistant
                </h3>

                <p>
                  Ready to help with your
                  interview preparation
                </p>

              </div>

              <span className="hr-online">
                ● Online
              </span>

            </div>

            {/* CHAT AREA */}

            <div className="hr-chat-area">

              {messages.length === 0 && (

                <div className="hr-welcome">

                  <div className="hr-welcome-icon">
                    HR
                  </div>

                  <h2>
                    Prepare for your HR interview
                  </h2>

                  <p>
                    Ask me about HR interview
                    questions, sample answers,
                    strengths, weaknesses,
                    behavioural questions or
                    interview strategy.
                  </p>

                </div>

              )}

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={
                      message.role === "user"
                        ? "hr-message-row hr-user-row"
                        : "hr-message-row"
                    }
                  >

                    {message.role ===
                      "assistant" && (

                      <div className="hr-message-avatar">
                        AI
                      </div>

                    )}

                    <div
                      className={
                        message.role === "user"
                          ? "hr-message hr-user-message"
                          : "hr-message hr-ai-message"
                      }
                    >
                      {message.text}
                    </div>

                  </div>

                )
              )}

              {loading && (

                <div className="hr-message-row">

                  <div className="hr-message-avatar">
                    AI
                  </div>

                  <div className="hr-message hr-ai-message">

                    <div className="hr-thinking">

                      <span />
                      <span />
                      <span />

                    </div>

                  </div>

                </div>

              )}

            </div>

            {/* =================================================
                INPUT
            ================================================== */}

            <div className="hr-input-section">

              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask an HR interview question..."
                disabled={loading}
              />

              <div className="hr-input-footer">

                <span>
                  Enter to send • Shift + Enter
                  for new line
                </span>

                <button
                  type="button"
                  onClick={() =>
                    askAI()
                  }
                  disabled={
                    loading ||
                    !question.trim()
                  }
                >
                  {loading
                    ? "Thinking..."
                    : "Ask AI →"}
                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT PANEL
          ================================================== */}

          <aside className="hr-right-panel">

            <div className="hr-side-card">

              <p className="hr-section-label">
                QUICK PRACTICE
              </p>

              <h3>
                Common HR Questions
              </h3>

              <p className="hr-side-description">
                Select a question to get
                interview guidance and a sample
                response.
              </p>

              <div className="hr-suggestions">

                {suggestions.map(
                  (item, index) => (

                    <button
                      type="button"
                      key={index}
                      onClick={() =>
                        askAI(item)
                      }
                      disabled={loading}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>

            {/* TIP */}

            <div className="hr-tip-card">

              <p className="hr-section-label">
                INTERVIEW TIP
              </p>

              <h3>
                Structure your answers
              </h3>

              <p>
                For behavioural questions,
                use the STAR framework to keep
                your response focused.
              </p>

              <div className="hr-star-item">
                <strong>S</strong>
                <span>
                  Situation
                </span>
              </div>

              <div className="hr-star-item">
                <strong>T</strong>
                <span>
                  Task
                </span>
              </div>

              <div className="hr-star-item">
                <strong>A</strong>
                <span>
                  Action
                </span>
              </div>

              <div className="hr-star-item">
                <strong>R</strong>
                <span>
                  Result
                </span>
              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default HRChatbot;