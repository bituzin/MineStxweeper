import React, { useEffect, useState } from 'react';
import { getUserAddress } from '@/lib/stacks';

// Placeholder for fetching games - in real app, replace with API or contract call
async function fetchUserGames(address: string) {
  // Wywołanie read-only do kontraktu game-core-04
  const response = await fetch(
    `https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/SP2Z3M34KEKC79TMRMZB24YG30FE25JPN83TPZSZ2/game-core-04/get-player-active-games`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: address,
        arguments: [
          { type: 'principal', value: address }
        ]
      })
    }
  );
  const data = await response.json();
  // Oczekiwany format: { result: { games: [...] } }
  if (data.result && data.result.games) {
    // Zamień listę uint na obiekty gry (można rozbudować o status, datę itd.)
    return data.result.games.map((gameId: number) => ({ gameId, status: 'nieznany', createdAt: '-' }));
  }
  return [];
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
