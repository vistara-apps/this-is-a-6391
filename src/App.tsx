import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AlertTriangle, Zap, TrendingUp, Calendar } from 'lucide-react';
import DisclaimerBanner from './components/DisclaimerBanner';
import ShmooButton from './components/ShmooButton';
import StatsDisplay from './components/StatsDisplay';
import TransactionHistory from './components/TransactionHistory';
import { shmooPointsService, createWalletClientFromWindow } from './services/blockchain';

interface UserStats {
  totalClicks: number;
  streakCount: number;
  lastClickTimestamp: number;
  dailyClicks: number;
}

interface ShmooPoint {
  pointId: string;
  userAddress: string;
  timestamp: number;
  txHash?: string;
}

function App() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalClicks: 0,
    streakCount: 0,
    lastClickTimestamp: 0,
    dailyClicks: 0
  });
  
  const [shmooPoints, setShmooPoints] = useState<ShmooPoint[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [contractInfo, setContractInfo] = useState<{ totalPoints: number; currentId: number }>({ totalPoints: 0, currentId: 0 });

  // Load user data from localStorage and fetch contract info
  useEffect(() => {
    if (address) {
      const savedStats = localStorage.getItem(`shmoo_stats_${address}`);
      const savedPoints = localStorage.getItem(`shmoo_points_${address}`);
      
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        setUserStats(stats);
      }
      
      if (savedPoints) {
        const points = JSON.parse(savedPoints);
        setShmooPoints(points);
      }

      // Fetch contract info and sync on-chain data
      fetchContractInfo();
      syncOnChainData();
    }
  }, [address]);

  // Fetch contract information
  const fetchContractInfo = async () => {
    try {
      const info = await shmooPointsService.getContractInfo();
      setContractInfo(info);
    } catch (error) {
      console.error('Error fetching contract info:', error);
    }
  };

  // Sync on-chain data with local storage
  const syncOnChainData = async () => {
    if (!address) return;

    try {
      const onChainPoints = await shmooPointsService.getUserPoints(address as `0x${string}`);
      
      // Update local stats if on-chain data is different
      if (onChainPoints !== userStats.totalClicks) {
        setUserStats(prev => ({
          ...prev,
          totalClicks: onChainPoints
        }));
      }
    } catch (error) {
      console.error('Error syncing on-chain data:', error);
    }
  };

  // Save user data to localStorage
  const saveUserData = (stats: UserStats, points: ShmooPoint[]) => {
    if (address) {
      localStorage.setItem(`shmoo_stats_${address}`, JSON.stringify(stats));
      localStorage.setItem(`shmoo_points_${address}`, JSON.stringify(points));
    }
  };

  // Calculate streak
  const calculateStreak = (lastClick: number): number => {
    if (lastClick === 0) return 0;
    
    const now = Date.now();
    const daysSinceLastClick = Math.floor((now - lastClick) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastClick <= 1) {
      return userStats.streakCount;
    } else {
      return 0; // Reset streak if more than 1 day
    }
  };

  // Calculate daily clicks
  const calculateDailyClicks = (timestamp: number): number => {
    const now = Date.now();
    const dayStart = new Date(now).setHours(0, 0, 0, 0);
    
    if (timestamp >= dayStart) {
      return userStats.dailyClicks + 1;
    } else {
      return 1; // Reset daily count
    }
  };

  // Generate Shmoo Point
  const generateShmooPoint = async () => {
    if (!address || !walletClient || isGenerating) return;

    setIsGenerating(true);
    setError('');
    
    try {
      // Check if contract is configured
      const contractAddress = import.meta.env.VITE_SHMOO_CONTRACT_ADDRESS;
      
      if (!contractAddress) {
        // Fallback to mock transaction if contract not deployed
        await generateMockShmooPoint();
        return;
      }

      // Create wallet client for transaction
      const viemWalletClient = createWalletClientFromWindow();
      if (!viemWalletClient) {
        throw new Error('Unable to create wallet client');
      }

      // Generate Shmoo point on-chain
      const txHash = await shmooPointsService.generateShmooPoint(viemWalletClient);
      setLastTxHash(txHash);

      // Wait for transaction confirmation
      const receipt = await shmooPointsService.waitForTransaction(txHash as `0x${string}`);
      
      if (receipt.status === 'success') {
        const timestamp = Date.now();
        
        // Create new Shmoo point
        const newPoint: ShmooPoint = {
          pointId: `${txHash}_${receipt.logs.length > 0 ? receipt.logs[0].logIndex : 0}`,
          userAddress: address,
          timestamp,
          txHash
        };

        // Update stats
        const newDailyClicks = calculateDailyClicks(userStats.lastClickTimestamp);
        const currentStreak = calculateStreak(userStats.lastClickTimestamp);
        const newStreak = userStats.lastClickTimestamp > 0 && 
          Math.floor((timestamp - userStats.lastClickTimestamp) / (1000 * 60 * 60 * 24)) <= 1 
          ? currentStreak + 1 
          : 1;

        const newStats: UserStats = {
          totalClicks: userStats.totalClicks + 1,
          streakCount: newStreak,
          lastClickTimestamp: timestamp,
          dailyClicks: newDailyClicks
        };

        const newPoints = [newPoint, ...shmooPoints];

        // Update state
        setUserStats(newStats);
        setShmooPoints(newPoints);

        // Save to localStorage
        saveUserData(newStats, newPoints);

        // Refresh contract info
        await fetchContractInfo();
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Error generating Shmoo point:', error);
      setError(error.message || 'Failed to generate Shmoo point');
      
      // Fallback to mock transaction on error
      if (error.message?.includes('Contract address not configured') || 
          error.message?.includes('User rejected')) {
        // Don't fallback on user rejection
        if (!error.message?.includes('User rejected')) {
          await generateMockShmooPoint();
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback mock transaction for development/testing
  const generateMockShmooPoint = async () => {
    const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
    const timestamp = Date.now();
    
    // Create new Shmoo point
    const newPoint: ShmooPoint = {
      pointId: `${mockTxHash}_0`,
      userAddress: address!,
      timestamp,
      txHash: mockTxHash
    };

    // Update stats
    const newDailyClicks = calculateDailyClicks(userStats.lastClickTimestamp);
    const currentStreak = calculateStreak(userStats.lastClickTimestamp);
    const newStreak = userStats.lastClickTimestamp > 0 && 
      Math.floor((timestamp - userStats.lastClickTimestamp) / (1000 * 60 * 60 * 24)) <= 1 
      ? currentStreak + 1 
      : 1;

    const newStats: UserStats = {
      totalClicks: userStats.totalClicks + 1,
      streakCount: newStreak,
      lastClickTimestamp: timestamp,
      dailyClicks: newDailyClicks
    };

    const newPoints = [newPoint, ...shmooPoints];

    // Update state
    setUserStats(newStats);
    setShmooPoints(newPoints);
    setLastTxHash(mockTxHash);

    // Save to localStorage
    saveUserData(newStats, newPoints);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="min-h-screen bg-bg w-full">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />
      
      {/* Main Content */}
      <div className="w-full px-4 py-6 max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shmoo Clicker
          </h1>
          <p className="text-sm text-gray-600">
            Click your way to verifiable digital points
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && address ? (
          <div className="space-y-6">
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Contract Info */}
            {contractInfo.totalPoints > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Global Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Total Points Generated</p>
                    <p className="font-bold text-blue-900">{contractInfo.totalPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Latest Point ID</p>
                    <p className="font-bold text-blue-900">#{contractInfo.currentId}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Stats Display */}
            <StatsDisplay userStats={userStats} />
            
            {/* Shmoo Button */}
            <ShmooButton 
              onGenerate={generateShmooPoint}
              isGenerating={isGenerating}
              disabled={!walletClient}
            />

            {/* Last Transaction */}
            {lastTxHash && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Latest Transaction:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {lastTxHash}
                  </code>
                  <a 
                    href={`https://etherscan.io/tx/${lastTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Transaction History */}
            <TransactionHistory points={shmooPoints.slice(0, 5)} />
            
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Connect your Ethereum wallet to start generating Shmoo points and track your clicking progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
