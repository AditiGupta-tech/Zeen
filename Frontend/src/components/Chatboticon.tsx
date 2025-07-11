import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatbotIcon: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ParentsChat'); 
  };

  return (
    <div
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform z-50"
      id="chatbot-icon"
      onClick={handleClick}
      title="Chat with Zeen Assistant"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </div>
  );
};

export default ChatbotIcon;