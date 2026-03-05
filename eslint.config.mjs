'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { copyTradingEngine } from '@/lib/copy-trading';
import { CopyTrade, TradingSignal } from '@/lib/copy-trading';
import { Button } from '@/components/ui/button';
import { Copy, AlertTriangle, CheckCircle, XCircle, TrendingUp, Activity, Settings } from 'lucide-react';

export default function CopyTrading() {
  const { userProfile } = useAuth();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null);
  const [copyAmount, setCopyAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadCopyTradingData();
    }
  }, [userProfile]);

  const loadCopyTradingData = async () => {
    try {
      setIsLoading(true);
      const signalsData = copyTradingEngine.getTradingSignals(userProfile?.walletAddress);
      const tradesData = copyTradingEngine.getActiveCopyTrades(userProfile?.walletAddress || '');
      
      setSignals(signalsData);
      setCopyTrades(tradesData);
    } catch (error) {
      console.error('Error loading copy trading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeCopyTrade = async (signal: TradingSignal, amount: number) => {
    try {
      const copyTrade = await copyTradingEngine.executeManualCopyTrade(
        userProfile?.walletAddress || '',
        signal.transaction,
        amount
      );
      
      setCopyTrades(prev => [copyTrade, ...prev]);
      setSelectedSignal(null);
      setCopyAmount('');
    } catch (error) {
      console.error('Error executing copy trade:', error);
      alert('Error executing copy trade. Please try again.');
    }
  };

  const getStatusColor = (status: CopyTrade['status']) => {
    switch (status) {
      case 'executed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: CopyTrade['status']) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: TradingSignal['riskLevel']) => {
    switch (risk) {
      case 'low':
        return 'text-green-400 bg-green-900';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900';
      case 'high':
        return 'text-red-400 bg-red-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading copy trading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Copy Trading</h1>
              <p className="text-gray-400">Copy trades from top performing wallets</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${
                userProfile?.copyTradingEnabled 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-yellow-900 text-yellow-300'
              }`}>
                {userProfile?.copyTradingEnabled ? 'Copy Trading Active' : 'Copy Trading Disabled'}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Copy Trading Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Copy Amount (SOL)
                </label>
                <input
                  type="number"
                  placeholder="0.1"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  placeholder="1.0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Enable Auto Copy Trading</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Save Settings
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trading Signals */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Trading Signals</h2>
              <p className="text-gray-400 text-sm">Latest opportunities from top wallets</p>
            </div>
            <div className="p-6">
              {signals.length > 0 ? (
                <div className="space-y-4">
                  {signals.slice(0, 5).map((signal) => (
                    <div key={signal.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            signal.riskLevel === 'low' ? 'bg-green-400' :
                            signal.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          <span className="ml-2 text-sm text-gray-400">
                            {signal.transaction.walletAddress.slice(0, 6)}...{signal.transaction.walletAddress.slice(-4)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(signal.riskLevel)}`}>
                          {signal.riskLevel} risk
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">
                            {signal.transaction.tokenIn} → {signal.transaction.tokenOut}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Amount: {signal.transaction.amountIn?.toFixed(4) || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-400 font-medium">
                            {signal.signalStrength.toFixed(0)}% strength
                          </p>
                          <p className="text-gray-400 text-sm">
                            {signal.confidence.toFixed(0)}% confidence
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedSignal(signal)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Trade
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-gray-300 hover:bg-slate-600"
                          >
                            View Details
                          </Button>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(signal.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No trading signals</p>
                  <p className="text-gray-500 text-sm">Signals will appear when tracked wallets make trades</p>
                </div>
              )}
            </div>
          </div>

          {/* Copy Trades */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Your Copy Trades</h2>
              <p className="text-gray-400 text-sm">Your executed copy trades</p>
            </div>
            <div className="p-6">
              {copyTrades.length > 0 ? (
                <div className="space-y-4">
                  {copyTrades.slice(0, 5).map((trade) => (
                    <div key={trade.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {getStatusIcon(trade.status)}
                          <span className={`ml-2 font-medium ${getStatusColor(trade.status)}`}>
                            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(trade.executedAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">
                            {trade.tokenIn} → {trade.tokenOut}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Amount: {trade.amount.toFixed(4)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">
                            From: {trade.adminAddress.slice(0, 6)}...{trade.adminAddress.slice(-4)}
                          </p>
                          {trade.transactionSignature && (
                            <p className="text-purple-400 text-sm">
                              TX: {trade.transactionSignature.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {trade.error && (
                        <div className="flex items-center text-red-400 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {trade.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Copy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No copy trades yet</p>
                  <p className="text-gray-500 text-sm">Copy trades will appear here when you execute them</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copy Trade Modal */}
        {selectedSignal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Execute Copy Trade</h3>
              
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Original Trade</p>
                <p className="text-white font-medium">
                  {selectedSignal.transaction.tokenIn} → {selectedSignal.transaction.tokenOut}
                </p>
                <p className="text-gray-400 text-sm">
                  Amount: {selectedSignal.transaction.amountIn?.toFixed(4) || 'N/A'}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Copy Amount (SOL)
                </label>
                <input
                  type="number"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(e.target.value)}
                  placeholder={selectedSignal.recommendedAmount.toString()}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Recommended: {selectedSignal.recommendedAmount.toFixed(4)} SOL
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-400">Risk Level</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(selectedSignal.riskLevel)}`}>
                    {selectedSignal.riskLevel} risk
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Signal Strength</p>
                  <p className="text-purple-400 font-medium">
                    {selectedSignal.signalStrength.toFixed(0)}%
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSignal(null);
                    setCopyAmount('');
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const amount = parseFloat(copyAmount) || selectedSignal.recommendedAmount;
                    executeCopyTrade(selectedSignal, amount);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Execute Copy Trade
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
