# 💣 MineStxweeper - Decentralized Gaming Platform

A fully decentralized Minesweeper implementation on Stacks blockchain with tournaments, NFT achievements, competitive rankings, and play-to-earn mechanics.

## 🌐 Live Demo

**[🎮 MineStxweeper](https://mine-stxweeper.vercel.app/)**

## 🎮 Features

### Core Gameplay
- **Classic Minesweeper** - Three difficulty levels (Beginner, Intermediate, Expert)
- **VRF-based Board Generation** - Provably fair random mine placement
- **Optimized Gas Costs** - Off-chain flood fill with on-chain verification
- **Real-time Updates** - Smooth UI with blockchain state sync

### Competitive Features
- **Global Leaderboards** - Separate rankings per difficulty
- **Tournaments** - Bracket-style competitions with prize pools
- **1v1 Wagers** - Challenge friends, winner takes all
- **Daily Challenges** - Same board for everyone, daily rewards

### Rewards & Progression
- **Play-to-Earn** - Earn platform tokens for wins
- **NFT Achievements** - 15+ unlockable badges (SIP-009)
- **Streak Bonuses** - Multipliers for consecutive wins
- **Vesting Rewards** - Large prizes unlock over time

## 🏗️ Architecture

### Optimized Smart Contracts (10 total)

1. **game-core.clar** - Game factory, state management, move validation (merged)
2. **board-generator.clar** - VRF-based mine placement with commitment scheme
3. **win-checker.clar** - Win condition validation
4. **leaderboard.clar** - Global rankings per difficulty
5. **achievement-nft.clar** - SIP-009 achievement badges
6. **player-profile.clar** - Stats + streaks (merged)
7. **tournament.clar** - Tournament bracket management
8. **wager.clar** - 1v1 betting system
9. **daily-challenge.clar** - Daily puzzle coordination
10. **economy.clar** - Prize pools + reward distribution (merged)

### Gas Optimization Strategies
- ✅ Off-chain flood fill computation
- ✅ Batch cell updates (reveal up to 50 cells in one tx)
- ✅ Bitpacked storage (32 cells per uint)
- ✅ Only store revealed cells (not full board)
- ✅ Merkle proofs for board verification

### Frontend (React + TypeScript)
- **React 18** with hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Stacks.js** for blockchain interaction
- **React Router** for navigation
- **Zustand** for state management

## 🎯 Game Mechanics

### Board Sizes & Difficulty
- **Beginner**: 9×9 = 81 cells, 10 mines
- **Intermediate**: 16×16 = 256 cells, 40 mines
- **Expert**: 30×16 = 480 cells, 99 mines

### Scoring Formula
```
Base = 1000 points
Time Bonus = max(0, 500 - seconds)
Difficulty Multiplier = 1x / 2x / 4x
Efficiency = (safe_cells / moves) × 100
Flag Accuracy = (correct_flags / total_flags) × 50

Score = (Base + Time + Efficiency + Accuracy) × Difficulty × Streak
```

### Reward Structure
```
Game completion: 10-500 tokens (based on performance)
Daily challenge: 10-100 tokens + leaderboard bonuses
Tournament prizes: 50-95% of entry fee pool
Achievements: 50-1000 tokens per unlock
Streak bonuses: 1.2x - 5x multipliers
```

## 💰 Token Economics

### Supply & Distribution
- **Max Supply**: 100M tokens
- **Play-to-Earn Pool**: 40M (vested 3 years)
- **Treasury**: 30M
- **Team**: 20M (vested 2 years)
- **Airdrop**: 10M (early adopters)

### Deflationary Mechanism
- 1% platform fee on all transactions
- 50% of fees burned
- 50% to treasury for ongoing rewards

### Token Utility
- Tournament entry fees
- Streak savers (prevent streak reset)
- Cosmetic NFTs (future)
- Governance voting (future DAO)
- Staking for passive rewards (future)

## 🏆 Achievements (NFTs)

15 unique achievements across categories:
- **Milestones**: First Blood, Master badges (10 wins per difficulty)
- **Speed**: Speed Demon (<10s), Lightning Fast (<60s), Expert Speedrun (<180s)
- **Skill**: Perfect Game (no flags), Flag Master (100% accuracy)
- **Consistency**: Streak King (10 wins), Century Club (100 wins)
- **Elite**: World Record Holder, Tournament Victor, High Roller
- **Dedication**: Daily Grinder (30 day streak)

## 🔐 Security Features

- ✅ Commitment scheme for board generation (prevents cheating)
- ✅ First-click safety (never hit mine on first move)
- ✅ Escrow for all prize pools
- ✅ Move validation (prevent invalid reveals)
- ✅ Emergency pause functionality
- ✅ Multi-sig treasury (>1000 STX)
- ✅ Dispute resolution window (24h)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🔗 Links

- **Live Demo**: [MineStxweeper](https://mine-stxweeper.vercel.app/)
- **Twitter**: @MinesweeperSTX
- **Discord**: discord.gg/minesweeper-stx
- **Docs**: https://docs.minesweeper-stacks.app

## 💬 Community

Join our community:
- Report bugs via GitHub Issues
- Suggest features in Discord
- Share strategies on Twitter
- Compete in weekly tournaments

## ⚠️ Disclaimer

This is experimental software on a blockchain. Use at your own risk. Always verify contract addresses before interacting.

---

Built with ❤️ on Stacks blockchain

## 📜 Smart Contract Overview

The platform uses 10 optimized Clarity smart contracts:

1. **game-core-v01.clar** – Manages game creation, state, and move validation.
2. **board-generator-v01.clar** – Generates random mine boards using VRF and commitment schemes.
3. **win-checker-v01.clar** – Validates win conditions for games.
4. **leaderboard-v01.clar** – Tracks global player rankings for each difficulty level.
5. **achievement-nft-v01.clar** – Implements SIP-009 NFT achievement badges for player accomplishments.
6. **player-profile-v01.clar** – Stores player statistics and win streaks.
7. **tournament-v01.clar** – Handles tournament brackets and progression.
8. **wager-v01.clar** – Enables 1v1 betting and wager settlements between players.
9. **daily-challenge-v01.clar** – Coordinates daily puzzles and rewards for all players.
10. **economy-v01.clar** – Manages prize pools, reward distribution, and play-to-earn mechanics.

Each contract is modular, focusing on a specific aspect of the game or platform economy. Contracts interact to provide a seamless decentralized gaming experience, including fair board generation, achievement tracking, competitive play, and rewards.
