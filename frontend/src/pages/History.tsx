import React, { useEffect, useState } from 'react';
import { getUserAddress, getPlayerGames, getLastGmGreeter } from '@/lib/stacks';

export default function History() {
  const [games, setGames] = useState<{ gameId: number; status: string; createdAt: string }[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastGmGreeter, setLastGmGreeter] = useState<string | null>(null);

  useEffect(() => {
    async function loadGames() {
      const addr = getUserAddress();
      setAddress(addr || '');
      if (addr) {
        setLoading(true);
        const gameIds = await getPlayerGames(addr);
        // Convert game IDs to game objects
        const gameObjects = gameIds.map(gameId => ({
          gameId,
          status: 'W trakcie', // You can fetch detailed info later
          createdAt: new Date().toLocaleDateString() // Placeholder
        }));
        setGames(gameObjects);
        
        // Fetch last GM greeter
        const gmGreeter = await getLastGmGreeter();
        setLastGmGreeter(gmGreeter);
        
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Twoja historia</h1>
        
        {/* GM Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-primary-400 mb-4">📣 Community GM</h2>
          {loading ? (
            <div className="text-gray-400">Ładowanie...</div>
          ) : lastGmGreeter ? (
            <div className="text-gray-300">
              <p className="mb-2">OstatniGreMLer:</p>
              <p className="font-mono text-yellow-300 break-all">{lastGmGreeter}</p>
            </div>
          ) : (
            <div className="text-gray-400">Brak historii GM</div>
          )}
        </div>
        
        {/* Games Section */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary-400 mb-4">🎮 Twoje gry</h2>
          <div className="mb-4 text-gray-400">Twój adres: <span className="font-mono text-white">{address || 'Niezalogowany'}</span></div>
          {loading ? (
            <div className="text-gray-400">Ładowanie...</div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-primary-400">
                    <th className="py-2">Game ID</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((g) => (
                    <tr key={g.gameId} className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                      <td className="py-2 font-mono text-yellow-300">{g.gameId}</td>
                      <td className="py-2 text-white">{g.status}</td>
                      <td className="py-2 text-gray-300">{g.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {games.length === 0 && <div className="text-gray-400 mt-4">Brak gier do wyświetlenia. Zagraj swoją pierwszą grę!</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
