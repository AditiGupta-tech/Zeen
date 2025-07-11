import { Card } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { Mic } from "lucide-react";
import { X, Volume2, Check, ArrowLeft, Paintbrush, Eraser, Redo2, Undo2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
interface GameModalProps {
  gameType: string;
  onClose: () => void;
}

const GameModal = ({ gameType, onClose }: GameModalProps) => {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [displayedColor, setDisplayedColor] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#000000"); 
  const [lineWidth, setLineWidth] = useState(5); 
  const [history, setHistory] = useState<ImageData[]>([]); 
  const [historyIndex, setHistoryIndex] = useState(-1);

  const words = {
    spelling: ["CAT", "DOG", "BIRD", "FISH", "TREE"],
    pronunciation: ["WONDERFUL", "BEAUTIFUL", "AMAZING", "FANTASTIC", "BRILLIANT"],
    confusion: ["BAD", "DAD", "BED", "DIG", "PIG"]
  };

  const colorWords = [
    { name: "RED", hex: "#EF4444" },
    { name: "BLUE", hex: "#3B82F6" },
    { name: "GREEN", hex: "#22C55E" },
    { name: "YELLOW", hex: "#EAB308" },
    { name: "PURPLE", hex: "#A855F7" },
    { name: "ORANGE", hex: "#F97316" },
    { name: "BLACK", hex: "#000000" },
    { name: "WHITE", hex: "#FFFFFF", textColor: "#000000" }, 
  ];

  const artColors = [
    { name: "Red", hex: "#EF4444", emoji: '🔴' },
    { name: "Blue", hex: "#3B82F6", emoji: '🔵' },
    { name: "Green", hex: "#22C55E", emoji: '🟢' },
    { name: "Yellow", hex: "#EAB308", emoji: '🟡' },
    { name: "Purple", hex: "#A855F7", emoji: '🟣' },
    { name: "Brown", hex: "#8B4513", emoji: '🟤' },
    { name: "Black", hex: "#000000", emoji: '⚫' },
    { name: "White", hex: "#FFFFFF", emoji: '⚪', textColor: "#000000" },
  ];

  const playIshaan = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const startSpeechRecognition = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);    
    playIshaan("Speak the word now!");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setIsListening(false); 

      const spokenWord = event.results[0][0].transcript.toUpperCase();
      const correct = spokenWord === currentWord.toUpperCase();
      setIsCorrect(correct);

      if (correct) {
        setScore(score + 1);
        playIshaan("Ekdum Jhakaas! Perfect!");
      } else {
        playIshaan("Try again!");
      }

      setTimeout(() => {
        generateNewWord();
        setUserInput("");
        setIsCorrect(null);
      }, 2000);
    };

    recognition.onerror = () => {
      setIsListening(false);
      playIshaan("Sorry, I couldn't hear you. Try again!");
    };

    recognition.start();
  };
  const checkAnswer = () => {
    let correct = false;
    if (gameType === "colorConfusion") {
      const correctColorName = colorWords.find(color => color.hex === displayedColor)?.name;
      correct = userInput.toUpperCase() === correctColorName;
    } else {
      correct = userInput.toUpperCase() === currentWord;
    }

    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      playIshaan("Ekdum Jhakaas! Well done!");
      setTimeout(() => {
        generateNewWord();
        setIsCorrect(null);
        setUserInput("");
      }, 2000);
    } else {
      playIshaan("Try again! You can do it!");
      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  const generateNewWord = () => {
    if (gameType === "colorConfusion") {
      const randomWordObj = colorWords[Math.floor(Math.random() * colorWords.length)];
      let randomDisplayColorObj = colorWords[Math.floor(Math.random() * colorWords.length)];

      while (randomDisplayColorObj.name === randomWordObj.name) {
        randomDisplayColorObj = colorWords[Math.floor(Math.random() * colorWords.length)];
      }

      setCurrentWord(randomWordObj.name); 
      setDisplayedColor(randomDisplayColorObj.hex); 
      playIshaan("What color is the word displayed in?");
    } else {
      const wordList = words[gameType as keyof typeof words] || words.spelling;
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setCurrentWord(randomWord);
    }
  };

  const startGame = () => {
    generateNewWord();
    if (gameType === "spelling") {
      playIshaan("Let's start! Listen carefully and spell the word.");
    } else if (gameType === "colorConfusion") {
      playIshaan("Let's start! Tell me the color of the word you see.");
    } else if (gameType === "art") {
      playIshaan("Welcome to Art Therapy! Let your creativity flow!");
    } else {
      playIshaan("Let's start the game!");
    }
  };

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.6;
    speechSynthesis.speak(utterance);
  };

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        if (history.length === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height); 
          saveCanvasState(ctx, true);
        } else {
          ctx.putImageData(history[historyIndex], 0, 0);
        }
      }
    }
  }, [history, historyIndex]); 

  const saveCanvasState = useCallback((ctxToUse?: CanvasRenderingContext2D, initialSave: boolean = false) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = ctxToUse || canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory(prevHistory => {
          if (initialSave || historyIndex === prevHistory.length - 1) {
            return [...prevHistory, imageData];
          } else {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            return [...newHistory, imageData];
          }
        });
        setHistoryIndex(prevIndex => prevIndex + 1);
      }
    }
  }, [historyIndex]); 

  const undo = () => {
    if (historyIndex > 0) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[historyIndex - 1], 0, 0);
        setHistoryIndex(prevIndex => prevIndex - 1);
        playIshaan("Undo!");
      }
    } else if (historyIndex === 0) {
      clearCanvas(false); 
      setHistoryIndex(-1); 
      playIshaan("Undo!");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[historyIndex + 1], 0, 0);
        setHistoryIndex(prevIndex => prevIndex + 1);
        playIshaan("Redo!");
      }
    }
  };

  const clearCanvas = (resetHistoryState: boolean = true) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (resetHistoryState) {
          setHistory([]);
          setHistoryIndex(-1); 
          saveCanvasState(ctx, true); 
          playIshaan("Canvas cleared!");
        }
      }
    }
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
      }
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = lineWidth;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
      }
    }
  }, [isDrawing, drawingColor, lineWidth]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) { 
      saveCanvasState();
    }
    setIsDrawing(false);
  }, [isDrawing, saveCanvasState]);

  useEffect(() => {
    if (gameType === "art") {
      const timer = setTimeout(() => {
        initializeCanvas();
      }, 50); 
      return () => clearTimeout(timer);
    }
  }, [gameType, initializeCanvas]); 

  const renderGame = () => {
    switch (gameType) {
      case "spelling":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">Spelling Game</h3>
              <p className="text-gray-600 mb-4">Listen to the word and spell it correctly!</p>
              <div className="text-6xl mb-4">🔤</div>
            </div>

            {currentWord && (
              <div className="space-y-4">
                <div className="text-center">
                  <Button
                    onClick={speakWord}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full"
                  >
                    <Volume2 className="mr-2 h-5 w-5" />
                    Hear Word
                  </Button>
                </div>

                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the word here..."
                  className="text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />

                <div className="text-center">
                  <Button
                    onClick={checkAnswer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
                  >
                    Check Answer
                  </Button>
                </div>
              </div>
            )}

            {!currentWord && (
              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        );
      case "pronunciation":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">Pronunciation Game</h3>
              <p className="text-gray-600 mb-4">Say the word aloud and compare it with Ishaan's pronunciation!</p>
              <div className="text-6xl mb-4">🗣️</div>
            </div>

            {currentWord ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-700">{currentWord}</div>
                  <Button
                    onClick={speakWord}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full"
                  >
                    <Volume2 className="mr-2 h-5 w-5" />
                    Hear Word
                  </Button>
                </div>
                {isListening && (
  <div className="flex justify-center mt-4">
    <div className="flex items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>

        <div className="relative w-full h-full flex items-center justify-center rounded-full bg-red-600 text-white">
          <Mic className="w-5 h-5" />
        </div>
      </div>

      {/* Listening Text */}
      <span className="text-red-600 font-semibold text-lg">Listening...</span>
    </div>
  </div>
)}
                <div className="text-center">
                  <Button
                    onClick={startSpeechRecognition}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
                  >
                    Start Speaking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        );

      case "confusion":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">Letter Confusion Game</h3>
              <p className="text-gray-600 mb-4">Type the word correctly! Watch out for confusing letters like b/d/p/q.</p>
              <div className="text-6xl mb-4">🔀</div>
            </div>

            {currentWord ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-700">Word: <span className="underline">{currentWord}</span></div>
                </div>

                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the word here..."
                  className="text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />

                <div className="text-center">
                  <Button
                    onClick={checkAnswer}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full"
                  >
                    Check Answer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full text-lg"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        );

      case "colorConfusion":
        const displayedWordColor = colorWords.find(color => color.hex === displayedColor);
        const textColorForWord = displayedWordColor?.textColor || displayedColor;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Color Confusion Game</h3>
              <p className="text-gray-600 mb-4">What color is the word displayed in?</p>
              <div className="text-6xl mb-4">🌈</div>
            </div>

            {currentWord ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className="text-7xl font-bold uppercase mb-6 p-4 rounded-lg border-2"
                    style={{ color: textColorForWord, borderColor: textColorForWord }}
                  >
                    {currentWord}
                  </div>
                </div>

                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the display color (e.g., BLUE)..."
                  className="text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />

                <div className="text-center">
                  <Button
                    onClick={checkAnswer}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full"
                  >
                    Check Answer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full text-lg"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        );

      case "art":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Art Therapy</h3>
              <p className="text-gray-600 mb-4">Express yourself through colors and drawing!</p>
              <div className="text-6xl mb-4">🎨</div>
            </div>

            <div className="bg-white border-4 border-dashed border-gray-300 rounded-lg overflow-hidden relative"
              style={{ minHeight: '300px' }}> 
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing} 
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
               
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {artColors.map((color, index) => (
                <Button
                  key={index}
                  className={`w-12 h-12 rounded-full text-2xl p-0 ${drawingColor === color.hex && lineWidth !== 15 ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color.hex, color: color.textColor || 'white' }}
                  onClick={() => {
                    setDrawingColor(color.hex);
                    setLineWidth(5); 
                    playIshaan(`Selected ${color.name}!`);
                  }}
                >
                  {color.emoji}
                </Button>
              ))}
              {/* Eraser button (White color) */}
              <Button
                className={`w-12 h-12 rounded-full text-2xl p-0 ${drawingColor === '#FFFFFF' && lineWidth === 15 ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
                variant="outline"
                onClick={() => {
                  setDrawingColor("#FFFFFF"); 
                  setLineWidth(20); 
                  playIshaan("Eraser selected!");
                }}
              >
                <Eraser className="h-6 w-6 text-gray-700" />
              </Button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0} 
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Undo2 className="mr-2 h-4 w-4" /> Undo
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1} 
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Redo2 className="mr-2 h-4 w-4" /> Redo
              </Button>
              <Button
                onClick={() => clearCanvas(true)} 
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        );


      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Game Coming Soon!</h3>
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-600">This amazing game is being prepared for you!</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-bold">Score: {score}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {renderGame()}

          {isCorrect !== null && (
            <div className={`mt-6 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-5 w-5" />
                  <span className="font-bold">Ekdum Jhakaas! 🌟</span>
                </div>
              ) : (
                <span className="font-bold">Try again! You can do it! 💪</span>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameModal;