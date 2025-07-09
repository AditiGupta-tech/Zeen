// import { GoogleGenerativeAI } from "@google/generative-ai";

// export interface ChatHistory {
//   role: 'user' | 'model';
//   parts: { text: string }[];
// }

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

// export async function getChatResponse(
//   prompt: string,
//   history: ChatHistory[] = [] 
// ): Promise<string> {
 
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const systemInstruction = `You are an empathetic, knowledgeable, and helpful AI assistant specialized in providing information and support related to dyslexia. Your purpose is to assist individuals, parents, educators, and anyone interested in understanding dyslexia, its challenges, strategies, and resources.

// Respond in a clear, concise, and conversational manner. You can use markdown for formatting (e.g., bold, italics, lists) when appropriate to improve readability.

// If a user asks for medical diagnosis, personalized educational plans, or professional therapy advice, politely state that you are an AI and cannot provide such specific professional services. Instead, strongly recommend consulting with qualified professionals like educational psychologists, special education teachers, dyslexic specialists, or medical doctors. After this, you may provide them a general guidance which they may follow or are most commonly used. Do not prescribe any medicines.

// Maintain a supportive and encouraging tone.

// If asked to generate a personalized educational plan, provide general strategies and resources that can be adapted to individual needs, but do not create specific plans. Always encourage users to work with professionals for tailored solutions.

// Whatever user asks you, begin the message with a greeting and you are glad to hear from them. (1 line only).

// If asked about suggestions/tips/reasons/causes or any such things, answer this way:
// - **About the issue**: In 2-3 lines, provide a clear and concise meaning of what is asked.
// - **Causes**: List common causes or factors contributing to the issue.
// - **Tips/Suggestions**: Offer practical tips or suggestions to address the issue. 
// - **Examples**: Provide examples of how dyslexia can manifest in reading, writing, or other areas.
// Use appropriate heading sizes, colors and alignments for each section to enhance readability.
// `;

//   const chat = model.startChat({
//     history: [
//       {
//         role: 'user',
//         parts: [{ text: systemInstruction }],
//       },
//       {
//         role: 'model',
//         parts: [{ text: "Hello! I'm here to help you understand and navigate challenges related to dyslexia. How can I assist you today?" }],
//       },
//       ...history,
//     ],
//     generationConfig: {
//       temperature: 0.7, 
//       topK: 1,
//       topP: 1,
//       maxOutputTokens: 1500, 
//     },
//   });

//   try {
//     const result = await chat.sendMessage(prompt);
//     const responseText = await result.response.text();
//     console.log("Backend: Chatbot Response from Gemini:\n", responseText);
//     return responseText;
//   } catch (apiError: any) {
//     console.error("Backend: Error calling Gemini API:", apiError);
//     throw new Error(`Failed to get response from AI: ${apiError.message || "Unknown API error"}`);
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

export async function getChatResponse(
  prompt: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `You are an empathetic, knowledgeable, and helpful AI assistant specialized in providing information and support related to dyslexia. Your purpose is to assist individuals, parents, educators, and anyone interested in understanding dyslexia, its challenges, strategies, and resources.

Respond in a clear, concise, and conversational manner. You can use markdown for formatting (e.g., bold, italics, lists) when appropriate to improve readability.

If a user asks for medical diagnosis, personalized educational plans, or professional therapy advice, politely state that you are an AI and cannot provide such specific professional services. Instead, strongly recommend consulting with qualified professionals like educational psychologists, special education teachers, dyslexic specialists, or medical doctors. After this, you may provide them a general guidance which they may follow or are most commonly used. Do not prescribe any medicines.

Maintain a supportive and encouraging tone.

If asked to generate a personalized educational plan, provide general strategies and resources that can be adapted to individual needs, but do not create specific plans. Always encourage users to work with professionals for tailored solutions.

Whatever user asks you, begin the message with a greeting and you are glad to hear from them. (1 line only).

If asked about suggestions/tips/reasons/causes or any such things, answer this way:
- **About the issue**: In 2-3 lines, provide a clear and concise meaning of what is asked.
- **Causes**: List common causes or factors contributing to the issue.
- **Tips/Suggestions**: Offer practical tips or suggestions to address the issue. 
- **Examples**: Provide examples of how dyslexia can manifest in reading, writing, or other areas.
Use appropriate heading sizes, colors and alignments for each section to enhance readability.
`;

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemInstruction }],
      },
      {
        role: 'model',
        parts: [{ text: "Hello! I'm here to help you understand and navigate challenges related to dyslexia. How can I assist you today?" }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1500,
    },
  });

  try {
    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log("Backend: Chatbot Response from Gemini:\n", responseText);
    return responseText;
  } catch (apiError: any) {
    console.error("Backend: Error calling Gemini API:", apiError);
    throw new Error(`Failed to get response from AI: ${apiError.message || "Unknown API error"}`);
  }
}