// import { useState, useEffect } from 'react';
// import { getChatResponse } from '../lib/chatbot';
// import { ChatHistory } from '../lib/chatbot';
// import Navigation from '../components/Navbar';
// import Footer from '../components/Footer';
// import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw'; 

// type ChatMessage = {
//   id: number;
//   sender: 'user' | 'guide'; 
//   content: string; 
// };

// export default function GuidancePage() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [copyFeedback, setCopyFeedback] = useState<{ [key: number]: boolean }>({});

//   useEffect(() => {
//     async function loadInitialGreeting() {
//       if (messages.length === 0) {
//         setIsLoading(true); 
//         try {
//           const initialGreetingPrompt = "Provide a warm and welcoming initial greeting for an AI assistant specialized in dyslexia support. Make it clear I'm here to help with information and guidance related to dyslexia.";
//           const response = await getChatResponse(initialGreetingPrompt, []); 

//           setMessages([{
//             sender: 'guide',
//             content: response, 
//             id: 0,
//           }]);
//         } catch (error) {
//           console.error("Error loading initial greeting:", error);
//           const fallback = "Hello! I'm here to help you understand and navigate challenges related to dyslexia and related learning/reading diifculties. How can I assist you today?";
//           setMessages([{
//             sender: 'guide',
//             content: fallback,
//             id: 0,
//           }]);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     }
//     loadInitialGreeting();
//   }, []); 

//   const handleCopy = (text: string, messageId: number) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopyFeedback(prev => ({ ...prev, [messageId]: true }));
//       setTimeout(() => {
//         setCopyFeedback(prev => ({ ...prev, [messageId]: false }));
//       }, 2000);
//     }).catch(err => {
//       console.error('Failed to copy text: ', err);
//     });
//   };

//   const renderMessageContent = (content: string, messageId: number, isGuideMessage: boolean) => {
//     return (
//       <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative">
//         {/* Copy button  */}
//         {isGuideMessage && (
//           <div className="absolute top-2 right-2 z-10">
//             <button
//               onClick={() => handleCopy(content, messageId)} 
//               className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-70 transition-all duration-200 shadow-sm hover:shadow-md"
//               title="Copy response"
//             >
//               {copyFeedback[messageId] ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 0h-2M10 18H8m4 0h-4" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         )}

//         <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
//           <ReactMarkdown rehypePlugins={[rehypeRaw]}>
//             {content}
//           </ReactMarkdown>
//         </div>
//       </div>
//     );
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const newMessageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
//     const newUserMessage: ChatMessage = {
//       sender: 'user', 
//       content: input,
//       id: newMessageId,
//     };

//     setMessages(prev => [...prev, newUserMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const historyForBackend: ChatHistory[] = messages
//         .filter(msg => msg.id !== 0) 
//         .map(msg => ({
//           role: msg.sender === 'user' ? 'user' : 'model',
//           parts: [{ text: msg.content }]
//         }));

//       const response: string = await getChatResponse(newUserMessage.content, historyForBackend);

//       setMessages(prev => [...prev, {
//         sender: 'guide',
//         content: response,
//         id: newMessageId + 1,
//       }]);
//     } catch (error) {
//       console.error("Error getting response:", error);
//       const apologyMessage = "I apologize, but there was an issue retrieving a response at this moment. Please try again in a few moments. For urgent concerns, please consult a professional specializing in dyslexia.";

//       setMessages(prev => [...prev, {
//         sender: 'guide',
//         content: apologyMessage,
//         id: newMessageId + 1,
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans text-gray-800">
//       <Navigation />

//       <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mt-10 mx-auto bg-white rounded-xl shadow-md p-6 lg:p-8 space-y-6 border border-gray-100">

//           {/* Header */}
//           <div className="text-center mb-4">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8E66CB] to-pink-500 mb-2 leading-tight">
//               Dyslexia Support AI
//             </h2>
//             <p className="text-base text-gray-600 max-w-2xl mx-auto font-medium">
//               Your empathetic AI companion for understanding dyslexia, exploring strategies, and finding resources.
//             </p>
//           </div>

