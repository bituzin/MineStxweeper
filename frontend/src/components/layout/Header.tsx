import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { connectWallet, disconnectWallet, isAuthenticated, getUserAddress } from '@/lib/stacks';
import { Bomb, Trophy, Sword, Calendar, Award, User } from 'lucide-react';

export function Header() {
  const authenticated = isAuthenticated();
  const address = getUserAddress();

  return (
    <header className="bg-gray-900 text-white shadow-lg h-screen">
      <div className="container mx-auto px-4 py-4 h-full">
        <div className="flex h-full">
          {/* Sidebar navigation */}
          <nav className="flex flex-col items-start gap-6 w-56 py-8 pr-8 border-r border-gray-800">
            <Link to="/game" className="flex items-center gap-2 hover:text-primary-400 transition">
              <Bomb size={20} />
              <span>Play</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-2 hover:text-primary-400 transition">
              <Trophy size={20} />
              <span>Leaderboard</span>
            </Link>
            <Link to="/tournaments" className="flex items-center gap-2 hover:text-primary-400 transition">
              <Sword size={20} />
              <span>Tournaments</span>
            </Link>
            <Link to="/daily" className="flex items-center gap-2 hover:text-primary-400 transition">
              <Calendar size={20} />
              <span>Daily</span>
            </Link>
            <Link to="/achievements" className="flex items-center gap-2 hover:text-primary-400 transition">
              <Award size={20} />
              <span>Achievements</span>
            </Link>
            {authenticated && (
              <Link to="/profile" className="flex items-center gap-2 hover:text-primary-400 transition">
                <User size={20} />
                <span>Profile</span>
              </Link>
            )}
          </nav>

          {/* Main content and top bar */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                <Bomb size={32} className="text-primary-500" />
                <span>Minesweeper</span>
              </Link>
              <div>
                {authenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
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
            {/* Here will be the rest of the app content (children) */}
          </div>
        </div>
      </div>
    </header>
  );
}
