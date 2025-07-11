declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    pauseVoiceNav: () => void;
    resumeVoiceNav: () => void;
    isGameActive: boolean;
  }
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

    recognition.onstart = () => {
      console.log("🎙️ Mic is actively listening");
    };

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

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

      if (
        command.includes("go home") || command.includes("go back") ||
        command.includes("home") || command.includes("go back to home")
      ) {
        window.location.href = "/";
      } else if (
        command.includes("start journey") || command.includes("journey") ||
        command.includes("start your journey")
      ) {
        document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
      } else if (command.includes("log in") || command.includes("login")) {
        window.location.href = "/login";
      } else if (command.includes("sign up") || command.includes("signup")) {
        window.location.href = "/signup";
      } else if (
        command.includes("track progress") || command.includes("progress") ||
        command.includes("achievement") || command.includes("show achievement")
      ) {
        document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
      } else if (
        command.includes("child mode") || command.includes("open child mode") ||
        command.includes("childmode") || command.includes("child")
      ) {
        window.location.href = "/child-mode";
      } else if (
        command.includes("chat assistant") || command.includes("chatbot") ||
        command.includes("open chat assistant") || command.includes("assistant")
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
      <AppContentWrapper />
    </BrowserRouter>
  );
};

const AppContentWrapper = () => {
  const location = useLocation();
  const hideChatbot = location.pathname === "/child-mode";

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SimulationPage" element={<SimulationPage />} />
          <Route path="/ParentsChat" element={<ParentsChat />} />
          <Route path="/parents" element={<ParentsSection />} />
          <Route path="/personalize" element={<PersonalizeExperience />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/child-mode" element={<ChildModePage />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </main>

      {!hideChatbot && <ChatbotIcon />}
    </>
  );
};

export default App;