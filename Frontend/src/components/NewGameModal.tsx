import { useState, useEffect, useRef } from "react";
import GameModal from "./GameModal";

const NewGames = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const games = [
    { title: "Spell/Sequence Words", icon: "🔤", color: "from-red-400 to-red-500", gameType: "spelling" },
    { title: "Correct Pronunciation", icon: "🗣️", color: "from-orange-400 to-orange-500", gameType: "pronunciation" },
    { title: "Letter Confusion Game", icon: "🔀", color: "from-yellow-400 to-yellow-500", gameType: "confusion" },
    { title: "Object Matching Game", icon: "🧠", color: "from-indigo-400 to-indigo-500", gameType: "memoryMatch" },
    { title: "Art Therapy", icon: "🎨", color: "from-green-400 to-green-500", gameType: "art" },
    { title: "Color Confusion Game", icon: "🌈", color: "from-teal-400 to-teal-500", gameType: "colorConfusion" },
    { title: "Math Quiz", icon: "🔢", color: "from-blue-400 to-blue-500", gameType: "math" },
    { title: "Object Recognition Game", icon: "📷", color: "from-purple-400 to-purple-500", gameType: "recognition" }
  ];

  const handlePlayGame = (gameType: string) => {
    (window as any).isGameActive = true;
    if ((window as any).pauseVoiceNav) (window as any).pauseVoiceNav();
    setActiveGame(gameType);
  };

  const generateGridPositions = () => {
    const rows = 3;
    const cols = 3;
    const spacingX = window.innerWidth / cols;
    const spacingY = window.innerHeight / rows;
    const positions = [];

    for (let i = 0; i < games.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = Math.random() * (spacingX - 180); 
      const offsetY = Math.random() * (spacingY - 180);
      positions.push({
        top: row * spacingY + offsetY,
        left: col * spacingX + offsetX,
        animationDelay: `${Math.random() * 4}s`
      });
    }

    return positions;
  };

  const [positions, setPositions] = useState(generateGridPositions());

  useEffect(() => {
    const handleResize = () => setPositions(generateGridPositions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (clientX - centerX) / 40;
    const offsetY = (clientY - centerY) / 40;

    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  return (
    <div
      className="absolute top-0 left-0 w-screen h-screen z-10 pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      <div ref={containerRef} className="w-full h-full relative">
        {games.map((game, index) => (
          <div
            key={index}
            className={`absolute w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${game.color} shadow-2xl flex flex-col items-center justify-center text-white text-center cursor-pointer bubble-float bubble-hover pointer-events-auto`}
            onClick={() => handlePlayGame(game.gameType)}
            style={{
              top: positions[index].top,
              left: positions[index].left,
              animationDelay: positions[index].animationDelay
            }}
          >
            <div className="text-4xl md:text-5xl">{game.icon}</div>
            <div className="text-sm font-semibold mt-1 px-2 leading-tight">
              {game.title.length > 18 ? game.title.slice(0, 16) + "…" : game.title}
            </div>
            <div className="text-xs mt-1 px-2 py-0.5 bg-black/40 rounded-full">
              Play Now
            </div>
          </div>
        ))}
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
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .bubble-float {
          animation: float 3s ease-in-out infinite;
        }

        .bubble-hover:hover {
          animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
          100% {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default NewGames;