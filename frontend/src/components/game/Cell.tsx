import React from 'react';
import { useGameStore } from '@/store/gameStore';

interface CellProps {
  x: number;
  y: number;
}

export function CellComponent({ x, y }: CellProps) {
  const { board, makeMove } = useGameStore();
  const cellValue = board[y][x];

  const handleClick = () => {
    makeMove(x, y);
  };

  return (
    <div
      onClick={handleClick}
      className="
        w-12 h-12 border border-gray-500 flex items-center justify-center
        hover:bg-gray-500/50 cursor-pointer transition-colors duration-200
        select-none
      "
    >
      {cellValue}
    </div>
  );
}
