import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import {
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  bufferCV,
  deserializeCV,
  cvToValue,
  ClarityValue,
} from '@stacks/transactions';

// ============================================================================
// CONFIGURATION
// ============================================================================

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const NETWORK = new StacksMainnet(); // Changed to StacksMainnet for production

export const CONTRACT_ADDRESS = 'SP2Z3M34KEKC79TMRMZB24YG30FE25JPN83TPZSZ2'; // Updated to deployed game-core-05 address
export const CONTRACT_NAME_GAME_CORE = 'game-core-05';
export const CONTRACT_NAME_BOARD_GEN = 'board-generator-05';
export const CONTRACT_NAME_WIN_CHECKER = 'win-checker-05';
export const CONTRACT_NAME_LEADERBOARD = 'leaderboard-05';
export const CONTRACT_NAME_PLAYER_PROFILE = 'player-profile-05';
export const CONTRACT_NAME_ACHIEVEMENT = 'achievement-nft-05';
export const CONTRACT_NAME_TOURNAMENT = 'tournament-05';
export const CONTRACT_NAME_WAGER = 'wager-05';
export const CONTRACT_NAME_DAILY = 'daily-challenge-05';
export const CONTRACT_NAME_ECONOMY = 'economy-05';
export const CONTRACT_NAME_GM = 'gm-05';

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
  // BOARD GENERATOR CONTRACT CALLS
  // ============================================================================

  export async function generateBoard(gameId: number, width: number, height: number) {
    if (!userSession.isUserSignedIn()) throw new Error('Not authenticated');

    return new Promise((resolve, reject) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME_BOARD_GEN,
        functionName: 'generate-board',
        functionArgs: [uintCV(gameId), uintCV(width), uintCV(height)],
        network: NETWORK,
        appDetails: {
          name: 'Minesweeper on Stacks',
          icon: window.location.origin + '/logo.png',
        },
        onFinish: (data: any) => {
          console.log('Board generated:', data);
          resolve(data.txId);
        },
        onCancel: () => {
          console.log('Board generation canceled');
          reject('Board generation canceled');
        },
      });
    });
  }

// ============================================================================
// GAME CORE CONTRACT CALLS
// ============================================================================

export async function createGame(difficulty: number) {
  if (!userSession.isUserSignedIn()) throw new Error('Not authenticated');

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME_GAME_CORE,
      functionName: 'create-game',
      functionArgs: [uintCV(difficulty)],
      network: NETWORK,
      appDetails: {
        name: 'Minesweeper on Stacks',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data: any) => {
        console.log('Transaction submitted:', data);
        resolve(data.txId);
      },
      onCancel: () => {
        console.log('Transaction canceled');
        reject('Transaction canceled');
      },
    });
  });
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

export async function getPendingRewards(playerAddress: string) {
  try {
    const response = await fetch(
      `https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/${CONTRACT_ADDRESS}/economy-05/get-pending-rewards`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: playerAddress,
          arguments: [
            { type: 'principal', value: playerAddress }
          ]
        })
      }
    );
    const data = await response.json();
    
    console.log('getPendingRewards API response:', data);
    
    if (!data.okay || !data.result) {
      // No pending rewards
      return { platform_tokens: 0, stx_amount: 0 };
    }
    
    // Decode Clarity value
    const clarityValue = deserializeCV(data.result);
    const value = cvToValue(clarityValue);
    
    console.log('getPendingRewards decoded value:', value);
    
    // Response is (ok (some {...})) or (ok none)
    // cvToValue might return null for none, or the tuple for some
    if (!value) {
      return { platform_tokens: 0, stx_amount: 0 };
    }
    
    // Handle response wrapper
    let actualValue = value;
    if (typeof value === 'object' && 'value' in value) {
      actualValue = value.value;
    }
    
    // value should be a tuple with platform-tokens and stx-amount
    if (actualValue && typeof actualValue === 'object') {
      return {
        platform_tokens: actualValue['platform-tokens'] || 0,
        stx_amount: actualValue['stx-amount'] || 0
      };
    }
    
    return { platform_tokens: 0, stx_amount: 0 };
  } catch (error) {
    console.error('Error fetching pending rewards:', error);
    return { platform_tokens: 0, stx_amount: 0 };
  }
}

