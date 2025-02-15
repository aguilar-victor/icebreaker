import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Timer, Users, ArrowLeft } from 'lucide-react';
import { categories } from '../lib/utils';
import { supabase } from '../lib/supabase';

const questions = {
  'Fun Facts': [
    "The most cringeworthy thing that's ever happened to you.",
    "Something on your to-do list that you haven't checked off yet.",
    "Who you would switch lives with for a day.",
    "Your favorite holiday and why.",
    "The weirdest thing you've Googled recently.",
    "Who you'd have dinner with from history.",
    "Guilty pleasure show or movie.",
    "What you'd do if you won the lottery tomorrow.",
    "The most random talent you have.",
    "Your most cherished possession."
  ],
  'Would You Rather': [
    "Fly or be invisible?", 
    "Live in the past or future?", 
    "Be super strong or super-fast?", 
    "Have unlimited money or unlimited time?", 
    "Be a famous musician or famous actor?", 
    "Live without music or without movies?", 
    "Speak all languages or play all instruments?", 
    "Read minds or predict the future?", 
    "Be the funniest or smartest person in the room?", 
    "Travel the world or live in one place in luxury?"
  ],
  'Personal Preferences': [
    "How you spend a Saturday afternoon.", 
    "Are you a morning person or night owl?", 
    "Sweet or savory snacks?", 
    "What music do you listen to when you want to relax.", 
    "Book or movie?", 
    "Your go-to comfort food.", 
    "Last TV show you binged.", 
    "Winter holidays or summer vacations?", 
    "Nature or shopping mall?", 
    "Cats, dogs or something else?"
  ],
  'Hypothetical Scenarios': [
    "What skill you'd instantly master."
    "Past or future?",
    "What you'd say on stage to thousands?", 
    "What cuisine you'd eat for the rest of your life?", 
    "What you'd spend a million dollars on?", 
    "What you'd ask your future self?", 
    "What superpower you'd choose?", 
    "What hobby you'd turn into a career?",
    "You're switching lives with someone for a week, who would it be and why?",
    "You're bringing one fictional invention to life, what would it be and how would you use it?"
  ],
  'Random Fun': [
    "The wildest thing you've ever done on a dare.",
    "The best joke you know.",
    "If you were a superhero, what your superpower would be.",
    "The best prank you've ever pulled.",
    "The weirdest talent you have.",
    "One best advice you've ever been given.",
    "Something you've always wanted to try but never had the courage to.",
    "If you could have dinner with any fictional character, who would it be.",
    "The strangest thing you've ever collected.",
    "If you could be famous for one thing, what would it be."
  ],
  'Travel & Adventure': [
    "If you could take a year off to travel, where you'd go first.",
    "The most interesting place you've been.",
    "If you could visit any country, where it would be.",
    "Your idea of the perfect holiday.",
    "If you could live on a tropical island, would you? Why or why not?",
    "Your favorite mode of transport.",
    "If you could travel back in time, what time period you'd visit.",
    "Your dream road trip.",
    "If you could live in a foreign country, which one would you choose.",
    "Beach or mountain?"
  ],
  'Life Goals and Ambitions': [
    "One goal you've set for yourself this year.",
    "If money were no object, what would you do with your life.",
    "One skill you'd love to master.",
    "Do you live by the plan or go with the flow?",
    "One thing you've always wanted to learn but never got around to.",
    "If you could change one thing in the world, what would it be.",
    "If you could achieve anything in your lifetime, what would it be.",
    "What success means to you.",
    "One thing you'd like to have done by the time you're 30.",
    "How you stay motivated when you're chasing your dreams."
  ],
  'Pop Culture': [
    "Who's your favorite fictional character and why?",
    "If you could meet any celebrity, who it would be.",
    "Your favorite movie of all time and why.",
    "If you could be in any movie, which one you'd be.",
    "Your favorite song to listen to on repeat.",
    "The best concert or live event you've ever been to.",
    "Who's your favorite music artist or band?",
    "What you last watched and loved.",
    "Favorite book or book series.",
    "If you could be a character in any TV show, who you'd be and why."
  ],
  'Food and Drinks': [
    "Breakfast, lunch, or dinner?",
    "If you could only eat one type of food for the rest of your life, what would it be.",
    "The strangest food combination you like.",
    "Savory snacks or sweet ones?",
    "Your comfort food.",
    "If you could only drink one thing for the rest of your life, what would it be.",
    "The most exotic food you've ever had.",
    "If you could only have one dessert forever, what would it be.",
    "Do you cook? What's your go-to dish?",
    "If you had to eat the same thing for dinner every day, what would it be?"
  ],
  'Technology and Gadgets': [
    "The one gadget you can't live without.",
    "If you could invent any new tech, what would it be.",
    "Would you rather have no smartphones or no computers?",
    "If you could have any gadget or tech from a sci-fi movie, what would it be.",
    "Your favorite app and why.",
    "Apple or Android?",
    "Would you rather have a robot that cleans your house or cooks for you?",
    "If you could be the first to try a new piece of tech, would you?",
    "Do you think we'll ever have flying cars? Why or why not?",
    "The coolest app or website you've discovered lately."
  ],
  'Dreams and Imagination': [
    "Ever had a recurring dream? What it was about.",
    "The weirdest dream you can remember.",
    "If you could live in a dream world, what would it look like.",
    "The most beautiful dream you've ever had.",
    "If you could control your dreams, what you'd do in them.",
    "Ever had a dream that felt so real you thought it was real life?",
    "If you could enter any fictional world, which one you'd choose?",
    "Did you ever dream about someone you know? What happened.",
    "Do you think dreams mean anything? Why or why not.",
    "What it would be like to live in a world where dreams come true."
  ],
  'Memory Lane': [
    "Your favorite childhood memory.",
    "What was your favorite subject at school.",
    "A funny story your parents or family tell about you.",
    "The most adventurous thing you did as a kid.",
    "Who was your childhood hero.",
    "What was your first job and what you learned from it.",
    "The most valuable lesson you've learned so far.",
    "What was the best gift you ever received as a kid.",
    "Your favorite family tradition.",
    "The most embarrassing thing that's ever happened to you at school."
  ],
  'Chill & Thrills': [
    "Do you have any irrational fears?",
    "Your biggest fear in life.",
    "If you could overcome one fear, which one would it be.",
    "Do you like horror movies or do they scare you?",
    "Have you ever faced your biggest fear? What happened?",
    "If you could get rid of a fear instantly, which one it would be.",
    "Do fears make you braver?",
    "The bravest thing you've ever done.",
    "Are some fears just born in us?",
    "You are planning to spook someone. How you'd do it."
  ],
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
