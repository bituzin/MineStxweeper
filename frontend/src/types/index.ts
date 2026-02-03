// ============================================================================
// GAME TYPES
// ============================================================================

export enum Difficulty {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  EXPERT = 3,
}

export interface BoardDimensions {
  width: number;
  height: number;
  mines: number;
}

export const BOARD_CONFIGS: Record<Difficulty, BoardDimensions> = {
  [Difficulty.BEGINNER]: { width: 9, height: 9, mines: 10 },
  [Difficulty.INTERMEDIATE]: { width: 16, height: 16, mines: 40 },
  [Difficulty.EXPERT]: { width: 30, height: 16, mines: 99 },
};

export enum CellState {
  CLOSED = 'closed',
  OPEN = 'open',
  FLAGGED = 'flagged',
}

export enum GameStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  WON = 'won',
  LOST = 'lost',
}

export interface Cell {
  x: number;
  y: number;
  state: CellState;
  isMine: boolean;
  adjacentMines: number;
  revealedAt?: number;
}

export interface GameState {
  gameId?: number;
  difficulty: Difficulty;
  status: GameStatus;
  board: Cell[][];
  startedAt?: number;
  finishedAt?: number;
  movesCount: number;
  flagsPlaced: number;
  cellsRevealed: number;
  timeElapsed: number;
}

// ============================================================================
// PLAYER TYPES
// ============================================================================

export interface PlayerStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  
  beginnerWins: number;
  beginnerLosses: number;
  beginnerBestTime: number;
  
  intermediateWins: number;
  intermediateLosses: number;
  intermediateBestTime: number;
  
  expertWins: number;
  expertLosses: number;
  expertBestTime: number;
  
  totalMoves: number;
  totalFlagsPlaced: number;
  totalFlagsCorrect: number;
  
  firstGameAt: number;
  lastGameAt: number;
  totalPlaytime: number;
}

export interface PlayerStreaks {
  currentWinStreak: number;
  bestWinStreak: number;
  winStreakStartedAt: number;
  
  currentLoginStreak: number;
  bestLoginStreak: number;
  lastLoginDate: number;
  
  currentPerfectStreak: number;
  bestPerfectStreak: number;
  
  streakSaversAvailable: number;
  lastStreakSaverEarned: number;
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  time: number;
  gameId: number;
  achievedAt: number;
}

export interface WorldRecord {
  player: string;
  time: number;
  score: number;
  gameId: number;
  setAt: number;
}

// ============================================================================
// TOURNAMENT TYPES
// ============================================================================

export enum TournamentStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  FINISHED = 'finished',
}

export interface Tournament {
  tournamentId: number;
  name: string;
  organizer: string;
  difficulty: Difficulty;
  entryFee: number;
  maxPlayers: number;
  currentPlayers: number;
  status: TournamentStatus;
  prizePool: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  winner?: string;
}

export interface TournamentParticipant {
  player: string;
  entryPaid: boolean;
  eliminated: boolean;
  finalRank: number;
  totalScore: number;
  gamesPlayed: number[];
}

// ============================================================================
// WAGER TYPES
// ============================================================================

export enum WagerStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export interface Wager {
  wagerId: number;
  challenger: string;
  opponent: string;
  difficulty: Difficulty;
  stake: number;
  status: WagerStatus;
  
  challengerGameId?: number;
  opponentGameId?: number;
  
  challengerTime?: number;
  opponentTime?: number;
  challengerScore?: number;
  opponentScore?: number;
  
  winner?: string;
  createdAt: number;
  expiresAt: number;
  finishedAt?: number;
}

// ============================================================================
// DAILY CHALLENGE TYPES
// ============================================================================

export interface DailyChallenge {
  challengeId: number;
  date: number;
  difficulty: Difficulty;
  boardSeed: string;
  totalCompletions: number;
  fastestTime?: number;
  fastestPlayer?: string;
  highestScore?: number;
  highestScorePlayer?: string;
}

export interface DailyCompletion {
  gameId: number;
  time: number;
  score: number;
  rank: number;
  completedAt: number;
  rewardClaimed: boolean;
}

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export interface Achievement {
  id: number;
  name: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  category: string;
  imageUri: string;
  unlocked: boolean;
  earnedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 1, name: 'First Blood', description: 'Win your first game', rarity: 'Common', category: 'Milestone', imageUri: '', unlocked: false },
  { id: 2, name: 'Beginner Master', description: '10 beginner wins', rarity: 'Uncommon', category: 'Milestone', imageUri: '', unlocked: false },
  { id: 3, name: 'Intermediate Master', description: '10 intermediate wins', rarity: 'Rare', category: 'Milestone', imageUri: '', unlocked: false },
  { id: 4, name: 'Expert Master', description: '10 expert wins', rarity: 'Epic', category: 'Milestone', imageUri: '', unlocked: false },
  { id: 5, name: 'Speed Demon', description: 'Beginner < 10 seconds', rarity: 'Rare', category: 'Speed', imageUri: '', unlocked: false },
  { id: 6, name: 'Lightning Fast', description: 'Intermediate < 60 seconds', rarity: 'Epic', category: 'Speed', imageUri: '', unlocked: false },
  { id: 7, name: 'Expert Speedrun', description: 'Expert < 180 seconds', rarity: 'Legendary', category: 'Speed', imageUri: '', unlocked: false },
  { id: 8, name: 'Perfect Game', description: 'Win without flags', rarity: 'Rare', category: 'Skill', imageUri: '', unlocked: false },
  { id: 9, name: 'Flag Master', description: '100% flag accuracy', rarity: 'Epic', category: 'Skill', imageUri: '', unlocked: false },
  { id: 10, name: 'Streak King', description: '10 win streak', rarity: 'Rare', category: 'Consistency', imageUri: '', unlocked: false },
  { id: 11, name: 'Century Club', description: '100 total wins', rarity: 'Epic', category: 'Milestone', imageUri: '', unlocked: false },
  { id: 12, name: 'World Record', description: 'Set a world record', rarity: 'Legendary', category: 'Elite', imageUri: '', unlocked: false },
  { id: 13, name: 'Tournament Victor', description: 'Win a tournament', rarity: 'Legendary', category: 'Elite', imageUri: '', unlocked: false },
  { id: 14, name: 'High Roller', description: 'Win wager >100 STX', rarity: 'Epic', category: 'Elite', imageUri: '', unlocked: false },
  { id: 15, name: 'Daily Grinder', description: '30 day streak', rarity: 'Epic', category: 'Dedication', imageUri: '', unlocked: false },
];

// ============================================================================
// REWARD TYPES
// ============================================================================

export interface PendingRewards {
  platformTokens: number;
  stxAmount: number;
  lastUpdated: number;
}
