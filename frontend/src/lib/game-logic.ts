import { Cell, CellState, BoardDimensions } from '@/types';

// ============================================================================
// BOARD INITIALIZATION
// ============================================================================

export function createEmptyBoard(width: number, height: number): Cell[][] {
  const board: Cell[][] = [];
  
  for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
      board[y][x] = {
        x,
        y,
        state: CellState.CLOSED,
        isMine: false,
        adjacentMines: 0,
      };
    }
  }
  
  return board;
}

// ============================================================================
// MINE PLACEMENT (Client-side preview - actual placement on blockchain)
// ============================================================================

export function placeMines(
  board: Cell[][],
  mineCount: number,
  firstClickX: number,
  firstClickY: number
): Cell[][] {
  const width = board[0].length;
  const height = board.length;
  const mines: Set<string> = new Set();
  
  // Generate random mine positions (avoiding first click)
  while (mines.size < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const key = `${x},${y}`;
    
    // Skip first click position and its neighbors
    if (isNearFirstClick(x, y, firstClickX, firstClickY)) {
      continue;
    }
    
    mines.add(key);
  }
  
  // Place mines on board
  mines.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    board[y][x].isMine = true;
  });
  
  // Calculate adjacent mines for all cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!board[y][x].isMine) {
        board[y][x].adjacentMines = countAdjacentMines(board, x, y);
      }
    }
  }
  
  return board;
}

function isNearFirstClick(
  x: number,
  y: number,
  firstX: number,
  firstY: number
): boolean {
  return Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;
}

// ============================================================================
// ADJACENT MINE COUNTING
// ============================================================================

export function countAdjacentMines(
  board: Cell[][],
  x: number,
  y: number
): number {
  const height = board.length;
  const width = board[0].length;
  let count = 0;
  
  // Check all 8 neighbors
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (board[ny][nx].isMine) {
          count++;
        }
      }
    }
  }
  
  return count;
}

// ============================================================================
// FLOOD FILL (OFF-CHAIN COMPUTATION)
// ============================================================================

export interface FloodFillResult {
  cellsToReveal: Array<{ x: number; y: number; adjacentMines: number }>;
  cellIndices: number[];
}

export function computeFloodFill(
  board: Cell[][],
  startX: number,
  startY: number,
  width: number
): FloodFillResult {
  const height = board.length;
  const visited: Set<string> = new Set();
  const cellsToReveal: Array<{ x: number; y: number; adjacentMines: number }> = [];
  const cellIndices: number[] = [];
  
  function dfs(x: number, y: number) {
    const key = `${x},${y}`;
    
    // Boundary checks
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    if (visited.has(key)) return;
    if (board[y][x].state !== CellState.CLOSED) return;
    if (board[y][x].isMine) return;
    
    visited.add(key);
    
    const adjacentMines = board[y][x].adjacentMines;
    cellsToReveal.push({ x, y, adjacentMines });
    cellIndices.push(y * width + x);
    
    // If no adjacent mines, continue flood fill
    if (adjacentMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          dfs(x + dx, y + dy);
        }
      }
    }
  }
  
  dfs(startX, startY);
  
  return { cellsToReveal, cellIndices };
}

// ============================================================================
// CELL REVEAL
// ============================================================================

export function revealCell(
  board: Cell[][],
  x: number,
  y: number
): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  
  if (newBoard[y][x].state !== CellState.CLOSED) {
    return board; // Already revealed or flagged
  }
  
  newBoard[y][x].state = CellState.OPEN;
  newBoard[y][x].revealedAt = Date.now();
  
  return newBoard;
}

export function revealCellsBatch(
  board: Cell[][],
  cells: Array<{ x: number; y: number; adjacentMines: number }>
): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  
  cells.forEach(({ x, y, adjacentMines }) => {
    if (newBoard[y][x].state === CellState.CLOSED) {
      newBoard[y][x].state = CellState.OPEN;
      newBoard[y][x].adjacentMines = adjacentMines;
      newBoard[y][x].revealedAt = Date.now();
    }
  });
  
  return newBoard;
}

// ============================================================================
// FLAG TOGGLE
// ============================================================================

export function toggleFlag(board: Cell[][], x: number, y: number): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const cell = newBoard[y][x];
  
  if (cell.state === CellState.OPEN) {
    return board; // Can't flag revealed cell
  }
  
  cell.state =
    cell.state === CellState.FLAGGED ? CellState.CLOSED : CellState.FLAGGED;
  
  return newBoard;
}

// ============================================================================
// WIN CONDITION CHECK
// ============================================================================

export function checkWinCondition(
  board: Cell[][],
  totalMines: number
): boolean {
  const height = board.length;
  const width = board[0].length;
  const totalCells = width * height;
  const safeCells = totalCells - totalMines;
  
  let revealedSafeCells = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = board[y][x];
      if (!cell.isMine && cell.state === CellState.OPEN) {
        revealedSafeCells++;
      }
    }
  }
  
  return revealedSafeCells === safeCells;
}

// ============================================================================
// GAME STATISTICS
// ============================================================================

export function countFlags(board: Cell[][]): number {
  let count = 0;
  
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.FLAGGED) {
        count++;
      }
    }
  }
  
  return count;
}

export function countRevealedCells(board: Cell[][]): number {
  let count = 0;
  
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.OPEN) {
        count++;
      }
    }
  }
  
  return count;
}

export function countCorrectFlags(board: Cell[][]): number {
  let count = 0;
  
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.FLAGGED && cell.isMine) {
        count++;
      }
    }
  }
  
  return count;
}

// ============================================================================
// CHORD (REVEAL NEIGHBORS IF FLAGS MATCH)
// ============================================================================

export function canChord(board: Cell[][], x: number, y: number): boolean {
  const cell = board[y][x];
  
  if (cell.state !== CellState.OPEN) return false;
  if (cell.adjacentMines === 0) return false;
  
  const flaggedNeighbors = countFlaggedNeighbors(board, x, y);
  return flaggedNeighbors === cell.adjacentMines;
}

function countFlaggedNeighbors(board: Cell[][], x: number, y: number): number {
  const height = board.length;
  const width = board[0].length;
  let count = 0;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (board[ny][nx].state === CellState.FLAGGED) {
          count++;
        }
      }
    }
  }
  
  return count;
}

export function chordReveal(board: Cell[][], x: number, y: number): Cell[][] {
  if (!canChord(board, x, y)) return board;
  
  const height = board.length;
  const width = board[0].length;
  let newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (newBoard[ny][nx].state === CellState.CLOSED) {
          newBoard = revealCell(newBoard, nx, ny);
          
          // If hit mine, game over
          if (newBoard[ny][nx].isMine) {
            return newBoard;
          }
          
          // If no adjacent mines, flood fill
          if (newBoard[ny][nx].adjacentMines === 0) {
            const floodResult = computeFloodFill(newBoard, nx, ny, width);
            newBoard = revealCellsBatch(newBoard, floodResult.cellsToReveal);
          }
        }
      }
    }
  }
  
  return newBoard;
}
