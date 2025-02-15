import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Timer, Users, ArrowLeft } from 'lucide-react';
import { categories } from '../lib/utils';
import { supabase } from '../lib/supabase';

const questions = {
  'Fun Facts': [
    "What's the most unusual food you've ever eaten?",
    "What's a random skill you have that most people don't know about?",
    "What's the strangest dream you've ever had?",
    "What's the most interesting place you've ever visited?",
    "What's a weird habit you have?",
    "What's the most adventurous thing you've ever done?",
    "What's your favorite childhood memory?",
    "What's the most embarrassing song you love?",
    "What's the worst fashion choice you've ever made?",
    "What's a funny nickname you've been given?"
  ],
  'Would You Rather': [
    "Would you rather be able to fly or be invisible?",
    "Would you rather live in the past or the future?",
    "Would you rather be super strong or super fast?",
    "Would you rather have unlimited money or unlimited time?",
    "Would you rather be a famous musician or a famous actor?",
    "Would you rather live without music or without movies?",
    "Would you rather be able to speak all languages or play all instruments?",
    "Would you rather have the ability to read minds or predict the future?",
    "Would you rather be the funniest person or the smartest person in a room?",
    "Would you rather travel the world or live in one place in luxury?"
  ],
  // Add more categories and questions...
};

export default function GameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [gameState, setGameState] = useState<'category' | 'playing' | 'results'>('category');
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const roomSubscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      }, payload => {
        if (payload.new.category) {
          setCategory(payload.new.category);
          setGameState('playing');
        }
      })
      .subscribe();

    const playersSubscription = supabase
      .channel(`players:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${roomId}`,
      }, () => {
        supabase
          .from('players')
          .select()
          .eq('room_id', roomId)
          .then(({ data }) => {
            if (data) setPlayers(data);
          });
      })
      .subscribe();

    // Get initial room state and players
    Promise.all([
      supabase.from('rooms').select().eq('id', roomId).single(),
      supabase.from('players').select().eq('room_id', roomId),
    ]).then(([roomResult, playersResult]) => {
      if (roomResult.data?.category) {
        setCategory(roomResult.data.category);
        setGameState('playing');
      }
      if (playersResult.data) {
        setPlayers(playersResult.data);
      }
    });

    return () => {
      roomSubscription.unsubscribe();
      playersSubscription.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    if (gameState !== 'playing' || !category) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestion < 9) {
            setCurrentQuestion(prev => prev + 1);
            return 15;
          } else {
            setGameState('results');
            clearInterval(timer);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, category, currentQuestion]);

  async function selectCategory(selectedCategory: string) {
    if (!roomId) return;

    await supabase
      .from('rooms')
      .update({ category: selectedCategory })
      .eq('id', roomId);

    setCategory(selectedCategory);
    setGameState('playing');
  }

  async function submitAnswer(answer: string) {
    if (!roomId) return;

    await supabase
      .from('answers')
      .insert([{
        room_id: roomId,
        question_number: currentQuestion,
        answer
      }]);

    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  }

  function playAgain() {
    setCategory('');
    setCurrentQuestion(0);
    setTimeLeft(15);
    setAnswers({});
    setGameState('category');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2900')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <div className="fixed top-4 left-4 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200"
        >
          <Home className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-600 font-medium">Home</span>
        </button>
      </div>

      {/* Player count */}
      <div className="fixed top-4 right-4 z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
          <Users className="w-5 h-5 text-purple-600" />
          <span className="text-purple-600 font-medium">{players.length} Players</span>
        </div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {gameState === 'category' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Choose a Category
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100
                           transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <h3 className="font-bold text-xl text-indigo-900 group-hover:text-indigo-700 transition-colors">
                    {cat}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {category}
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100">
                <Timer className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-600 font-bold">{timeLeft}s</span>
              </div>
            </div>

            <div className="mb-8 space-y-6">
              <p className="text-3xl text-center font-medium text-gray-800 mb-8">
                {questions[category as keyof typeof questions][currentQuestion]}
              </p>
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={(e) => submitAnswer(e.target.value)}
                className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200
                         transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Type your answer..."
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Question {currentQuestion + 1} of 10</span>
            </div>
          </div>
        )}

        {gameState === 'results' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Results
            </h1>
            <div className="space-y-6 mb-8">
              {Object.entries(answers).map(([questionNum, answer]) => (
                <div key={questionNum} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <p className="font-medium text-gray-900 mb-3 text-lg">
                    {questions[category as keyof typeof questions][parseInt(questionNum)]}
                  </p>
                  <p className="text-indigo-600 font-medium">{answer}</p>
                </div>
              ))}
            </div>
            <button
              onClick={playAgain}
              className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium
                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                       transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
