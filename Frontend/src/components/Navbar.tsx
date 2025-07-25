import { Button } from "./Button";
import { Volume2, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import ChildModeToggle from "./ChildModeToggle";
import { useState } from "react";

const Navigation = () => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                <img
  src="/logo.png"
  alt="Zeen Logo"
  className="w-12 aspect-square rounded-full object-cover"
/>

              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                Zeen
              </span>
            </div>

            <div className="hidden md:flex flex-grow justify-center items-center space-x-8">
              <Link to="/" className="relative text-gray-700 font-medium transition-all duration-300 hover:text-orange-600 hover:scale-105 after:block after:h-[2px] after:bg-orange-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                Home
              </Link>
              <Link to="/parents" className="relative text-gray-700 font-medium transition-all duration-300 hover:text-orange-600 hover:scale-105 after:block after:h-[2px] after:bg-orange-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                Parents
              </Link>
              <Link to="/personalize" className="relative text-gray-700 font-medium transition-all duration-300 hover:text-orange-600 hover:scale-105 after:block after:h-[2px] after:bg-orange-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                Personalize
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-3 ml-auto">
              <ChildModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="rounded-full bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600 hover:shadow-sm transition-all duration-300"
              >
                <Volume2 className="mr-1 h-4 w-4" />
              </Button>
              <Link to="/SimulationPage">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-300 shadow-md"
                >
                  Simulation <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <Button variant="outline" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </nav>
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-[90%] relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setShowHelp(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              🎙️ Voice Navigation Help
            </h2>
            <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
              <li>Start Journey</li>
              <li>Go Home</li>
              <li>Open Child Mode</li>
              <li>Track Progress</li>
              <li>Log In</li>
              <li>Sign Up</li>
              <li>Open Chat Assistant</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Navigation;