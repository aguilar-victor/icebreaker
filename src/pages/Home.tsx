import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';
import { generateRoomCode } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { setPlayerName, setRoomCode } = useGame();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  async function createRoom() {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    const roomCode = generateRoomCode();
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert([{ code: roomCode }])
      .select()
      .single();

    if (roomError || !room) {
      setError('Failed to create room');
      return;
    }

    const { error: playerError } = await supabase
      .from('players')
      .insert([{ room_id: room.id, name }]);

    if (playerError) {
      setError('Failed to create player');
      return;
    }

    setPlayerName(name);
    setRoomCode(roomCode);
    navigate(`/waiting/${room.id}`);
  }

  async function joinRoom() {
    if (!name.trim() || !code.trim()) {
      setError('Please enter your name and room code');
      return;
    }

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select()
      .eq('code', code.toUpperCase())
      .single();

    if (roomError || !room) {
      setError('Invalid room code');
      return;
    }

    const { error: playerError } = await supabase
      .from('players')
      .insert([{ room_id: room.id, name }]);

    if (playerError) {
      setError('Failed to join room');
      return;
    }

    setPlayerName(name);
    setRoomCode(code.toUpperCase());
    navigate(`/game/${room.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2900')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10 border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <Users className="w-16 h-16 text-indigo-600" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-3"
            style={{ lineHeight: 'normal' }}
          >
            Sync&Cha
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter your name"
            />
          </div>

          <button
            onClick={createRoom}
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium
                     bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                     transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create New Room <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          <div className="relative">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>{' '}
              {/* Left side line */}
              <span className="px-4" style={{ textDecoration: 'none' }}>
                Or join existing
              </span>{' '}
              {/* Text with padding */}
              <div className="flex-grow border-t border-gray-300"></div>{' '}
              {/* Right side line */}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Room Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter room code"
            />
          </div>

          <button
            onClick={joinRoom}
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium
                     bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                     transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join Room <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
