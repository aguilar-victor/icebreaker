import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Users, Home, Copy, Check } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';

export default function WaitingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { roomCode } = useGame();
  const [players, setPlayers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const playersSubscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${roomId}`,
      }, payload => {
        setPlayers(current => [...current, payload.new]);
        if (players.length >= 1) {
          navigate(`/game/${roomId}`);
        }
      })
      .subscribe();

    // Get initial players
    supabase
      .from('players')
      .select()
      .eq('room_id', roomId)
      .then(({ data }) => {
        if (data) setPlayers(data);
      });

    return () => {
      playersSubscription.unsubscribe();
    };
  }, [roomId, navigate, players.length]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative z-10">
        <div className="text-center">
          <Users className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Waiting for Player 2
          </h1>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Room Code:</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-mono font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
              {roomCode}
            </p>
            <button
              onClick={copyCode}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-indigo-600 mb-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="font-medium">Waiting for others to join...</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Connected Players:</h2>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl py-3 px-4"
              >
                <p className="font-medium text-indigo-900">{player.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
