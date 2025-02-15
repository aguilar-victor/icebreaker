import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WaitingRoom from './pages/WaitingRoom';
import GameRoom from './pages/GameRoom';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waiting/:roomId" element={<WaitingRoom />} />
            <Route path="/game/:roomId" element={<GameRoom />} />
          </Routes>
        </div>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
