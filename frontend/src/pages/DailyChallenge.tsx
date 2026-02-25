import React from 'react';
import { Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DailyChallenge() {
  // Mock daily challenge data
  const challenge = {
    challengeId: 42,
    difficulty: 'Intermediate',
    completions: 234,
    fastestTime: 52,
    fastestPlayer: 'ST1FAST...PLAYER',
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <Calendar size={40} className="text-primary-400" />
          <span className="font-army">Daily Challenge</span>
        </h1>

        <div className="max-w-3xl mx-auto">
          {/* Challenge Info */}
          <div className="bg-gradient-to-r from-primary-900 to-purple-900 rounded-xl p-8 mb-6">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold font-army mb-4">Today's Challenge</h2>
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <div className="text-sm text-gray-300 font-army">Difficulty</div>
                  <div className="text-2xl font-bold font-army">{challenge.difficulty}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 font-army">Completions</div>
                  <div className="text-2xl font-bold font-army">{challenge.completions}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-300 font-army">Best Time</div>
                  <div className="text-2xl font-bold font-army">{challenge.fastestTime}s</div>
                </div>
              </div>
              <Button size="lg" className="bg-primary-400 text-white hover:bg-primary-500 font-army">
                <span className="font-army">Play Today's Challenge</span>
              </Button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white font-army mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              <span className="font-army">Today's Leaderboard</span>
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg font-army">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-army">#{rank}</span>
                    <span className="text-gray-300 font-army">ST{rank}PLAYER...ADDR</span>
                  </div>
                  <div className="text-primary-400 font-bold font-army">{50 + rank * 5}s</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gray-800 rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-white font-army mb-4">Rewards</h3>
            <ul className="space-y-2 text-gray-300 font-army">
              <li>🥇 1st Place: 100 tokens</li>
              <li>🥈 2nd Place: 50 tokens</li>
              <li>🥉 3rd Place: 25 tokens</li>
              <li>🏅 4th-10th: 10 tokens</li>
              <li>✅ All Completions: 10 tokens base reward</li>
              <li>🔥 7-Day Streak: +50 tokens bonus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
