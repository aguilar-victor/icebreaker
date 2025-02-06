import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Users, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { createRoom, joinRoom } from '../lib/supabase';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setCurrentUser = useGameStore((state) => state.setCurrentUser);

  const handleCreateRoom = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      const userId = Math.random().toString(36).substr(2, 9);
      setCurrentUser({
        id: userId,
        username,
        isGuest: false
      });
      
      const room = await createRoom(userId, password);
      navigate(`/game/${room.id}`);
    } catch (err) {
      setError('Failed to create room');
    }
  };

  const handleJoinRoom = async () => {
    if (!username || !password || !roomId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userId = Math.random().toString(36).substr(2, 9);
      setCurrentUser({
        id: userId,
        username,
        isGuest: false
      });
      
      await joinRoom(roomId, password, userId);
      navigate(`/game/${roomId}`);
    } catch (err) {
      setError('Invalid room ID or password');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-3">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-2">
              Welcome to Sync&Chat
            </h1>
            <p className="text-white/80">
              Break the ice and spark meaningful conversations
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
              />
              <input
                type="password"
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full group relative px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-all overflow-hidden"
            >
              <span className="relative flex items-center justify-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Room
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white/60">Or</span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
              />
              <button
                onClick={handleJoinRoom}
                className="w-full group relative px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-all"
              >
                <span className="relative flex items-center justify-center gap-2">
                  Join Room
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}