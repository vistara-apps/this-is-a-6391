import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

interface ShmooPoint {
  pointId: string;
  userAddress: string;
  timestamp: number;
  txHash?: string;
}

interface TransactionHistoryProps {
  points: ShmooPoint[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ points }) => {
  if (points.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h3>
        <p className="text-gray-500 text-center py-4">
          No Shmoo points generated yet. Click the button above to get started!
        </p>
      </div>
    );
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        {points.map((point, index) => (
          <div key={point.pointId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  Shmoo Point #{points.length - index}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(point.timestamp)} at {formatTime(point.timestamp)}
              </div>
            </div>
            
            {point.txHash && (
              <a 
                href={`https://etherscan.io/tx/${point.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </div>
      
      {points.length >= 5 && (
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Showing recent 5 transactions
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
