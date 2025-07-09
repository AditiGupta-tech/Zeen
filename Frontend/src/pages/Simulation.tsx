import React, { useRef, useState } from 'react';
import { X, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleExitSimulation = () => {
    navigate('/');
  };

  const handlePlay = () => {
    setHasStarted(true);
    videoRef.current?.play();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-[120vw] h-[95vh] rounded-lg overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          src="/simulation.mp4"
          className="w-full h-full object-contain"
          loop
          playsInline
        >
          Your browser does not support the video tag.
        </video>

        {/* Overlay Play Button */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <button
              onClick={handlePlay}
              className="flex flex-col items-center gap-2 text-white hover:text-orange-400 transition-all"
            >
              <PlayCircle size={64} className="animate-pulse" />
              <span className="text-lg font-semibold">Play Simulation</span>
            </button>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full z-50 bg-black bg-opacity-80 text-white text-xs px-4 py-2 flex flex-wrap justify-center items-center gap-4 border-t border-gray-700">
        <span className="whitespace-nowrap">
          Source:&nbsp;
          <a
            href="https://youtu.be/T78ej7iC0is?feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-blue-500 hover:text-blue-600 hover:underline"
          >
            Dyslexia Simulation by Arije-Aike de Haas
          </a>
        </span>
        <span className="whitespace-nowrap">
          |&nbsp; &nbsp;
          <a
            href="https://youtu.be/VWQV-_Kh3rE?feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-blue-500 hover:text-blue-600 hover:underline"
          >
            Visual Dyslexia Simulation by Dyslexia Improvements
          </a>
        </span>
      </div>

      {/* Exit Button */}
      <button
        onClick={handleExitSimulation}
        className="absolute top-4 left-4 p-2 bg-gray-700 bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-colors duration-200 z-50"
        aria-label="Exit simulation"
      >
        <X size={20} strokeWidth={2} />
      </button>      
    </div>
  );
};

export default SimulationPage;

