import { create } from 'zustand';
import {
  GameState,
  GameStatus,
  Difficulty,
  BOARD_CONFIGS,
  Cell,
  CellState,
} from '@/types';
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag as toggleFlagLogic,
  computeFloodFill,
  revealCellsBatch,
  checkWinCondition,
  countFlags,
  countRevealedCells,
} from '@/lib/game-logic';
import { createGame, generateBoard } from '@/lib/stacks';

interface GameStore extends GameState {
  // Actions
  startNewGame: (difficulty: Difficulty) => void;
  handleCellClick: (x: number, y: number) => void;
  handleCellRightClick: (x: number, y: number) => void;
  updateTimer: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  difficulty: Difficulty.BEGINNER,
  status: GameStatus.NOT_STARTED,
  board: createEmptyBoard(9, 9),
  movesCount: 0,
  flagsPlaced: 0,
  cellsRevealed: 0,
  timeElapsed: 0,

  // Start new game
  startNewGame: async (difficulty) => {
    const config = BOARD_CONFIGS[difficulty];
    const board = createEmptyBoard(config.width, config.height);

    set({
      difficulty,
      status: GameStatus.NOT_STARTED,
      board,
      movesCount: 0,
      flagsPlaced: 0,
      cellsRevealed: 0,
      timeElapsed: 0,
      startedAt: undefined,
      finishedAt: undefined,
      gameId: undefined,
    });

    try {
      // Wywołanie kontraktu na blockchainie
      const txid = await createGame(difficulty);
      // Ustaw gameId na txid (placeholder, docelowo pobierz z blockchaina)
      set({ gameId: txid, status: GameStatus.IN_PROGRESS, startedAt: Date.now() });
      // Wywołanie generowania planszy przez kontrakt board-generator-05
      await generateBoard(txid, config.width, config.height);
      // Pobierz planszę z blockchaina (placeholder)
      // const boardOnChain = await fetchBoard(txid);
      // set({ board: boardOnChain });
      console.log('Game created on chain, ready to play!');
    } catch (error) {
      // Obsługa błędów
      console.error('Failed to create game on chain:', error);
    }
  },

  // Handle left click
  handleCellClick: (x, y) => {
    const state = get();
    
    if (state.status === GameStatus.WON || state.status === GameStatus.LOST) {
      return; // Game over
    }

    const cell = state.board[y][x];

    // Can't click flagged or already revealed cells
    if (cell.state === CellState.FLAGGED || cell.state === CellState.OPEN) {
      return;
    }

    let newBoard = [...state.board];
    let newStatus = state.status;
    let startedAt = state.startedAt;

    // First move - place mines if board doesn't have any yet
    const hasMines = newBoard.some(row => row.some(cell => cell.isMine));
    if (!hasMines) {
      const config = BOARD_CONFIGS[state.difficulty];
      newBoard = placeMines(newBoard, config.mines, x, y);
      if (state.status === GameStatus.NOT_STARTED) {
        newStatus = GameStatus.IN_PROGRESS;
        startedAt = Date.now();
      }
    }

    // Check if mine
    if (newBoard[y][x].isMine) {
      // Game over - lost
      newBoard = revealCell(newBoard, x, y);
      
      set({
        board: newBoard,
        status: GameStatus.LOST,
        finishedAt: Date.now(),
        movesCount: state.movesCount + 1,
      });
      return;
    }

    // Reveal cell
    const adjacentMines = newBoard[y][x].adjacentMines;

    if (adjacentMines === 0) {
      // Flood fill
      const config = BOARD_CONFIGS[state.difficulty];
      const floodResult = computeFloodFill(newBoard, x, y, config.width);
      newBoard = revealCellsBatch(newBoard, floodResult.cellsToReveal);
    } else {
      // Just reveal this cell
      newBoard = revealCell(newBoard, x, y);
    }

    // Check win condition
    const config = BOARD_CONFIGS[state.difficulty];
    const won = checkWinCondition(newBoard, config.mines);

    if (won) {
      newStatus = GameStatus.WON;
    }

    set({
      board: newBoard,
      status: newStatus,
      startedAt,
      finishedAt: won ? Date.now() : undefined,
      movesCount: state.movesCount + 1,
      cellsRevealed: countRevealedCells(newBoard),
    });
  },

  // Handle right click (flag)
  handleCellRightClick: (x, y) => {
    const state = get();

    if (state.status === GameStatus.WON || state.status === GameStatus.LOST) {
      return;
    }

    const newBoard = toggleFlagLogic(state.board, x, y);

    set({
      board: newBoard,
      flagsPlaced: countFlags(newBoard),
    });
  },

  // Update timer
  updateTimer: () => {
    const state = get();
    
    if (state.status === GameStatus.IN_PROGRESS && state.startedAt) {
      set({
        timeElapsed: Math.floor((Date.now() - state.startedAt) / 1000),
      });
    }
  },

  // Reset game
  resetGame: () => {
    const state = get();
    const config = BOARD_CONFIGS[state.difficulty];
    
    set({
      status: GameStatus.NOT_STARTED,
      board: createEmptyBoard(config.width, config.height),
      movesCount: 0,
      flagsPlaced: 0,
      cellsRevealed: 0,
      timeElapsed: 0,
      startedAt: undefined,
      finishedAt: undefined,
    });
  },
}));
