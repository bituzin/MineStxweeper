import React, { useState } from 'react';
import { getGamePlayer, getUserAddress } from '@/lib/stacks';

export function GameOwnerChecker() {
  const [gameId, setGameId] = useState('');
  const [owner, setOwner] = useState<string | null>(null);
  const [myAddress, setMyAddress] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const checkOwner = async () => {
    if (!gameId) return;
    const player = await getGamePlayer(Number(gameId));
    const myAddr = getUserAddress();
    setOwner(player);
    setMyAddress(myAddr);
    setResult(player === myAddr ? 'TAK (jesteś właścicielem gry)' : 'NIE (to nie jest Twoja gra)');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mt-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Sprawdź właściciela gry</h2>
      <input
        type="number"
        className="p-2 rounded bg-gray-900 text-white border border-gray-700 mb-4 w-full"
        placeholder="Podaj gameId"
        value={gameId}
        onChange={e => setGameId(e.target.value)}
      />
      <button
        className="bg-primary-400 hover:bg-primary-500 text-white font-bold py-2 px-6 rounded transition mb-4 w-full"
        onClick={checkOwner}
      >
        Sprawdź
      </button>
      {owner && (
        <div className="text-white mt-2">
          <div><b>Właściciel gry:</b> <span className="font-mono">{owner}</span></div>
          <div><b>Twój adres:</b> <span className="font-mono">{myAddress}</span></div>
          <div className="mt-2 font-bold text-lg">Czy możesz claimować punkty? <span className="text-yellow-400">{result}</span></div>
        </div>
      )}
    </div>
  );
}
