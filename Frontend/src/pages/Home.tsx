import { useState } from "react";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import ChatbotIcon from "../components/Chatboticon";
import Faqs from "../components/Faqs";
import Games from "../components/Games";
import ProgressSection from "../components/Progress";
import AuthSection from "../components/Auth";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ArrowRight, Mic, Volume2 } from "lucide-react";

const Home = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleStartJourney = () => {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVoiceNavigation = () => {
    setIsVoiceActive((prev) => !prev);
    if (!isVoiceActive) {
      alert("🎙️ Voice navigation activated! Say 'Hello Ishaan' to start!");
    } else {
      alert("🔇 Voice navigation deactivated.");
    }
  };

  const features = [
    {
      title: "Voice First Navigation",
      description: "Navigate through the app using your voice with Ishaan's friendly guidance",
      icon: "🗣️",
      color: "from-orange-200 to-orange-300",
      textColor: "text-orange-800"
    },
    {
      title: "Chat Assistant (Voice)",
      description: "Have conversations with our AI assistant that understands and helps you",
      icon: "💬",
      color: "from-blue-200 to-blue-300",
      textColor: "text-blue-800"
    },
    {
      title: "Meditation Practice",
      description: "Calm your mind with guided meditation sessions designed for children",
      icon: "🧘",
      color: "from-green-200 to-green-300",
      textColor: "text-green-800"
    },
    {
      title: "Emotion Journal",
      description: "Express your feelings through emojis and track your emotional journey",
      icon: "😊",
      color: "from-purple-200 to-purple-300",
      textColor: "text-purple-800"
    },
    {
      title: "Routine Builder",
      description: "Create and follow daily routines that help you stay organized",
      icon: "📅",
      color: "from-pink-200 to-pink-300",
      textColor: "text-pink-800"
    },
    {
      title: "AI Story Prompts",
      description: "Generate creative stories and let your imagination run wild",
      icon: "📚",
      color: "from-indigo-200 to-indigo-300",
      textColor: "text-indigo-800"
    },
    {
      title: "Progress Tracker",
      description: "See how much you've grown with fun visual progress reports",
      icon: "📊",
      color: "from-teal-200 to-teal-300",
      textColor: "text-teal-800"
    },
    {
      title: "Parent Dashboard",
      description: "Separate dashboard for parents to track progress and assign tasks",
      icon: "👨‍👩‍👧‍👦",
      color: "from-amber-200 to-amber-300",
      textColor: "text-amber-800"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* HERO SECTION */}
      <section className="min-h-screen animated-bg relative flex flex-col items-center justify-center p-4">
        <div className="stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>

        <div className="paper-plane text-2xl">✈️</div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 flex-grow">
          <div className="text-center lg:text-left space-y-6 ">
            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent leading-tight">
              Welcome to Zeen
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              A magical learning companion for every special child, inspired by
              the stars that shine differently in the sky! 🌟
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleStartJourney}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 btn-magical pulse-glow"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleVoiceNavigation}
                className={`border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 btn-magical ${
                  isVoiceActive ? "bg-blue-100 pulse-glow" : ""
                }`}
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {isVoiceActive ? "Voice Active" : "Voice Navigation"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-scale-in">
            <Card className="p-6 bg-gradient-to-br from-orange-200 to-orange-300 border-none shadow-xl hover:shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-orange-800">Voice Assistant</h3>
                <p className="text-sm text-orange-700">Chat with Ishaan's voice!</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-200 to-blue-300 border-none shadow-xl hover:shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="font-bold text-blue-800">Fun Games</h3>
                <p className="text-sm text-blue-700">Learn through play!</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-200 to-green-300 border-none shadow-xl hover:shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🧘</span>
                </div>
                <h3 className="font-bold text-green-800">Meditation</h3>
                <p className="text-sm text-green-700">Calm your mind</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-200 to-purple-300 border-none shadow-xl hover:shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold text-purple-800">Progress</h3>
                <p className="text-sm text-purple-700">Track your growth</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-6">
              Amazing Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the wonderful tools designed to make learning fun and accessible for every child
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-6 bg-gradient-to-br ${feature.color} border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className={`font-bold text-lg ${feature.textColor}`}>{feature.title}</h3>
                  <p className={`text-sm ${feature.textColor} opacity-80`}>{feature.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`mt-4 border-current ${feature.textColor} hover:bg-white/20`}
                  >
                    Try Now <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <Games />
      <ProgressSection />
      <AuthSection />
      <Faqs />
      <Footer />
      <ChatbotIcon />
    </div>
  );
};

export default Home;