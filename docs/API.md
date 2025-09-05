# Shmoo Clicker API Documentation

This document outlines the API integrations and blockchain interactions used in the Shmoo Clicker application.

## 🔗 External API Integrations

### Alchemy API

**Purpose**: Ethereum mainnet interaction for reading blockchain state and sending transactions.

**Configuration**:
```env
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

**Endpoints Used**:
- `https://eth-mainnet.g.alchemy.com/v2/{apiKey}` - Ethereum mainnet RPC

**Usage**:
- Reading smart contract state
- Sending transactions
- Monitoring transaction confirmations
- Event listening

**Rate Limits**: Varies by Alchemy plan (typically 300 requests/second for free tier)

**Error Handling**: Falls back to default Ethereum RPC if Alchemy fails

### WalletConnect

**Purpose**: Wallet connection and transaction signing.

**Configuration**:
```env
VITE_WALLETCONNECT_PROJECT_ID=9f4bd472c01ba49282b42e5e1874c2af
```

**Integration**: Via RainbowKit + Wagmi

**Supported Wallets**:
- MetaMask
- Coinbase Wallet
- WalletConnect compatible wallets
- Rainbow Wallet
- Trust Wallet

### Turnkey (Optional)

**Purpose**: Advanced wallet management and programmatic transactions.

**Configuration**:
```env
VITE_TURNKEY_API_BASE_URL=https://api.turnkey.com
VITE_TURNKEY_ORGANIZATION_ID=your_org_id
```

**Status**: Optional integration for future enhancements

## 📋 Smart Contract API

### ShmooPoints Contract

**Address**: Configured via `VITE_SHMOO_CONTRACT_ADDRESS`

**ABI**: Available in `src/contracts/ShmooPointsABI.ts`

#### Read Functions

##### `getUserPoints(address user) → uint256`
Get the total number of Shmoo points for a specific user.

**Parameters**:
- `user`: Ethereum address to query

**Returns**: Number of Shmoo points

**Example**:
```typescript
const points = await shmooPointsService.getUserPoints('0x...');
console.log(`User has ${points} Shmoo points`);
```

##### `getContractInfo() → (uint256 totalPoints, uint256 currentId)`
Get global contract statistics.

**Returns**:
- `totalPoints`: Total Shmoo points generated across all users
- `currentId`: Current point ID counter

**Example**:
```typescript
const { totalPoints, currentId } = await shmooPointsService.getContractInfo();
```

##### `verifyPoint(uint256 pointId) → bool`
Verify if a specific point ID exists.

**Parameters**:
- `pointId`: Point ID to verify

**Returns**: Boolean indicating if point exists

##### `pointExists(uint256 pointId) → bool`
Check if a point exists (mapping accessor).

##### `totalShmooPoints() → uint256`
Get total Shmoo points generated (state variable accessor).

##### `getCurrentPointId() → uint256`
Get the current point ID counter.

#### Write Functions

##### `generateShmooPoint()`
Generate a new Shmoo point for the caller.

**Gas Cost**: ~50,000 gas

**Events Emitted**:
```solidity
event ShmooPointGenerated(
    address indexed user,
    uint256 indexed pointId,
    uint256 timestamp,
    uint256 totalPoints
);
```

**Example**:
```typescript
const txHash = await shmooPointsService.generateShmooPoint(walletClient);
const receipt = await shmooPointsService.waitForTransaction(txHash);
```

## 🔧 Blockchain Service API

### ShmooPointsService Class

Located in `src/services/blockchain.ts`

#### Constructor
```typescript
new ShmooPointsService(contractAddress?: `0x${string}`)
```

#### Methods

##### `generateShmooPoint(walletClient: any): Promise<string>`
Generate a new Shmoo point on-chain.

**Parameters**:
- `walletClient`: Viem wallet client instance

**Returns**: Transaction hash

**Throws**: Error if contract not configured or transaction fails

##### `getUserPoints(userAddress: `0x${string}`): Promise<number>`
Get user's total Shmoo points.

**Parameters**:
- `userAddress`: User's Ethereum address

**Returns**: Number of points (0 if contract not configured)

