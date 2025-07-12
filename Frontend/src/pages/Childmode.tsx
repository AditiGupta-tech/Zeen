import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameModal from "../components/GameModal";

interface GameTheme {
  name: string;
  backgroundVideo: string;
  headingGradient: string;
  fontButtonColor: string;
  exitButtonColor: string;
  bubbleShapeClass: string;
  bubbleDimensionsClass: string; 
  bubbleIconSizeClass: string;   
  bubbleTitleSizeClass: string; 
  bubbleLaunchSizeClass: string; 
  gameColors: { title: string; icon: string; color: string; gameType: string; }[];
  headingText: string;
}

const themes: { [key: string]: GameTheme } = {
  galaxy: {
    name: "Galaxy",
    backgroundVideo: "/bg1.mp4",
    headingGradient: "from-cyan-400 via-purple-400 to-indigo-400",
    fontButtonColor: "bg-purple-600 hover:bg-purple-700",
    exitButtonColor: "bg-red-700 hover:bg-red-800",
    bubbleShapeClass: "rounded-full", 
    bubbleDimensionsClass: "w-[calc(33.33%-28px)] h-32 md:w-[calc(33.33%-36px)] md:h-40 lg:w-[calc(33.33%-44px)] lg:h-48",
    bubbleIconSizeClass: "text-3xl md:text-4xl lg:text-5xl",
    bubbleTitleSizeClass: "text-sm md:text-base lg:text-md",
    bubbleLaunchSizeClass: "text-xs md:text-sm",
    gameColors: [
      { title: "Spell/Sequence Words", icon: "🌌", color: "from-blue-600 to-indigo-800", gameType: "spelling" },
      { title: "Correct Pronunciation", icon: "🚀", color: "from-purple-600 to-fuchsia-800", gameType: "pronunciation" },
      { title: "Letter Confusion Game", icon: "🌠", color: "from-teal-500 to-blue-700", gameType: "confusion" },
      { title: "Object Matching Game", icon: "🪐", color: "from-green-500 to-cyan-700", gameType: "memoryMatch" },
      { title: "Art Therapy", icon: "🎨", color: "from-orange-500 to-red-700", gameType: "art" },
      { title: "Color Confusion Game", icon: "✨", color: "from-pink-500 to-purple-700", gameType: "colorConfusion" },
      { title: "Math Quiz", icon: "💫", color: "from-yellow-500 to-orange-700", gameType: "math" },
      { title: "Object Recognition Game", icon: "🔭", color: "from-gray-600 to-gray-800", gameType: "recognition" }
    ],
    headingText: "Explore the Galaxy!"
  },
  valleysMountains: {
    name: "Valleys & Mountains",
    backgroundVideo: "/bg2.mp4",
    headingGradient: "from-green-500 via-yellow-600 to-amber-700",
    fontButtonColor: "bg-green-700 hover:bg-green-800",
    exitButtonColor: "bg-gray-700 hover:bg-gray-800",
    bubbleShapeClass: "rounded-lg", 
    bubbleDimensionsClass: "w-32 h-40 md:w-40 md:h-48 lg:w-48 lg:h-56", 
    bubbleIconSizeClass: "text-3xl md:text-4xl lg:text-5xl",
    bubbleTitleSizeClass: "text-sm md:text-base lg:text-md",
    bubbleLaunchSizeClass: "text-xs md:text-sm",
    gameColors: [
      { title: "Spell/Sequence Words", icon: "🌲", color: "from-emerald-400 to-emerald-600", gameType: "spelling" },
      { title: "Correct Pronunciation", icon: "🏞️", color: "from-lime-400 to-lime-600", gameType: "pronunciation" },
      { title: "Letter Confusion Game", icon: "⛰️", color: "from-stone-500 to-stone-700", gameType: "confusion" },
      { title: "Object Matching Game", icon: "🦋", color: "from-sky-400 to-cyan-600", gameType: "memoryMatch" },
      { title: "Art Therapy", icon: "🌻", color: "from-yellow-400 to-yellow-600", gameType: "art" },
      { title: "Color Confusion Game", icon: "🍂", color: "from-amber-600 to-orange-800", gameType: "colorConfusion" },
      { title: "Math Quiz", icon: "🦌", color: "from-purple-400 to-purple-600", gameType: "math" },
      { title: "Object Recognition Game", icon: "🦊", color: "from-red-300 to-red-500", gameType: "recognition" }
    ],
    headingText: "Adventure in Nature!"
  },
  underwaterWorld: {
    name: "Underwater World",
    backgroundVideo: "/bg3.mp4",
    headingGradient: "from-blue-300 via-cyan-400 to-blue-500",
    fontButtonColor: "bg-blue-500 hover:bg-blue-600",
    exitButtonColor: "bg-indigo-700 hover:bg-indigo-800",
    bubbleShapeClass: "rounded-3xl", 
    bubbleDimensionsClass: "w-40 h-32 md:w-48 md:h-36 lg:w-56 lg:h-44",
    bubbleIconSizeClass: "text-3xl md:text-4xl lg:text-5xl",
    bubbleTitleSizeClass: "text-sm md:text-base lg:text-md",
    bubbleLaunchSizeClass: "text-xs md:text-sm",
    gameColors: [
      { title: "Spell/Sequence Words", icon: "🐠", color: "from-cyan-300 to-blue-400", gameType: "spelling" },
      { title: "Correct Pronunciation", icon: "🐬", color: "from-teal-300 to-green-400", gameType: "pronunciation" },
      { title: "Letter Confusion Game", icon: "🐚", color: "from-pink-200 to-purple-300", gameType: "confusion" },
      { title: "Object Matching Game", icon: "🦀", color: "from-orange-300 to-red-400", gameType: "memoryMatch" },
      { title: "Art Therapy", icon: "🐙", color: "from-fuchsia-300 to-indigo-400", gameType: "art" },
      { title: "Color Confusion Game", icon: "🐡", color: "from-yellow-300 to-lime-400", gameType: "colorConfusion" },
      { title: "Math Quiz", icon: "🐳", color: "from-sky-400 to-blue-500", gameType: "math" },
      { title: "Object Recognition Game", icon: "🐢", color: "from-green-300 to-emerald-400", gameType: "recognition" }
    ],
    headingText: "Dive into the Ocean!"
  },
};

