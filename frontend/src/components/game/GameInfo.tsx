import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameStatus } from '@/types';
import { Timer, Flag } from 'lucide-react';

export function GameInfo() {
  const { status, timeElapsed, movesCount, flagsPlaced, updateTimer } = useGameStore();

  useEffect(() => {
    if (status === GameStatus.IN_PROGRESS) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [status, updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-8 text-lg font-semibold">
      <div className="flex items-center gap-2">
        <Timer size={24} />
        <span>{formatTime(timeElapsed)}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Flag size={24} />
        <span>{flagsPlaced}</span>
      </div>
      
      <div>
        <span>Moves: {movesCount}</span>
      </div>
    </div>
  );
}
