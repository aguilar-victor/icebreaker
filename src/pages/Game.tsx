import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Question } from '../types/game';
import { Clock, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Do you prefer working in a team over working alone?",
    category: "professional"
  },
  {
    id: 2,
    text: "Do you enjoy public speaking?",
    category: "professional"
  },
  {
    id: 3,
    text: "Are you a morning person?",
    category: "personal"
  },
  {
    id: 4,
    text: "Do you enjoy trying new cuisines?",
    category: "fun"
  },
  {
    id: 5,
    text: "Would you rather lead than follow?",
    category: "professional"
  }
];

export const Game: React.FC = () => {
  const { roomId } = useParams();
  const [phase, setPhase] = useState<'waiting' | 'answering' | 'discussing'>('waiting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const {
    currentUser,
    timeRemaining,
    setTimeRemaining,
    questions,
    setQuestions,
    answers,
    addAnswer
  } = useGameStore();

  useEffect(() => {
    setQuestions(SAMPLE_QUESTIONS);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (phase === 'answering' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, timeRemaining]);

  const handleAnswer = (answer: boolean) => {
    if (!currentUser) return;
    
    addAnswer({
      userId: currentUser.id,
      questionId: questions[currentQuestionIndex].id,
      answer,
      timestamp: Date.now()
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setPhase('discussing');
    }
  };

  if (phase === 'waiting') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin-slow">
              <Clock className="h-12 w-12 text-pink-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-white">Waiting for opponent...</h2>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/80">Room Code:</p>
              <p className="text-xl font-mono text-white">{roomId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'answering') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                <p className="text-white/80 text-sm">Question</p>
                <p className="text-white font-bold">{currentQuestionIndex + 1} of {questions.length}</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg px-4 py-2">
                <p className="text-white/80 text-sm">Time Left</p>
                <p className="text-white font-bold">{timeRemaining}s</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white text-center">
                {questions[currentQuestionIndex]?.text}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium hover:opacity-90 transition-all"
              >
                <ThumbsUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Yes
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl text-white font-medium hover:opacity-90 transition-all"
              >
                <ThumbsDown className="h-6 w-6 group-hover:scale-110 transition-transform" />
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <MessageCircle className="h-12 w-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Discussion Phase</h2>
          <p className="text-white/80">Time to discuss your different perspectives!</p>
          {/* TODO: Add discussion UI */}
        </div>
      </div>
    </div>
  );
}