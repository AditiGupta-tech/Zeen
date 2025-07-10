import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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


const App = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
