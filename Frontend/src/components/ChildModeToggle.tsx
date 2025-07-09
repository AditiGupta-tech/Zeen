import { useNavigate } from "react-router-dom";
import { Baby } from "lucide-react";
import { motion } from "framer-motion"; 

const ChildModeToggle = () => {
  const navigate = useNavigate();

  const handleEnableChildMode = () => {
    navigate("/child-mode");
  };

  return (
    <motion.button
      onClick={handleEnableChildMode}
      className="relative flex items-center justify-center p-3 rounded-full bg-purple-600 text-white
                 hover:bg-purple-700 transition-colors focus:outline-none group"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <Baby size={20} />

      <span className="absolute top-full mt-2 hidden group-hover:block
                       min-w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg
                       transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
        Enable Child Mode
      </span>
    </motion.button>
  );
};

export default ChildModeToggle;
