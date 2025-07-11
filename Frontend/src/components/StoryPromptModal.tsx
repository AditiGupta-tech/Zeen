import React, { useState } from "react";
import { getStoryFromWord } from "./getStoryFromWord";
import { X } from "lucide-react";

const StoryPromptModal = ({ onClose }: { onClose: () => void }) => {
  const [word, setWord] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

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
          <div className="mt-4 p-3 bg-gray-100 rounded whitespace-pre-line max-h-[300px] overflow-y-auto">
            {story}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPromptModal;
