'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { walletTracker } from '@/lib/wallet-tracker';
import { copyTradingEngine } from '@/lib/copy-trading';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface PerformanceData {
  date: string;
  totalValue: number;
  pnl: number;
  trades: number;
  winRate: number;
}

interface WalletPerformanceData {
  address: string;
  name: string;
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
  winRate: number;
  totalTrades: number;
  rank: number;
}

export default function PerformanceCharts() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [walletData, setWalletData] = useState<WalletPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Generate mock performance data for the last 30 days
      const mockPerformanceData: PerformanceData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        mockPerformanceData.push({
          date: date.toISOString().split('T')[0],
          totalValue: 1000 + Math.random() * 500,
          pnl: (Math.random() - 0.5) * 200,
          trades: Math.floor(Math.random() * 20) + 5,
          winRate: 60 + Math.random() * 30,
        });
      }
      
      setPerformanceData(mockPerformanceData);
      
      // Load wallet performance data
      const trackedWallets = walletTracker.getTrackedWallets();
      const walletPerformanceData: WalletPerformanceData[] = trackedWallets.map(wallet => ({
        address: wallet.address,
        name: wallet.name || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
        totalValue: wallet.performance.totalValue,
        pnl: wallet.performance.pnl,
        pnlPercentage: wallet.performance.pnlPercentage,
        winRate: wallet.performance.winRate,
        totalTrades: wallet.performance.totalTrades,
        rank: wallet.performance.rank,
      }));
      
      setWalletData(walletPerformanceData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
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
              <h1 className="text-2xl font-bold">Performance Analytics</h1>
              <p className="text-gray-400">Detailed insights into wallet and trading performance</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  ${performanceData.length > 0 ? performanceData[performanceData.length - 1].totalValue.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total PnL</p>
                <p className="text-2xl font-bold text-white">
                  ${performanceData.length > 0 ? performanceData[performanceData.length - 1].pnl.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">
                  {performanceData.length > 0 ? performanceData[performanceData.length - 1].trades : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {performanceData.length > 0 ? performanceData[performanceData.length - 1].winRate.toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Performance Over Time</h2>
              <p className="text-gray-400 text-sm">Total value and PnL trends</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Total Value ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="PnL ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Win Rate Chart */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Win Rate Trend</h2>
              <p className="text-gray-400 text-sm">Success rate over time</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Win Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Wallet Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Top Performing Wallets</h2>
              <p className="text-gray-400 text-sm">Ranked by performance score</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={walletData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="pnlPercentage" fill="#8B5CF6" name="PnL %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wallet Distribution */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Wallet Performance Distribution</h2>
              <p className="text-gray-400 text-sm">PnL percentage distribution</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Profitable', value: walletData.filter(w => w.pnlPercentage > 0).length },
                      { name: 'Break-even', value: walletData.filter(w => w.pnlPercentage === 0).length },
                      { name: 'Loss', value: walletData.filter(w => w.pnlPercentage < 0).length },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Profitable', value: walletData.filter(w => w.pnlPercentage > 0).length },
                      { name: 'Break-even', value: walletData.filter(w => w.pnlPercentage === 0).length },
                      { name: 'Loss', value: walletData.filter(w => w.pnlPercentage < 0).length },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Wallet Table */}
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">Detailed Wallet Performance</h2>
            <p className="text-gray-400 text-sm">Complete performance breakdown</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-300">Wallet</th>
                    <th className="text-left py-3 px-4 text-gray-300">Total Value</th>
                    <th className="text-left py-3 px-4 text-gray-300">PnL</th>
                    <th className="text-left py-3 px-4 text-gray-300">Win Rate</th>
                    <th className="text-left py-3 px-4 text-gray-300">Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.map((wallet, index) => (
                    <tr key={wallet.address} className="border-b border-slate-700">
                      <td className="py-3 px-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                          {wallet.rank || index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{wallet.name}</p>
                          <p className="text-gray-400 text-sm">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white">
                        ${wallet.totalValue.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {wallet.pnlPercentage >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                          )}
                          <span className={`font-medium ${
                            wallet.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {wallet.pnlPercentage >= 0 ? '+' : ''}{wallet.pnlPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {wallet.winRate.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-white">
                        {wallet.totalTrades}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
