import React, { useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useAppContext } from "../../context/appContext";

const ConfettiCannon: React.FC = () => {
  const { showConfetti, hideConfetti } = useAppContext();
  const { innerWidth: width, innerHeight: height } = window;
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (showConfetti) {
      timeoutRef.current = window.setTimeout(() => {
        hideConfetti();
      }, 4000); 
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showConfetti]);

  if (!showConfetti) return null;

  return (
    <>
      {/* Left cannon */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={150}
        gravity={0.2}
        wind={-0.1}
        recycle={false}
        origin={{ x: 0, y: 0 }}
        initialVelocityX={12}
        initialVelocityY={10}
        tweenDuration={4000}
        colors={["#4e54c8", "#8f94fb", "#a0e9ff", "#ffffff"]}
      />

      {/* Right cannon */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={150}
        gravity={0.2}
        wind={0.1}
        recycle={false}
        origin={{ x: 1, y: 0 }}
        initialVelocityX={-12}
        initialVelocityY={10}
        tweenDuration={4000}
        colors={["#4e54c8", "#8f94fb", "#a0e9ff", "#ffffff"]}
      />

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)",
        pointerEvents: "none",
        animation: "fadeOverlay 1.5s ease-out forwards"
      }} />

      <style>{`
        @keyframes fadeOverlay {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default ConfettiCannon;