//           {/* Chat Messages Area */}
//           <div className="space-y-6 overflow-y-auto max-h-[65vh] p-2 custom-scrollbar">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`p-4 rounded-2xl shadow-md relative transition-all duration-300 ease-in-out transform ${
//                   msg.sender === 'user'
//                     ? 'bg-green-400 text-gray-800 ml-auto w-fit max-w-[85%] rounded-br-none'
//                     : 'bg-blue-200 text-gray-800 mr-auto w-fit max-w-[85%] rounded-bl-none'
//                 }`}
//               >
//                 {renderMessageContent(msg.content, msg.id, msg.sender === 'guide')}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="bg-gray-50 p-4 rounded-2xl mr-auto w-fit max-w-[85%] text-gray-600 italic flex items-center animate-pulse shadow-md">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Zeen AI Assistant is thinking...
//               </div>
//             )}
//           </div>

//           {/* Chat Input Area */}
//           <div className="flex gap-2 pt-4 border-t border-gray-100">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Ask anything about dyslexia..."
//               className="flex-1 px-3 py-2.5 border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-gray-800 text-sm shadow-inner placeholder-gray-400 outline-none"
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSend}
//               className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2.5 rounded-none
//                                   hover:from-teal-600 hover:to-cyan-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed
//                                   transition-all duration-200 font-semibold text-sm flex items-center justify-center shadow-md hover:shadow-lg"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <>
//                   Send
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 -mr-1 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { getChatResponse } from '../lib/chatbot';
import Navigation from '../components/Navbar';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; 

type ChatMessage = {
  id: number;
  sender: 'user' | 'guide'; 
  content: string; 
};

export default function GuidancePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function loadInitialGreeting() {
      if (messages.length === 0) {
        setIsLoading(true); 
        try {
          // No history needed for the initial greeting as per previous changes
          const initialGreetingPrompt = "Provide a warm and welcoming initial greeting for an AI assistant specialized in dyslexia support. Make it clear I'm here to help with information and guidance related to dyslexia.";
          const response = await getChatResponse(initialGreetingPrompt); 

          setMessages([{
            sender: 'guide',
            content: response, 
            id: 0,
           }]);
        } catch (error) {
          console.error("Error loading initial greeting:", error);
          const fallback = "Hello! I'm here to help you understand and navigate challenges related to dyslexia and related learning/reading difficulties. How can I assist you today?";
          setMessages([{
            sender: 'guide',
            content: fallback,
            id: 0,
          }]);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadInitialGreeting();
  }, []); 

  const handleCopy = (text: string, messageId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(prev => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const renderMessageContent = (content: string, messageId: number, isGuideMessage: boolean) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative">
        {/* Copy button  */}
        {isGuideMessage && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => handleCopy(content, messageId)} 
              className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-70 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Copy response"
            >
              {copyFeedback[messageId] ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 0h-2M10 18H8m4 0h-4" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    const newUserMessage: ChatMessage = {
      sender: 'user', 
      content: input,
      id: newMessageId,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Calling getChatResponse without history
      const response: string = await getChatResponse(newUserMessage.content);

      setMessages(prev => [...prev, {
        sender: 'guide',
        content: response,
        id: newMessageId + 1,
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
      const apologyMessage = "I apologize, but there was an issue retrieving a response at this moment. Please try again in a few moments. For urgent concerns, please consult a professional specializing in dyslexia.";

      setMessages(prev => [...prev, {
        sender: 'guide',
        content: apologyMessage,
        id: newMessageId + 1,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans text-gray-800">
      <Navigation />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mt-10 mx-auto bg-white rounded-xl shadow-md p-6 lg:p-8 space-y-6 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8E66CB] to-pink-500 mb-2 leading-tight">
              Dyslexia Support AI
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto font-medium">
              Your empathetic AI companion for understanding dyslexia, exploring strategies, and finding resources.
            </p>
          </div>

          {/* Chat Messages Area */}
          <div className="space-y-6 overflow-y-auto max-h-[65vh] p-2 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl shadow-md relative transition-all duration-300 ease-in-out transform ${
                  msg.sender === 'user'
                    ? 'bg-green-400 text-gray-800 ml-auto w-fit max-w-[85%] rounded-br-none'
                    : 'bg-blue-200 text-gray-800 mr-auto w-fit max-w-[85%] rounded-bl-none'
                }`}
              >
                {renderMessageContent(msg.content, msg.id, msg.sender === 'guide')}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-50 p-4 rounded-2xl mr-auto w-fit max-w-[85%] text-gray-600 italic flex items-center animate-pulse shadow-md">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Zeen AI Assistant is thinking...
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about dyslexia..."
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-gray-800 text-sm shadow-inner placeholder-gray-400 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2.5 rounded-none
                          hover:from-teal-600 hover:to-cyan-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200 font-semibold text-sm flex items-center justify-center shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Send
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 -mr-1 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}