import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Bomb, Trophy, Zap, Users, Gift } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center text-white">
          <div className="flex justify-center mb-6">
            <Bomb size={80} className="text-primary-400" />
          </div>
          
          <h1 className="text-6xl font-extrabold mb-4 font-army">
            Minesweeper on <span className="text-primary-400">Stacks</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-army">
            Decentralized Minesweeper with tournaments, NFT achievements, 
            competitive rankings, and play-to-earn mechanics
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/game">
              <Button size="lg" className="text-lg px-8 font-army">
                <span className="font-army">Play Now</span>
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 font-army">
                <span className="font-army">View Leaderboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      // ...existing code...

      {/* Stats */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gray-800 rounded-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <StatCard number="1,234" label="Total Players" />
            <StatCard number="45,678" label="Games Played" />
            <StatCard number="12.5K" label="STX in Prizes" />
            <StatCard number="89" label="Tournaments" />
          </div>
        </div>
      </div>
        // ...existing code...
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
      <div className="text-primary-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary-400 mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}
