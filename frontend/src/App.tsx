import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { connectWallet, disconnectWallet, isAuthenticated, getUserAddress } from '@/lib/stacks';
import { Bomb, Trophy, Sword, Calendar, Award, User } from 'lucide-react';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Leaderboard } from './pages/Leaderboard';
import { Tournaments } from './pages/Tournaments';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { DailyChallenge } from './pages/DailyChallenge';
import Gm from './pages/Gm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-r from-stacks-gradient1 to-stacks-gradient2 flex">
        {/* Sidebar navigation */}
        <nav className="flex flex-col items-start gap-6 w-56 py-8 pr-8 border-r border-stacks-dark h-screen pl-6 bg-stacks-dark font-army">
          <Link to="/game" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Bomb size={20} />
            <span className="font-army">Play</span>
          </Link>
          <Link to="/gm" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Calendar size={20} />
            <span className="font-army">Gm</span>
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Trophy size={20} />
            <span className="font-army">Leaderboard</span>
          </Link>
          <Link to="/tournaments" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Sword size={20} />
            <span className="font-army">Tournaments</span>
          </Link>
          <Link to="/daily" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Calendar size={20} />
            <span className="font-army">Daily</span>
          </Link>
          <Link to="/achievements" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
            <Award size={20} />
            <span className="font-army">Achievements</span>
          </Link>
          {isAuthenticated() && (
            <Link to="/profile" className="flex items-center gap-2 hover:text-stacks-purple transition text-white">
              <User size={20} />
              <span className="font-army">Profile</span>
            </Link>
          )}
        </nav>
        {/* Main content and top bar */}
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="flex items-center justify-between px-8 py-4 border-b border-stacks-dark bg-stacks-light">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-stacks-purple">
              <Bomb size={32} className="text-stacks-purple" />
              <span>MineStxweeper</span>
            </Link>
            <div>
              {isAuthenticated() ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {getUserAddress()?.slice(0, 6)}...{getUserAddress()?.slice(-4)}
                  </span>
                  <Button variant="secondary" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button onClick={() => connectWallet()}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/gm" element={<Gm />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/daily" element={<DailyChallenge />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