##### `getContractInfo(): Promise<{totalPoints: number, currentId: number}>`
Get contract statistics.

**Returns**: Object with total points and current ID

##### `verifyPoint(pointId: number): Promise<boolean>`
Verify if a point exists.

**Parameters**:
- `pointId`: Point ID to verify

**Returns**: Boolean indicating existence

##### `watchShmooPointEvents(userAddress, onEvent): Promise<Function>`
Listen for ShmooPointGenerated events.

**Parameters**:
- `userAddress`: User address to filter events
- `onEvent`: Callback function for handling events

**Returns**: Unwatch function

##### `getTransactionReceipt(hash: `0x${string}`): Promise<TransactionReceipt>`
Get transaction receipt.

##### `waitForTransaction(hash: `0x${string}`): Promise<TransactionReceipt>`
Wait for transaction confirmation.

## 📊 Data Models

### UserStats Interface
```typescript
interface UserStats {
  totalClicks: number;      // Total Shmoo points generated
  streakCount: number;      // Current daily streak
  lastClickTimestamp: number; // Last click timestamp
  dailyClicks: number;      // Clicks today
}
```

### ShmooPoint Interface
```typescript
interface ShmooPoint {
  pointId: string;          // Unique point identifier
  userAddress: string;      // User's Ethereum address
  timestamp: number;        // Generation timestamp
  txHash?: string;          // Transaction hash (optional)
}
```

## 🔄 Event Handling

### ShmooPointGenerated Event
```solidity
event ShmooPointGenerated(
    address indexed user,
    uint256 indexed pointId,
    uint256 timestamp,
    uint256 totalPoints
);
```

**Listening**:
```typescript
const unwatch = await shmooPointsService.watchShmooPointEvents(
  userAddress,
  (event) => {
    console.log('New Shmoo point generated:', event);
  }
);
```

## 🚨 Error Handling

### Common Errors

#### Contract Not Configured
```typescript
Error: 'Contract address not configured'
```
**Solution**: Set `VITE_SHMOO_CONTRACT_ADDRESS` in environment

#### User Rejected Transaction
```typescript
Error: 'User rejected the request'
```
**Solution**: User needs to approve transaction in wallet

#### Insufficient Gas
```typescript
Error: 'Insufficient funds for gas'
```
**Solution**: User needs ETH for gas fees

#### Network Mismatch
```typescript
Error: 'Wrong network'
```
**Solution**: Switch wallet to Ethereum mainnet

### Fallback Behavior

When smart contract is not available:
- App falls back to mock transactions
- Local storage maintains user data
- UI remains functional for testing

## 🔒 Security Considerations

### Rate Limiting
- Consider implementing client-side rate limiting
- Smart contract has no built-in rate limiting
- Gas costs provide natural rate limiting

### Input Validation
- All contract inputs are validated on-chain
- Frontend validates addresses and parameters
- Type safety enforced via TypeScript

### Transaction Safety
- All transactions are signed by user's wallet
- No private keys stored in application
- Contract is non-upgradeable for security

## 📈 Performance Optimization

### Caching Strategy
- User stats cached in localStorage
- Contract info cached with periodic refresh
- Transaction history stored locally

### Gas Optimization
- Contract optimized for minimal gas usage
- Batch operations where possible
- Efficient storage patterns

### Network Efficiency
- Use Alchemy for reliable RPC access
- Implement retry logic for failed requests
- Cache frequently accessed data

## 🧪 Testing APIs

### Mock Mode
When `VITE_SHMOO_CONTRACT_ADDRESS` is not set:
- Generates mock transaction hashes
- Simulates blockchain delays
- Maintains full UI functionality

### Development Testing
```typescript
// Test contract deployment
const info = await shmooPointsService.getContractInfo();
console.log('Contract deployed:', info.totalPoints >= 0);

// Test user interaction
const points = await shmooPointsService.getUserPoints(userAddress);
console.log('User points:', points);
```

## 📚 External Resources

- [Alchemy Documentation](https://docs.alchemy.com/alchemy/)
- [WalletConnect Documentation](https://docs.walletconnect.com/2.0/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)

---

For implementation examples, see the source code in `src/services/blockchain.ts` and `src/App.tsx`.
