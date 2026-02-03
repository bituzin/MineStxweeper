import React from 'react';
import { ACHIEVEMENTS } from '@/types';
import { Award, Lock } from 'lucide-react';

export function Achievements() {
  // Mock data - achievements status
  const achievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: Math.random() > 0.7 // Random for demo
  }));

  const getRarityColor = (rarity: string) => {
    const colors = {
      Common: 'border-gray-500 bg-gray-800',
      Uncommon: 'border-green-500 bg-green-900',
      Rare: 'border-blue-500 bg-blue-900',
      Epic: 'border-purple-500 bg-purple-900',
      Legendary: 'border-yellow-500 bg-yellow-900',
    };
    return colors[rarity as keyof typeof colors] || colors.Common;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <Award size={40} className="text-yellow-400" />
          Achievements
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border-2 rounded-xl p-6 transition ${getRarityColor(achievement.rarity)} ${
                achievement.unlocked ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{achievement.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    achievement.rarity === 'Legendary' ? 'bg-yellow-600' :
                    achievement.rarity === 'Epic' ? 'bg-purple-600' :
                    achievement.rarity === 'Rare' ? 'bg-blue-600' :
                    'bg-gray-600'
                  }`}>
                    {achievement.rarity}
                  </span>
                </div>
                {achievement.unlocked ? (
                  <Award size={32} className="text-yellow-400" />
                ) : (
                  <Lock size={32} className="text-gray-500" />
                )}
              </div>
              <p className="text-gray-300 text-sm">{achievement.description}</p>
              {achievement.unlocked && achievement.earnedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
