import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/appContext";
import { CircleDollarSign, Trophy, BadgeCheck, Sparkles, RotateCcw } from "lucide-react";

const MilestoneDisplay: React.FC = () => {
  const {
    milestonePoints,
    currentMilestone,
    markMilestoneCompleted,
    isLoading,
    milestoneTasks,
  } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [flyingCoin, setFlyingCoin] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });

  const coinRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    if (!currentMilestone) return;

    markMilestoneCompleted(currentMilestone.id);
    setEarnedPoints(currentMilestone.points);

    const start = coinRef.current?.getBoundingClientRect();
    const end = counterRef.current?.getBoundingClientRect();

    if (start && end) {
      setStartCoords({ x: start.left, y: start.top });
      setEndCoords({ x: end.left, y: end.top });
      setFlyingCoin(true);
    }

    setTimeout(() => setShowModal(true), 800);
    setTimeout(() => setShowModal(false), 3000);
  };

  if (isLoading) return <p>Loading milestones...</p>;

  const handleRedoMilestone = (id: string, points: number) => {
  const reducedPoints = Math.max(Math.floor(points * 0.8), 1); 
  setEarnedPoints(reducedPoints);
  markMilestoneCompleted(id); 

  const start = coinRef.current?.getBoundingClientRect();
  const end = counterRef.current?.getBoundingClientRect();

  if (start && end) {
    setStartCoords({ x: start.left, y: start.top });
    setEndCoords({ x: end.left, y: end.top });
    setFlyingCoin(true);
  }

  setTimeout(() => setShowModal(true), 800);
  setTimeout(() => setShowModal(false), 3000);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        padding: "30px",
        maxWidth: "720px",
        margin: "50px auto",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        boxShadow: "0 0 30px rgba(0,0,0,0.15)",
        overflow: "hidden",
        border: "1px solid #ececec",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Points Badge */}
      <motion.div
        ref={counterRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(to right, #fffbe7, #fff3c4)",
          borderRadius: "9999px",
          padding: "8px 14px",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#5b4300",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <CircleDollarSign color="#f2b705" size={22} />
        <span style={{ marginLeft: "8px" }}>{milestonePoints}</span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "1.7rem",
          fontWeight: 700,
          color: "#302f4d",
        }}
      >
        <Trophy size={26} style={{ marginRight: 10 }} />
        Your Milestone Journey
      </motion.h2>

      {/* Active Milestone */}
      {currentMilestone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "12px",
            background:
              "linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)",
            color: "#222",
            marginBottom: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
            {currentMilestone.task}
          </h3>
          <p style={{ color: "#333", margin: "10px 0" }}>
            {currentMilestone.description}
          </p>
          <p style={{ fontStyle: "italic", color: "#4d2c91" }}>
            🎯 Earn <strong>{currentMilestone.points}</strong> points
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            style={{
              marginTop: "16px",
              padding: "12px 26px",
              background: "#4338ca",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 6px 18px rgba(67,56,202,0.35)",
              cursor: "pointer",
            }}
          >
            ✅ Mark Completed
          </motion.button>

          <div
            ref={coinRef}
            style={{
              position: "absolute",
              top: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0,
            }}
          >
            <CircleDollarSign size={30} color="#f2b705" />
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#6a6a6a",
            background: "#f1f8ff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          🎉 All milestones completed. You're crushing it!
        </motion.p>
      )}

      {/* Completed Milestones */}
      <h4
        style={{
          marginTop: "30px",
          fontSize: "1.1rem",
          color: "#3b3b3b",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <BadgeCheck size={18} /> Completed Milestones
      </h4>
      <ul style={{ marginTop: "10px", padding: "0 10px" }}>
  {milestoneTasks.filter((m) => m.completed).length > 0 ? (
    milestoneTasks
      .filter((m) => m.completed)
      .map((m) => (
        <motion.li
          key={m.id}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 250 }}
          style={{
            background: "#e0f7fa",
            padding: "10px 14px",
            marginBottom: "10px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            color: "#004d40",
            fontWeight: 500,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {m.task} —{" "}
            <span style={{ color: "#00695c", fontSize: "0.9rem" }}>
              {m.completionDate || "N/A"}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              background: "#dcedc8",
              color: "#33691e",
              fontWeight: 600,
              fontSize: "0.85rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onClick={() => handleRedoMilestone(m.id, m.points)}
          >
            <RotateCcw size={16} />
            Redo
          </motion.button>
        </motion.li>
      ))
  ) : (
    <li style={{ color: "#999" }}>No milestones completed yet.</li>
  )}
</ul>

      {/* Modal */}
      {showModal && (
  <div
    style={{
      position: "fixed",
      top: "20%",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#fff",
      padding: "35px 60px",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      zIndex: 1000,
      animation: "fadeInScale 0.4s ease-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      minWidth: "400px",
    }}
  >
    <h2
      style={{
        color: "#4b2991",
        fontSize: "2rem",
        fontWeight: "bold",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      ✨ +{earnedPoints} Points!
    </h2>
    <Sparkles size={52} color="#c084fc" className="coin-spin" />
  </div>
)}

      {/* Flying Coin Animation */}
      <AnimatePresence>
        {flyingCoin && (
          <motion.div
            initial={{
              position: "fixed",
              top: startCoords.y,
              left: startCoords.x,
              zIndex: 10000,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              top: endCoords.y,
              left: endCoords.x,
              scale: [1, 1.4, 0.6],
              rotate: 720,
              opacity: 0,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setFlyingCoin(false)}
          >
            <CircleDollarSign size={30} color="#f2b705" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        .coin-spin {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default MilestoneDisplay;