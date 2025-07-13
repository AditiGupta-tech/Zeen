import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "./Button";
import { ObjectDetector, FilesetResolver, ObjectDetectorResult, Category } from '@mediapipe/tasks-vision';

interface ObjectRecognitionGameProps {
  onScore: () => void;
  onClose: () => void;
}

const ObjectRecognitionGame: React.FC<ObjectRecognitionGameProps> = ({ onScore, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const liveViewRef = useRef<HTMLDivElement>(null);
  const [objectDetector, setObjectDetector] = useState<ObjectDetector | null>(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [currentObjectToFind, setCurrentObjectToFind] = useState<string>('');
  const [score, setGameScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFindingObject, setIsFindingObject] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const currentTargetObjectIndexRef = useRef(0);

  const [targetObjects] = useState<string[]>([
    'bottle', 'book', 'cup', 'chair', 'table', 'keyboard', 'mouse',
    'cell phone', 'laptop', 'remote', 'tv', 'backpack', 'clock', 'lamp',
    'pillow', 'bed', 'teddy bear', 'scissors', 'toothbrush', 'plant',
    'pen', 'notebook', 'shoe', 'sock', 'charger', 'comb'
  ]);

  const playIshaan = useCallback((message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name.includes("Heera") || v.name.includes("Google UK English Female") || v.lang === "en-IN") || voices.find((v) => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const initializeDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm");
      const detector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
          delegate: "GPU"
        },
        scoreThreshold: 0.1,
        runningMode: "VIDEO"
      });
      setObjectDetector(detector);
      setFeedbackMessage("Object detection game is ready! Click 'Enable Webcam' to begin.");
      playIshaan("Object detection game is ready! Click Enable Webcam to begin.");
    };
    initializeDetector();
    return () => {
      if (objectDetector) objectDetector.close();
    };
  }, [playIshaan]);

  useEffect(() => {
    if (objectDetector && gameStarted && targetObjects.length > 0 && !currentObjectToFind) {
      const initialTarget = targetObjects[currentTargetObjectIndexRef.current];
      setCurrentObjectToFind(initialTarget);
      setFeedbackMessage(`Find a ${initialTarget}!`);
      playIshaan(`Find a ${initialTarget}!`);
      setIsFindingObject(true);
    }
  }, [objectDetector, gameStarted, targetObjects, playIshaan, currentObjectToFind]);

  const predictWebcam = useCallback(() => {
    const loop = async () => {
      if (!objectDetector || !videoRef.current || !liveViewRef.current) {
        window.requestAnimationFrame(predictWebcam);
        return;
      }

      if (!isFindingObject) {
        window.requestAnimationFrame(predictWebcam);
        return;
      }

      let detections: ObjectDetectorResult;
      try {
        detections = objectDetector.detectForVideo(videoRef.current, performance.now());
      } catch {
        window.requestAnimationFrame(predictWebcam);
        return;
      }

      const found = detections.detections.some(detection =>
        detection.categories.some((category: Category) =>
          category.categoryName.toLowerCase() === currentObjectToFind.toLowerCase()
        )
      );

      if (found) {
        setIsFindingObject(false);
        setFeedbackMessage(`Found a ${currentObjectToFind}!`);
        playIshaan(`Great job! You found a ${currentObjectToFind}!`);
        onScore();
        setGameScore(prev => prev + 1);
        setTimeout(() => {
          currentTargetObjectIndexRef.current = (currentTargetObjectIndexRef.current + 1) % targetObjects.length;
          const next = targetObjects[currentTargetObjectIndexRef.current];
          setCurrentObjectToFind(next);
          setFeedbackMessage(`Find a ${next}!`);
          playIshaan(`Find a ${next}!`);
          setIsFindingObject(true);
        }, 2000);
      } else {
        if (detections.detections.length > 0) {
          setFeedbackMessage(`Looking for a ${currentObjectToFind}...`);
        } else {
          setFeedbackMessage('No objects detected. Keep looking!');
        }
      }

      window.requestAnimationFrame(predictWebcam);
    };

    loop();
  }, [objectDetector, currentObjectToFind, onScore, playIshaan, targetObjects, isFindingObject]);

  const enableCam = async () => {
    if (!objectDetector) {
      playIshaan("Object detector is still loading. Please wait.");
      return;
    }

    setWebcamEnabled(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", () => {
        setGameStarted(true);
        predictWebcam();
      }, { once: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-teal-800 mb-4">Object Recognition Game</h3>
        <p className="text-gray-600 mb-4">Find the objects with your webcam!</p>
        <div className="text-6xl mb-4">👁️</div>
      </div>

      <div id="liveView" className="videoView relative mx-auto" ref={liveViewRef}>
        {!webcamEnabled && (
          <Button
            id="webcamButton"
            onClick={enableCam}
            className="mdc-button mdc-button--raised bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg absolute inset-0 m-auto z-10"
            disabled={!objectDetector}
          >
            <span className="mdc-button__label">ENABLE WEBCAM</span>
          </Button>
        )}
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto block transform rotateY(180deg)"></video>
        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white p-3 rounded-lg flex justify-between items-center z-20">
          <div>
            <p className="text-xl font-bold">Find: <span className="text-yellow-300 capitalize">{currentObjectToFind}</span></p>
            <p className="text-lg">Game Score: {score}</p>
            <p className="text-md text-gray-300">{feedbackMessage}</p>
          </div>
          <Button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
            Close Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObjectRecognitionGame;