const ChildModePage = () => {
  const navigate = useNavigate();
  const [fontScale, setFontScale] = useState(1.2);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentThemeName, setCurrentThemeName] = useState<keyof typeof themes>(() => {
    try {
      const storedTheme = localStorage.getItem('childModeTheme');
      return storedTheme && themes[storedTheme as keyof typeof themes] ? storedTheme as keyof typeof themes : 'galaxy';
    } catch (error) {
      console.error("Failed to read theme from localStorage:", error);
      return 'galaxy'; 
    }
  });

  const currentTheme = themes[currentThemeName];
  const themeKeys = Object.keys(themes) as (keyof typeof themes)[];

  useEffect(() => {
    try {
      localStorage.setItem('childModeTheme', currentThemeName);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [currentThemeName]);

  const handlePlayGame = (gameType: string) => {
    (window as any).isGameActive = true;
    if ((window as any).pauseVoiceNav) (window as any).pauseVoiceNav();
    setActiveGame(gameType);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (clientX - centerX) / 60;
    const offsetY = (clientY - centerY) / 60;

    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  const handleFontSizeIncrease = () => {
    setFontScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleFontSizeDecrease = () => {
    setFontScale((prev) => Math.max(prev - 0.2, 0.8));
  };

  const handleChangeTheme = () => {
    const currentIndex = themeKeys.indexOf(currentThemeName);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentThemeName(themeKeys[nextIndex]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-comic text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        key={currentTheme.backgroundVideo}
      >
        <source src={currentTheme.backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        onClick={() => navigate("/")}
        className={`absolute top-4 left-4 ${currentTheme.exitButtonColor} text-white p-3 rounded-full shadow-lg z-20 transition duration-300 ease-in-out transform hover:scale-110`}
        title="Exit"
      >
        <span role="img" aria-label="exit" className="text-3xl">🚪</span>
      </button>

      <div className="fixed top-4 right-4 flex flex-row items-center gap-4 z-20">
        <button
          onClick={handleFontSizeIncrease}
          className={`${currentTheme.fontButtonColor} text-white p-3 rounded-full text-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-110`}
          aria-label="Increase font size"
        >
          <Plus />
        </button>

        <button
          onClick={handleFontSizeDecrease}
          className={`${currentTheme.fontButtonColor} text-white p-3 rounded-full text-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-110`}
          aria-label="Decrease font size"
        >
          <Minus />
        </button>

        <button
          onClick={handleChangeTheme}
          className={`${currentTheme.fontButtonColor} text-white p-3 rounded-full text-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-110`}
          title="Change Theme"
          aria-label="Change Theme"
        >
          <Palette />
        </button>
      </div>

      <div className="relative z-10 w-full h-full min-h-screen flex flex-col items-center justify-center p-4"
           onMouseMove={handleMouseMove}>

        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-center drop-shadow-lg bg-gradient-to-r ${currentTheme.headingGradient} bg-clip-text text-transparent my-8 sm:my-12 lg:my-16`}
          style={{ fontSize: `${fontScale * 3.5}rem`, lineHeight: "1.2" }}
        >
          {currentTheme.headingText}
        </h1>

        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-10 p-4 max-w-7xl mx-auto">
            {currentTheme.gameColors.map((game, index) => (
                <div
                key={game.title}
                className={`${currentTheme.bubbleDimensionsClass} ${currentTheme.bubbleShapeClass} bg-gradient-to-br ${game.color} shadow-2xl flex flex-col items-center justify-center text-white text-center cursor-pointer bubble-float bubble-hover transition-transform duration-300 ease-out glow-effect overflow-hidden`}
                onClick={() => handlePlayGame(game.gameType)}
                style={{ animationDelay: `${index * 0.2}s` }}
                >
                <div className={`${currentTheme.bubbleIconSizeClass} drop-shadow-lg`}>{game.icon}</div>
                <div className={`${currentTheme.bubbleTitleSizeClass} font-semibold mt-1 px-2 leading-tight`}>
                    {game.title}
                </div>
                <div className={`${currentTheme.bubbleLaunchSizeClass} mt-1 px-2 py-0.5 bg-white/20 rounded-full text-glow`}>
                    Launch
                </div>
                </div>
            ))}
            </div>
        </div>
      </div>

      {activeGame && (
        <GameModal
          gameType={activeGame}
          onClose={() => {
            setActiveGame(null);
            (window as any).isGameActive = false;
            if ((window as any).resumeVoiceNav) (window as any).resumeVoiceNav();
          }}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.9;
          }
          25% {
            transform: translateY(-12px) rotate(-1deg);
            opacity: 1;
          }
          50% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.95;
          }
          75% {
            transform: translateY(12px) rotate(1deg);
            opacity: 1;
          }
        }

        .bubble-float {
          animation: float 6s ease-in-out infinite;
        }

        .bubble-hover:hover {
          animation: pulse 1s infinite alternate, bounce 0.5s ease-out;
          animation-fill-mode: forwards;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
          100% {
            transform: scale(1.08);
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes bounce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.08);
          }
        }

        .glow-effect {
          position: relative;
        }

        .glow-effect::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          pointer-events: none;
        }

        .bubble-hover:hover .glow-effect::before {
          opacity: 1;
          animation: rotateGlow 2s linear infinite;
        }

        @keyframes rotateGlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .text-glow {
            text-shadow: 0 0 5px rgba(255,255,255,0.7), 0 0 10px rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
};

export default ChildModePage;