import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// ============================================================
// AUTHENTICATION
// ============================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// ============================================================
// DASHBOARD
// ============================================================

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Analytics from "./pages/Analytics";

// ============================================================
// LANGUAGE SELECTION
// ============================================================

import LanguageSelection from "./pages/LanguageSelection";

// ============================================================
// INTERVIEW
// ============================================================

import InterviewSetup from "./pages/InterviewSetup";
import DynamicInterview from "./pages/DynamicInterview";
import MockInterview from "./pages/MockInterview";
import InterviewResults from "./pages/InterviewResults";

// ============================================================
// VOICE INTERVIEW
// ============================================================

import VoiceInterview from "./pages/VoiceInterview";

// ============================================================
// RESUME
// ============================================================

import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeQuestions from "./pages/ResumeQuestions";

// ============================================================
// AI MODULES
// ============================================================

import AIQuestions from "./pages/AIQuestions";
import AIFeedback from "./pages/AIFeedback";
import HRChatbot from "./pages/HRChatbot";

// ============================================================
// CODING PRACTICE
// ============================================================

import CodingPractice from "./pages/CodingPractice";

// ============================================================
// CERTIFICATE
// ============================================================

import Certificate from "./pages/Certificate";

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            REGISTER
        ================================================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ==================================================
            PROFILE
        ================================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* ==================================================
            LEADERBOARD
        ================================================== */}

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        {/* ==================================================
            ABOUT
        ================================================== */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* ==================================================
            LANGUAGE SELECTION
        ================================================== */}

        <Route
          path="/language-selection"
          element={<LanguageSelection />}
        />

        <Route
          path="/languages"
          element={<LanguageSelection />}
        />

        {/* ==================================================
            INTERVIEW SETUP
        ================================================== */}

        <Route
          path="/interview-setup"
          element={<InterviewSetup />}
        />

        {/* ==================================================
            DYNAMIC INTERVIEW
        ================================================== */}

        <Route
          path="/interview/:language"
          element={<DynamicInterview />}
        />

        {/* ==================================================
            JAVA INTERVIEW
        ================================================== */}

        <Route
          path="/java"
          element={<DynamicInterview />}
        />

        {/* ==================================================
            PYTHON INTERVIEW
        ================================================== */}

        <Route
          path="/python"
          element={<DynamicInterview />}
        />

        {/* ==================================================
            REACT INTERVIEW
        ================================================== */}

        <Route
          path="/react"
          element={<DynamicInterview />}
        />

        {/* ==================================================
            VOICE INTERVIEW
        ================================================== */}

        <Route
          path="/voice-interview"
          element={<VoiceInterview />}
        />

        {/* ==================================================
            AI MOCK INTERVIEW
        ================================================== */}

        <Route
          path="/mock-interview"
          element={<MockInterview />}
        />

        {/* ==================================================
            INTERVIEW RESULTS
        ================================================== */}

        <Route
          path="/interview-results"
          element={<InterviewResults />}
        />

        {/* ==================================================
            RESUME UPLOAD
        ================================================== */}

        <Route
          path="/resume-upload"
          element={<ResumeUpload />}
        />

        {/* ==================================================
            AI RESUME ANALYZER
        ================================================== */}

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        {/* ==================================================
            RESUME QUESTIONS
        ================================================== */}

        <Route
          path="/resume-questions"
          element={<ResumeQuestions />}
        />

        {/* ==================================================
            AI QUESTIONS
        ================================================== */}

        <Route
          path="/ai-questions"
          element={<AIQuestions />}
        />

        {/* ==================================================
            AI FEEDBACK
        ================================================== */}

        <Route
          path="/feedback"
          element={<AIFeedback />}
        />

        <Route
          path="/ai-feedback"
          element={<AIFeedback />}
        />

        {/* ==================================================
            HR CHATBOT
        ================================================== */}

        <Route
          path="/hr-chatbot"
          element={<HRChatbot />}
        />

        {/* ==================================================
            CODING PRACTICE
        ================================================== */}

        <Route
          path="/coding"
          element={<CodingPractice />}
        />

        <Route
          path="/coding-practice"
          element={<CodingPractice />}
        />

        {/* ==================================================
            CERTIFICATE
        ================================================== */}

        <Route
          path="/certificate"
          element={<Certificate />}
        />

        {/* ==================================================
            UNKNOWN ROUTES
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;