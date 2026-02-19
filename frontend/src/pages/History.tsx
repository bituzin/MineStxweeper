import React, { useEffect, useState } from 'react';
import { getUserAddress } from '@/lib/stacks';

// Placeholder for fetching games - in real app, replace with API or contract call
async function fetchUserGames(address: string) {
  // TODO: Replace with real contract call (get-player-active-games)
  // For now, return mock data
  return [
    { gameId: 101, status: 'won', createdAt: '2026-02-18' },
    { gameId: 102, status: 'in-progress', createdAt: '2026-02-19' },
    { gameId: 103, status: 'lost', createdAt: '2026-02-17' },
  ];
}

export default function History() {
  const [games, setGames] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const addr = getUserAddress();
    setAddress(addr || '');
    if (addr) {
      fetchUserGames(addr).then(setGames);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Twoja historia gier</h1>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="mb-4 text-gray-400">Twój adres: <span className="font-mono text-white">{address}</span></div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-primary-400">
                <th className="py-2">Game ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g: any) => (
                <tr key={g.gameId} className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                  <td className="py-2 font-mono text-yellow-300">{g.gameId}</td>
                  <td className="py-2 text-white">{g.status}</td>
                  <td className="py-2 text-gray-300">{g.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {games.length === 0 && <div className="text-gray-400 mt-4">Brak gier do wyświetlenia.</div>}
        </div>
      </div>
    </div>
  );
}
