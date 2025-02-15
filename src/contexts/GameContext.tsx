import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <GameContext.Provider value={{ playerName, setPlayerName, roomCode, setRoomCode }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}