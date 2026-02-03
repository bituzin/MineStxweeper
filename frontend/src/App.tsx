import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Leaderboard } from './pages/Leaderboard';
import { Tournaments } from './pages/Tournaments';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { DailyChallenge } from './pages/DailyChallenge';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/daily" element={<DailyChallenge />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
