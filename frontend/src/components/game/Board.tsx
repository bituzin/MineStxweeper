import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CellComponent } from './Cell';

export function Board() {
  const { board } = useGameStore();

  return (
    <div className="inline-block bg-gray-700 p-4 rounded-lg shadow-2xl">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((_, x) => (
            <CellComponent key={`${x}-${y}`} x={x} y={y} />
          ))}
        </div>
      ))}
    </div>
  );
}
