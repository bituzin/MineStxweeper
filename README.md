# 💣 MineStxweeper - Decentralized Gaming Platform

A fully decentralized Minesweeper implementation on Stacks blockchain with tournaments, NFT achievements, competitive rankings, and play-to-earn mechanics.

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

## 📁 Project Structure

```
minesweeper-stacks/
├── contracts/                 # Clarity smart contracts
│   ├── game-core.clar
│   ├── board-generator.clar
│   ├── win-checker.clar
│   ├── leaderboard.clar
│   ├── achievement-nft.clar
│   ├── player-profile.clar
│   ├── tournament.clar
│   ├── wager.clar
│   ├── daily-challenge.clar
│   └── economy.clar
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── game/        # Game board, cells, timer
│   │   │   ├── ui/          # Buttons, modals, cards
│   │   │   └── layout/      # Header, footer, sidebar
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Game.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── Tournaments.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── DailyChallenge.tsx
│   │   │   ├── Wager.tsx
│   │   │   └── Achievements.tsx
│   │   ├── lib/             # Utilities
│   │   │   ├── stacks.ts    # Blockchain integration
│   │   │   ├── game-logic.ts # Off-chain game logic
│   │   │   └── flood-fill.ts # Cascade computation
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── tests/                    # Contract tests
├── deployments/             # Deployment scripts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Clarinet (for contract development)
- Stacks wallet (Hiro, Xverse)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd minesweeper-stacks

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev

# In another terminal - test contracts
cd ../
clarinet test
```

### Deploy Contracts

```bash
# Configure deployment
clarinet deployments generate --testnet

# Deploy to testnet
clarinet deployments apply -p deployments/testnet.yaml

# Deploy to mainnet
clarinet deployments apply -p deployments/mainnet.yaml
```

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

## 📊 Gas Cost Estimates (Stacks Mainnet)

```
New game creation: ~0.02 STX
Single cell reveal: ~0.01 STX
Batch reveal (30 cells): ~0.15 STX
Place flag: ~0.005 STX
Complete game: ~0.5-1.5 STX total
Tournament entry: ~0.02 STX
Claim rewards: ~0.03 STX
```

## 🛣️ Roadmap

### Phase 1 (Q1 2026) - MVP ✅
- Core contracts deployment
- Basic frontend
- Testnet launch

### Phase 2 (Q2 2026)
- Tournament system
- Achievement NFTs
- Mainnet launch

### Phase 3 (Q3 2026)
- Daily challenges
- Wager system
- Mobile app

### Phase 4 (Q4 2026)
- Layer 2 integration (10x cheaper gas)
- Cosmetic NFTs marketplace
- Staking & governance

### Phase 5 (2027+)
- Multi-game platform (other puzzle games)
- Cross-chain bridge
- Esports tournaments

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🔗 Links

- **Website**: https://minesweeper-stacks.app
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
