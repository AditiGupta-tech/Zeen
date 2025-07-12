declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    pauseVoiceNav: () => void;
    resumeVoiceNav: () => void;
    isGameActive: boolean;
  }
}

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home";
import SimulationPage from "./pages/Simulation";
import ParentsChat from "./pages/ParentsChat";
import ParentsSection from "./pages/ParentsSection";
import PersonalizeExperience from "./pages/Personalize";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ChildModePage from "./pages/Childmode";
import ChatbotIcon from "./components/Chatboticon";
import { AppProvider } from "./context/appContext";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: typeof SpeechRecognition | null = null;
window.isGameActive = false;

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎙️ Mic is actively listening");
    };

    window.pauseVoiceNav = () => {
      try {
        recognition?.abort();
        console.log("🔇 Voice nav paused");
      } catch (err) {
        console.error("Pause failed:", err);
      }
    };

    window.resumeVoiceNav = () => {
      try {
        recognition?.start();
        console.log("🎤 Voice nav resumed");
      } catch (err) {
        console.error("Resume failed:", err);
      }
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log("🗣️ You said:", command);

      if (command.includes("go home") || command.includes("go back") || command.includes("home")) {
        window.location.href = "/";
      } else if (command.includes("start journey") || command.includes("journey")) {
        document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
      } else if (command.includes("log in") || command.includes("login")) {
        window.location.href = "/login";
      } else if (command.includes("sign up") || command.includes("signup")) {
        window.location.href = "/signup";
      } else if (
        command.includes("track progress") ||
        command.includes("progress") ||
        command.includes("achievement")
      ) {
        document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
      } else if (
        command.includes("child mode") ||
        command.includes("open child mode") ||
        command.includes("childmode") ||
        command.includes("child")
      ) {
        window.location.href = "/child-mode";
      } else if (
        command.includes("chat assistant") ||
        command.includes("chatbot") ||
        command.includes("assistant")
      ) {
        document.getElementById("chatbot-icon")?.click();
      } else {
        const fail = new SpeechSynthesisUtterance("Sorry, I didn't understand that.");
        speechSynthesis.speak(fail);
      }
    };

    recognition.onend = () => {
      if (!window.isGameActive) {
        recognition?.start();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Voice error:", event.error);
      setTimeout(() => recognition?.start(), 1000);
    };

    setTimeout(() => {
      try {
        recognition?.start();
        console.log("✅ Voice navigation started");
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }, 1000);

    return () => {
      recognition?.abort();
    };
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <AppContentWrapper />
      </AppProvider>
    </BrowserRouter>
  );
};

const AppContentWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideChatbot =
    location.pathname === "/child-mode" || location.pathname === "/SimulationPage";

  const handleLoginSuccess = () => {
    navigate("/personalize");
  };

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SimulationPage" element={<SimulationPage />} />
          <Route path="/ParentsChat" element={<ParentsChat />} />
          <Route path="/parents" element={<ParentsSection />} />
          <Route path="/personalize" element={<PersonalizeExperience />} />
          <Route path="/signup" element={<SignupPage onSignupSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/child-mode" element={<ChildModePage />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </main>

      {!hideChatbot && <ChatbotIcon />}
    </>
  );
};

export default App;