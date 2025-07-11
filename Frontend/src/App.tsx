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
import { AppProvider } from './context/appContext' 

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
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
  const hideChatbot = location.pathname === "/child-mode" || location.pathname === "/SimulationPage";
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate('/personalize'); 
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