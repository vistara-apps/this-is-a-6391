import { createPublicClient, createWalletClient, custom, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import { SHMOO_POINTS_ABI } from '../contracts/ShmooPointsABI';

// Environment variables
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = import.meta.env.VITE_SHMOO_CONTRACT_ADDRESS as `0x${string}`;

// Create public client for reading from the blockchain
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: ALCHEMY_API_KEY 
    ? http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`)
    : http() // Fallback to default RPC
});

// Create wallet client for writing to the blockchain
export const createWalletClientFromWindow = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum)
    });
  }
  return null;
};

// Contract interaction functions
export class ShmooPointsService {
  private contractAddress: `0x${string}`;

  constructor(contractAddress?: `0x${string}`) {
    this.contractAddress = contractAddress || CONTRACT_ADDRESS;
  }

  /**
   * Generate a new Shmoo point on-chain
   */
  async generateShmooPoint(walletClient: any): Promise<string> {
    if (!this.contractAddress) {
      throw new Error('Contract address not configured');
    }

    try {
      const [account] = await walletClient.getAddresses();
      
      const hash = await walletClient.writeContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'generateShmooPoint',
        account,
      });

      return hash;
    } catch (error) {
      console.error('Error generating Shmoo point:', error);
      throw error;
    }
  }

  /**
   * Get user's total Shmoo points
   */
  async getUserPoints(userAddress: `0x${string}`): Promise<number> {
    if (!this.contractAddress) {
      return 0;
    }

    try {
      const result = await publicClient.readContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'getUserPoints',
        args: [userAddress],
      });

      return Number(result);
    } catch (error) {
      console.error('Error fetching user points:', error);
      return 0;
    }
  }

  /**
   * Get contract information
   */
  async getContractInfo(): Promise<{ totalPoints: number; currentId: number }> {
    if (!this.contractAddress) {
      return { totalPoints: 0, currentId: 0 };
    }

    try {
      const result = await publicClient.readContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'getContractInfo',
      });

      return {
        totalPoints: Number(result[0]),
        currentId: Number(result[1])
      };
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return { totalPoints: 0, currentId: 0 };
    }
  }

  /**
   * Verify if a point exists
   */
  async verifyPoint(pointId: number): Promise<boolean> {
    if (!this.contractAddress) {
      return false;
    }

    try {
      const result = await publicClient.readContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'verifyPoint',
        args: [BigInt(pointId)],
      });

      return Boolean(result);
    } catch (error) {
      console.error('Error verifying point:', error);
      return false;
    }
  }

  /**
   * Listen for ShmooPointGenerated events
   */
  async watchShmooPointEvents(
    userAddress: `0x${string}`,
    onEvent: (event: any) => void
  ) {
    if (!this.contractAddress) {
      return;
    }

    try {
      const unwatch = publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        eventName: 'ShmooPointGenerated',
        args: {
          user: userAddress,
        },
        onLogs: (logs) => {
          logs.forEach((log) => {
            onEvent(log);
          });
        },
      });

      return unwatch;
    } catch (error) {
      console.error('Error watching events:', error);
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(hash: `0x${string}`) {
    try {
      return await publicClient.getTransactionReceipt({ hash });
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
      return null;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: `0x${string}`) {
    try {
      return await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const shmooPointsService = new ShmooPointsService();