export async function getPlayerGames(playerAddress: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/${CONTRACT_ADDRESS}/game-core-05/get-player-active-games`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: playerAddress,
          arguments: [
            { type: 'principal', value: playerAddress }
          ]
        })
      }
    );
    const data = await response.json();
    
    console.log('getPlayerGames API response:', data);
    
    if (!data.okay || !data.result) {
      console.log('getPlayerGames: API returned not okay or no result');
      return [];
    }
    
    // Decode Clarity value
    const clarityValue = deserializeCV(data.result);
    const value = cvToValue(clarityValue);
    
    console.log('getPlayerGames decoded value:', value);
    
    // Response is (ok list), so value is wrapped in ok response
    // cvToValue should handle this, but let's check the structure
    if (value && typeof value === 'object' && 'value' in value) {
      // It's a response type (ok/err), get the inner value
      const innerValue = value.value;
      if (Array.isArray(innerValue)) {
        return innerValue.map((v: any) => Number(v));
      }
    }
    
    // Direct array (if cvToValue already unwrapped the ok)
    if (Array.isArray(value)) {
      return value.map((v: any) => Number(v));
    }
    
    console.log('getPlayerGames: unexpected value format', value);
    return [];
  } catch (error) {
    console.error('Error fetching player games:', error);
    return [];
  }
}

export async function getLastGmGreeter(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/${CONTRACT_ADDRESS}/gm-05/get-last-greeter`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: CONTRACT_ADDRESS,
          arguments: []
        })
      }
    );
    const data = await response.json();
    
    console.log('getLastGmGreeter API response:', data);
    
    if (!data.okay || !data.result) {
      return null;
    }
    
    // Decode Clarity value
    const clarityValue = deserializeCV(data.result);
    const value = cvToValue(clarityValue);
    
    console.log('getLastGmGreeter decoded value:', value);
    
    // Response is (ok principal), unwrap if needed
    if (value && typeof value === 'object' && 'value' in value) {
      return value.value as string;
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching last GM greeter:', error);
    return null;
  }
}

export async function getGamePlayer(gameId: number) {
  // Read-only call to game-core-05.get-game-info
  return fetch(
    `https://stacks-node-api.mainnet.stacks.co/v2/contracts/call-read/${CONTRACT_ADDRESS}/game-core-05/get-game-info`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: CONTRACT_ADDRESS,
        arguments: [
          { type: 'uint', value: gameId }
        ]
      })
    }
  )
    .then(res => res.json())
    .then(data => data.result ? data.result.player : null);
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

export async function checkWinCondition(gameId: number) {
  if (!userSession.isUserSignedIn()) throw new Error('Not authenticated');

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME_WIN_CHECKER,
      functionName: 'check-win-condition',
      functionArgs: [uintCV(gameId)],
      network: NETWORK,
      appDetails: {
        name: 'Minesweeper on Stacks',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data: any) => {
        console.log('Win condition checked:', data);
        resolve(data.txId);
      },
      onCancel: () => {
        console.log('Win check canceled');
        reject('Win check canceled');
      },
    });
  });
}

export async function claimRewards() {
  if (!userSession.isUserSignedIn()) throw new Error('Not authenticated');

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME_ECONOMY,
      functionName: 'claim-rewards',
      functionArgs: [],
      network: NETWORK,
      appDetails: {
        name: 'Minesweeper on Stacks',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data: any) => {
        console.log('Rewards claimed:', data);
        resolve(data.txId);
      },
      onCancel: () => {
        console.log('Claim canceled');
        reject('Claim canceled');
      },
    });
  });
}

// ============================================================================
// GM CONTRACT
// ============================================================================

export async function sendGm() {
  if (!userSession.isUserSignedIn()) throw new Error('Not authenticated');

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME_GM,
      functionName: 'gm-save',
      functionArgs: [],
      network: NETWORK,
      appDetails: {
        name: 'Minesweeper on Stacks',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data: any) => {
        console.log('GM sent:', data);
        resolve(data.txId);
      },
      onCancel: () => {
        console.log('GM canceled');
        reject('GM canceled');
      },
    });
  });
}
