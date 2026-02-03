import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CellState } from '@/types';
import { clsx } from 'clsx';
import { Flag, Bomb } from 'lucide-react';

interface CellComponentProps {
  x: number;
  y: number;
}

export function CellComponent({ x, y }: CellComponentProps) {
  const { board, handleCellClick, handleCellRightClick } = useGameStore();
  const cell = board[y][x];

  const handleClick = () => {
    handleCellClick(x, y);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleCellRightClick(x, y);
  };

  const getCellColor = () => {
    if (cell.state === CellState.CLOSED) return 'bg-gray-400 hover:bg-gray-500';
    if (cell.state === CellState.FLAGGED) return 'bg-yellow-400';
    if (cell.isMine) return 'bg-red-600';
    return 'bg-gray-200';
  };

  const getNumberColor = () => {
    const colors = [
      '',
      'text-blue-600',
      'text-green-600',
      'text-red-600',
      'text-purple-600',
      'text-yellow-600',
      'text-pink-600',
      'text-black',
      'text-gray-600',
    ];
    return colors[cell.adjacentMines] || '';
  };

  return (
    <button
      className={clsx(
        'w-8 h-8 border border-gray-600 font-bold text-sm flex items-center justify-center transition-all',
        getCellColor(),
        cell.state === CellState.OPEN && 'animate-cell-reveal'
      )}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      disabled={cell.state === CellState.OPEN}
    >
      {cell.state === CellState.FLAGGED && <Flag size={16} />}
      {cell.state === CellState.OPEN && cell.isMine && <Bomb size={18} className="text-white" />}
      {cell.state === CellState.OPEN && !cell.isMine && cell.adjacentMines > 0 && (
        <span className={getNumberColor()}>{cell.adjacentMines}</span>
      )}
    </button>
  );
}
