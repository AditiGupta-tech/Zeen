import { Card } from "./Card";
import { Button } from "./Button";
import { ArrowRight, Webcam, Volume2 } from "lucide-react";
import { useState } from "react";
import GameModal from "./GameModal";

const Games = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false); 

  const playIshaanDemo = () => {
    const utterance = new SpeechSynthesisUtterance("Namaste! I am Ishaan. Let's play some jhakaas games together!");
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const enableVoiceFeatures = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      playIshaanDemo();
    }
  };

  const games = [
    {
      title: "Spell/Sequence Words",
      description: "Learn to spell words in the right sequence with audio guidance",
      icon: "🔤",
      color: "from-red-200 to-red-300",
      textColor: "text-red-800",
      difficulty: "Easy",
      gameType: "spelling"
    },
    {
      title: "Correct Pronunciation",
      description: "Practice speaking words correctly with Ishaan's voice feedback",
      icon: "🗣️",
      color: "from-orange-200 to-orange-300",
      textColor: "text-orange-800",
      difficulty: "Medium",
      gameType: "pronunciation"
    },
    {
      title: "Letter Confusion Game",
      description: "Master tricky letters like 'b' and 'd' through fun exercises",
      icon: "🔀",
      color: "from-yellow-200 to-yellow-300",
      textColor: "text-yellow-800",
      difficulty: "Easy",
      gameType: "confusion"
    },
    {
      title: "Color Confusion Game",
      description: "Identify the display color of a word, not the word itself!",
      icon: "🌈",
      color: "from-teal-200 to-teal-300",
      textColor: "text-teal-800",
      difficulty: "Tricky",
      gameType: "colorConfusion"
    },
    {
      title: "Art Therapy",
      description: "Express yourself through colors and creative drawing activities",
      icon: "🎨",
      color: "from-green-200 to-green-300",
      textColor: "text-green-800",
      difficulty: "Creative",
      gameType: "art"
    },
    {
      title: "Body Movement Games",
      description: "Dance and move like animals while learning new concepts",
      icon: "💃",
      color: "from-blue-200 to-blue-300",
      textColor: "text-blue-800",
      difficulty: "Active",
      gameType: "movement"
    },
    {
      title: "Object Recognition",
      description: "Use your webcam to identify objects around you",
      icon: "📷",
      color: "from-purple-200 to-purple-300",
      textColor: "text-purple-800",
      difficulty: "Interactive",
      gameType: "recognition"
    },
    {
      title: "Yoga Challenges",
      description: "Fun yoga poses and mindfulness exercises for kids",
      icon: "🧘‍♀️",
      color: "from-pink-200 to-pink-300",
      textColor: "text-pink-800",
      difficulty: "Calm",
      gameType: "yoga"
    }
  ];

  const handlePlayGame = (gameType: string) => {
    setActiveGame(gameType);
  };

  return (
    <section id="games" className="py-20 animated-bg relative">
      <div className="stars">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
            Jhakaas Games! 🎮
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Play, learn, and grow with games designed especially for you. Each game comes with Ishaan's encouraging voice!
          </p>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={playIshaanDemo}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-magical"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Hear Ishaan's Voice Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Card 
              key={index}
              className={`p-8 bg-gradient-to-br ${game.color} border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in floating cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="text-5xl">{game.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/30 ${game.textColor}`}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 className={`font-bold text-xl ${game.textColor}`}>
                  {game.title}
                </h3>
                <p className={`${game.textColor} opacity-80`}>
                  {game.description}
                </p>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handlePlayGame(game.gameType)}
                    className={`flex-1 bg-white/20 ${game.textColor} border-none hover:bg-white/30 btn-magical`}
                  >
                    Play Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {(game.title === "Object Recognition") && (
                    <Button size="sm" variant="outline" className="border-current">
                      <Webcam className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Special Voice Feature 🌟
            </h3>
            <p className="text-gray-700 mb-6">
              Every game includes Ishaan's encouraging voice saying "Ekdum Jhakaas!" when you do well!
            </p>
            <Button 
              onClick={enableVoiceFeatures}
              className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg btn-magical ${voiceEnabled ? 'pulse-glow' : ''}`}
            >
              <Volume2 className="mr-2 h-5 w-5" />
              {voiceEnabled ? 'Voice Enabled!' : 'Enable Voice Features'}
            </Button>
          </div>
        </div>
      </div>
      
      {activeGame && (
        <GameModal 
          gameType={activeGame} 
          onClose={() => setActiveGame(null)} 
        />
      )}
    </section>
  );
};

export default Games;
