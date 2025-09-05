# Shmoo Clicker 🎯

> Click your way to verifiable digital points

A Base Mini App for Ethereum mainnet that allows users to generate non-transferable Shmoo points by clicking a button, with clear disclaimers about their value.

## ⚠️ Important Disclaimer

**WARNING: Shmoo points are non-transferable and have no value.**

This application is experimental and for entertainment purposes only. Shmoo points cannot be traded, sold, or exchanged for any monetary value.

## 🚀 Features

### Core Features
- **🎯 Shmoo Point Generation**: Connect your Ethereum wallet and click to generate unique, on-chain, non-transferable Shmoo points
- **📊 Engagement Tracking**: View your click history, streaks, and daily activity with visual progress tracking
- **🔗 On-Chain Verifiability**: Each Shmoo point is recorded on Ethereum mainnet with unique identifiers
- **⚠️ Clear Value Disclaimer**: Prominent warning about the non-transferable nature and lack of value

### Technical Features
- **Wallet Integration**: Connect via MetaMask, Coinbase Wallet, and other WalletConnect-compatible wallets
- **Real-time Stats**: Track total clicks, current streak, daily activity, and last click time
- **Transaction History**: View recent Shmoo point generations with Etherscan links
- **Global Statistics**: See total points generated across all users
- **Responsive Design**: Optimized for mobile and desktop experiences

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Blockchain**: Ethereum Mainnet via Alchemy
- **Wallet**: RainbowKit + Wagmi + Viem
- **Smart Contract**: Solidity ^0.8.19

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Ethereum wallet (MetaMask recommended)
- Alchemy API key for Ethereum mainnet access

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd shmoo-clicker
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Required: Alchemy API key for Ethereum mainnet
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here

# Required: Smart contract address (after deployment)
VITE_SHMOO_CONTRACT_ADDRESS=0x...

# Optional: Network configuration
VITE_NETWORK=mainnet
```

### 3. Smart Contract Deployment

The app requires a deployed ShmooPoints smart contract. You can:

**Option A: Use Remix IDE**
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the contract from `contracts/ShmooPoints.sol`
3. Compile and deploy to Ethereum mainnet
4. Copy the deployed contract address to your `.env` file

**Option B: Use Hardhat (Advanced)**
```bash
npm install --save-dev hardhat
npx hardhat init
# Configure hardhat.config.js with your network settings
npx hardhat run scripts/deploy.js --network mainnet
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 5. Production Build

```bash
npm run build
npm run preview
```

## 🏗 Architecture

### Smart Contract (`ShmooPoints.sol`)

The core smart contract provides:
- `generateShmooPoint()`: Creates a new non-transferable point
- `getUserPoints(address)`: Gets total points for a user
- `verifyPoint(uint256)`: Verifies if a point exists
- `getContractInfo()`: Returns global statistics

### Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── DisclaimerBanner.tsx
│   ├── ShmooButton.tsx
│   ├── StatsDisplay.tsx
│   └── TransactionHistory.tsx
├── contracts/           # Contract ABIs and types
│   └── ShmooPointsABI.ts
├── services/           # Blockchain interaction layer
│   └── blockchain.ts
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css        # Global styles and design tokens
```

### Key Services

**Blockchain Service** (`src/services/blockchain.ts`):
- Handles all smart contract interactions
- Manages transaction signing and confirmation
- Provides event listening capabilities
- Includes fallback to mock transactions for development

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(240 100% 50%)` - Blue for primary actions
- **Accent**: `hsl(180 70% 50%)` - Cyan for highlights
- **Background**: `hsl(220 20% 98%)` - Light gray background
- **Surface**: `hsl(255 100% 100%)` - White for cards

### Components
- **Button**: Primary and outline variants
- **Card**: Default variant with subtle shadows
- **Alert**: Warning and info variants
- **Text**: Heading, body, and caption variants
- **ProgressTracker**: Simple variant for streaks

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ALCHEMY_API_KEY` | Alchemy API key for Ethereum access | Yes |
| `VITE_SHMOO_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | No (default provided) |
| `VITE_NETWORK` | Network name (mainnet) | No (default: mainnet) |

### Wallet Configuration

The app is configured to work with:
- Ethereum Mainnet (primary)
- Polygon, Optimism, Arbitrum, Base (additional chains)

## 📊 User Flow

1. **Connect Wallet**: User connects their Ethereum wallet via RainbowKit
2. **View Stats**: App displays user's current statistics and global stats
3. **Generate Point**: User clicks the Shmoo button to create a transaction
4. **Sign Transaction**: Wallet prompts user to sign the transaction
5. **Confirmation**: App waits for transaction confirmation
6. **Update UI**: Stats and history are updated with the new point
7. **Verification**: Point can be verified on-chain and viewed on Etherscan

## 🧪 Testing

### Development Mode
When no contract address is configured, the app falls back to mock transactions for testing the UI and user experience.

### Production Testing
1. Deploy contract to a testnet first
2. Test all functionality with testnet ETH
3. Verify contract interactions on testnet explorer
4. Deploy to mainnet only after thorough testing

## 🚀 Deployment

### Frontend Deployment
The app can be deployed to any static hosting service:

```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

Recommended platforms:
- Vercel
- Netlify
- GitHub Pages
- IPFS (for decentralized hosting)

### Smart Contract Deployment
See the deployment script in `scripts/deploy.js` for automated deployment.

## 🔒 Security Considerations

- **Non-transferable**: Points cannot be transferred between addresses
- **No monetary value**: Explicitly stated and enforced
- **Rate limiting**: Consider implementing rate limiting for production
- **Gas optimization**: Contract is optimized for minimal gas usage
- **Input validation**: All inputs are validated on-chain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. Shmoo points have no monetary value and cannot be transferred or traded. Use at your own risk.

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues
2. Review the documentation
3. Test with mock transactions first
4. Verify your environment configuration

---

**Remember: Shmoo points are non-transferable and have no value! 🎯**
