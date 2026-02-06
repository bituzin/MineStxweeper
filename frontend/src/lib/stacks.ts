import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  bufferCV,
} from '@stacks/transactions';

// ============================================================================
// CONFIGURATION
// ============================================================================

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const NETWORK = new StacksMainnet(); // Changed to StacksMainnet for production

export const CONTRACT_ADDRESS = 'SP2Z3M34KEKC79TMRMZB24YG30FE25JPN83TPZSZ2'; // Updated to deployed game-core-02 address
export const CONTRACT_NAME_GAME_CORE = 'game-core-02';
export const CONTRACT_NAME_BOARD_GEN = 'board-generator';
export const CONTRACT_NAME_WIN_CHECKER = 'win-checker';
export const CONTRACT_NAME_LEADERBOARD = 'leaderboard';
export const CONTRACT_NAME_PLAYER_PROFILE = 'player-profile';
export const CONTRACT_NAME_ACHIEVEMENT = 'achievement-nft';
export const CONTRACT_NAME_TOURNAMENT = 'tournament';
export const CONTRACT_NAME_WAGER = 'wager';
export const CONTRACT_NAME_DAILY = 'daily-challenge';
export const CONTRACT_NAME_ECONOMY = 'economy';

// ============================================================================
// AUTHENTICATION
// ============================================================================

export function connectWallet(onFinish?: () => void) {
  showConnect({
    appDetails: {
      name: 'Minesweeper on Stacks',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
      onFinish?.();
    },
    userSession,
  });
}

export function disconnectWallet() {
  userSession.signUserOut();
  window.location.reload();
}

export function getUserAddress(): string | null {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData().profile.stxAddress.mainnet; // switched to mainnet
  }
  return null;
}

export function isAuthenticated(): boolean {
  return userSession.isUserSignedIn();
}

// ============================================================================
// GAME CORE CONTRACT CALLS
// ============================================================================

export async function createGame(difficulty: number) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_GAME_CORE,
    functionName: 'create-game',
    functionArgs: [uintCV(difficulty)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
  
  return broadcastResponse.txid;
}

export async function revealCell(gameId: number, x: number, y: number) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_GAME_CORE,
    functionName: 'reveal-cell',
    functionArgs: [uintCV(gameId), uintCV(x), uintCV(y)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

export async function revealCellsBatch(
  gameId: number,
  cellIndices: number[],
  adjacentMinesList: number[]
) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_GAME_CORE,
    functionName: 'reveal-cells-batch',
    functionArgs: [
      uintCV(gameId),
      // Convert to Clarity list
      { type: 'list', value: cellIndices.map((i) => uintCV(i)) },
      { type: 'list', value: adjacentMinesList.map((m) => uintCV(m)) },
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

export async function toggleFlag(gameId: number, x: number, y: number) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_GAME_CORE,
    functionName: 'toggle-flag',
    functionArgs: [uintCV(gameId), uintCV(x), uintCV(y)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

// ============================================================================
// READ-ONLY CALLS
// ============================================================================

export async function getGameInfo(gameId: number) {
  // Implement read-only call using Stacks.js
  // For now, return mock data
  return {
    gameId,
    player: getUserAddress(),
    difficulty: 1,
    status: 'in-progress',
    boardSizeX: 9,
    boardSizeY: 9,
    mineCount: 10,
  };
}

export async function getPlayerStats(playerAddress: string) {
  // Implement read-only call
  return {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
  };
}

export async function getLeaderboard(difficulty: number, limit: number) {
  // Implement read-only call
  return [];
}

// ============================================================================
// TOURNAMENT CONTRACT CALLS
// ============================================================================

export async function createTournament(
  name: string,
  difficulty: number,
  entryFee: number,
  maxPlayers: number
) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_TOURNAMENT,
    functionName: 'create-tournament',
    functionArgs: [
      { type: 'string-ascii', data: name },
      uintCV(difficulty),
      uintCV(entryFee),
      uintCV(maxPlayers),
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

export async function joinTournament(tournamentId: number) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_TOURNAMENT,
    functionName: 'join-tournament',
    functionArgs: [uintCV(tournamentId)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

// ============================================================================
// WAGER CONTRACT CALLS
// ============================================================================

export async function createWager(
  opponent: string,
  difficulty: number,
  stake: number
) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_WAGER,
    functionName: 'create-wager',
    functionArgs: [principalCV(opponent), uintCV(difficulty), uintCV(stake)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

// ============================================================================
// DAILY CHALLENGE
// ============================================================================

export async function completeDailyChallenge(
  challengeId: number,
  gameId: number
) {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_DAILY,
    functionName: 'complete-daily-challenge',
    functionArgs: [uintCV(challengeId), uintCV(gameId)],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}

// ============================================================================
// ECONOMY
// ============================================================================

export async function claimRewards() {
  const address = getUserAddress();
  if (!address) throw new Error('Not authenticated');

  const txOptions = {
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME_ECONOMY,
    functionName: 'claim-rewards',
    functionArgs: [],
    senderKey: userSession.loadUserData().appPrivateKey,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, NETWORK);
}
