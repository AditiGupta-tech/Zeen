import { useState } from "react";
import Games from "../components/Games";
import { LogOut, Plus, Minus, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChildModePage = () => {
  const navigate = useNavigate();
  const [fontScale, setFontScale] = useState(1.2);

  const handleFontSizeIncrease = () => {
    setFontScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleFontSizeDecrease = () => {
    setFontScale((prev) => Math.max(prev - 0.2, 0.8));
  };

  const handleVoiceAction = () => {
    alert("Voice input not set up yet, but here's where it triggers!");
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-comic text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bground.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white text-xl px-4 py-2 rounded-full shadow-lg z-10"
      >
        <LogOut className="inline mr-2" />
        Exit
      </button>

      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-10">
        <button
          onClick={handleFontSizeIncrease}
          className="bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full text-2xl font-bold shadow-lg"
          aria-label="Increase font size"
        >
          <Plus />
        </button>

        <button
          onClick={handleFontSizeDecrease}
          className="bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full text-2xl font-bold shadow-lg"
          aria-label="Decrease font size"
        >
          <Minus />
        </button>

        <button
          onClick={handleVoiceAction}
          className="bg-blue-400 hover:bg-blue-500 text-white p-4 rounded-full text-2xl shadow-lg"
          aria-label="Voice Input"
        >
          <Mic />
        </button>
      </div>

      {/* Main Content */}
      <div
        className="pt-24 px-4 max-w-prose mx-auto space-y-8 leading-relaxed rounded-xl p-6 shadow-lg text-white z-10 relative"
        style={{ fontSize: `${fontScale}rem`, lineHeight: "1.8" }}
      >
        <h1 className="text-6xl font-bold text-center drop-shadow-sm bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
          Welcome to Child Mode
        </h1>

        <div className="mt-12">
          <Games />
        </div>
      </div>
    </div>
  );
};

export default ChildModePage;
