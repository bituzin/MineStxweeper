import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sword, Plus } from 'lucide-react';

export function Tournaments() {
  // Mock tournaments data
  const tournaments = [
    { id: 1, name: 'Weekend Cup', difficulty: 'Expert', entryFee: 10, currentPlayers: 12, maxPlayers: 16, prizePool: 120, status: 'open' },
    { id: 2, name: 'Beginner Bracket', difficulty: 'Beginner', entryFee: 5, currentPlayers: 8, maxPlayers: 8, prizePool: 40, status: 'in-progress' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Sword size={40} className="text-primary-400" />
            Tournaments
          </h1>
          <Button>
            <Plus size={20} className="mr-2" />
            Create Tournament
          </Button>
        </div>

        <div className="grid gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gray-800 p-6 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tournament.name}</h3>
                  <div className="flex gap-4 text-gray-400">
                    <span>Difficulty: <span className="text-white">{tournament.difficulty}</span></span>
                    <span>Entry: <span className="text-primary-400">{tournament.entryFee} STX</span></span>
                    <span>Players: <span className="text-white">{tournament.currentPlayers}/{tournament.maxPlayers}</span></span>
                    <span>Prize Pool: <span className="text-green-400">{tournament.prizePool} STX</span></span>
                  </div>
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${
                    tournament.status === 'open' ? 'bg-green-600' :
                    tournament.status === 'in-progress' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`}>
                    {tournament.status.toUpperCase()}
                  </span>
                  {tournament.status === 'open' && (
                    <Button className="mt-3" size="sm">Join Tournament</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
