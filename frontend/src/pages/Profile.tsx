import React from 'react';
import { User, Trophy, Flame, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Profile() {
  // Mock player data
  const stats = {
    totalGames: 156,
    totalWins: 89,
    totalLosses: 67,
    winRate: 57,
    currentStreak: 5,
    bestStreak: 12,
    achievements: 8,
    totalTokens: 4567,
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 rounded-xl p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
                <p className="text-gray-400 font-mono">ST1PQHQKV0...TPGZGM</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.totalTokens}</div>
                <div className="text-gray-400">Tokens</div>
                <Button size="sm" className="mt-2">Claim Rewards</Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Trophy />} label="Total Wins" value={stats.totalWins} />
            <StatCard icon={<Flame />} label="Win Streak" value={stats.currentStreak} />
            <StatCard icon={<Award />} label="Achievements" value={stats.achievements} />
            <StatCard icon={<Star />} label="Win Rate" value={`${stats.winRate}%`} />
          </div>

          {/* Detailed Stats */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Beginner</h3>
                <div className="space-y-2 text-gray-400">
                  <div>Wins: <span className="text-white">45</span></div>
                  <div>Losses: <span className="text-white">22</span></div>
                  <div>Best Time: <span className="text-primary-400">18s</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Intermediate</h3>
                <div className="space-y-2 text-gray-400">
                  <div>Wins: <span className="text-white">32</span></div>
                  <div>Losses: <span className="text-white">28</span></div>
                  <div>Best Time: <span className="text-primary-400">87s</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Expert</h3>
                <div className="space-y-2 text-gray-400">
                  <div>Wins: <span className="text-white">12</span></div>
                  <div>Losses: <span className="text-white">17</span></div>
                  <div>Best Time: <span className="text-primary-400">234s</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <div className="text-primary-400 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}
