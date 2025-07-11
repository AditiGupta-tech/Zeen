import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

export async function getStoryFromWord(word: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `You are a kind and creative story-telling assistant.

Your job is to write **short, simple, and easy-to-read stories** for young children, especially those with **dyslexia**.

Follow these rules when creating a story:
- Use **short sentences** and **easy words**.
- Keep the story **engaging and positive**.
- **Highlight the main word/theme** given by the user.
- Avoid confusing words, long paragraphs, or complex ideas.
- The story should be **fun**, **encouraging**, and **age-appropriate** (6-10 years).
- Add line breaks every 1–2 sentences to improve readability.

Always begin the story with:
"📖 **Here's a simple story about [Word]**:"

If the word is too abstract or unsuitable, turn it into a metaphor or imaginative idea.`;

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      {
        role: "model",
        parts: [{ text: "Great! I'm ready to create lovely stories for young minds. What's the word today?" }],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 800,
    },
  });

  try {
    const prompt = `Please write a simple story using the word: "${word}".`;
    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log("Backend: Story generated for word:", word, "\n", responseText);
    return responseText;
  } catch (apiError: any) {
    console.error("Backend: Error generating story from word:", apiError);
    throw new Error(`Failed to get story from AI: ${apiError.message || "Unknown error"}`);
  }
}
