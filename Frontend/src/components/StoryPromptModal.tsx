import React, { useState } from "react";
import { getStoryFromWord } from "./getStoryFromWord";
import { X, Volume2 } from "lucide-react";

const StoryPromptModal = ({ onClose }: { onClose: () => void }) => {
  const [word, setWord] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGenerateStory = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setStory("");

    try {
      const result = await getStoryFromWord(word);
      setStory(result);
    } catch (err) {
      setStory("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakStory = () => {
    if (!story) return;

    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = 0.9; 
    utterance.pitch = 1.1;
    utterance.lang = "en-US";

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">📚 Generate a Story</h2>

        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word (e.g. tree, moon, dog)"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={handleGenerateStory}
          disabled={loading || !word}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {story && (
          <div className="mt-4">
            <div className="p-3 bg-gray-100 rounded whitespace-pre-line max-h-[300px] overflow-y-auto mb-2">
              {story}
            </div>
            <button
              onClick={handleSpeakStory}
              disabled={isSpeaking}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <Volume2 className="h-4 w-4" />
              {isSpeaking ? "Speaking..." : "Speak Aloud"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPromptModal;
