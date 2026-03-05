'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAdmin } from '@/lib/auth';
import { walletTracker } from '@/lib/wallet-tracker';
import { copyTradingEngine } from '@/lib/copy-trading';
import { Button } from '@/components/ui/button';
import { Shield, Users, TrendingUp, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const { userProfile } = useAuth();
  const { isAdmin, getAllDelegationRequests, approveDelegationRequest, rejectDelegationRequest, getUsersWithDelegation } = useAdmin();
  const [delegationRequests, setDelegationRequests] = useState<any[]>([]);
  const [usersWithDelegation, setUsersWithDelegation] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any>(null);
  const [copyTradingStats, setCopyTradingStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load delegation requests
      const requests = getAllDelegationRequests();
      setDelegationRequests(requests);
      
      // Load users with delegation
      const users = getUsersWithDelegation();
      setUsersWithDelegation(users);
      
      // Load wallet statistics
      const stats = walletTracker.getStatistics();
      setWalletStats(stats);
      
      // Load copy trading statistics
      const copyStats = copyTradingEngine.getCopyTradingStats();
      setCopyTradingStats(copyStats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = (requestId: string) => {
    approveDelegationRequest(requestId);
    loadAdminData();
  };

  const handleRejectRequest = (requestId: string) => {
    rejectDelegationRequest(requestId);
    loadAdminData();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have admin privileges</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
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
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-gray-400">Manage wallets and copy trading permissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 rounded-full text-sm bg-red-900 text-red-300">
                Admin Access
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Wallets</p>
                <p className="text-2xl font-bold text-white">{walletStats?.totalWallets || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Wallets</p>
                <p className="text-2xl font-bold text-white">{walletStats?.activeWallets || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Delegation Requests</p>
                <p className="text-2xl font-bold text-white">{delegationRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Copy Trades</p>
                <p className="text-2xl font-bold text-white">{copyTradingStats?.totalTrades || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delegation Requests */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Delegation Requests</h2>
              <p className="text-gray-400 text-sm">Users requesting copy trading permissions</p>
            </div>
            <div className="p-6">
              {delegationRequests.length > 0 ? (
                <div className="space-y-4">
                  {delegationRequests.filter(req => req.status === 'pending').map((request) => (
                    <div key={request.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">
                            {request.userAddress.slice(0, 8)}...{request.userAddress.slice(-8)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Requested: {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-900 text-yellow-300">
                          Pending
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Permissions Requested:</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Copy Trading</span>
                            <span className="text-sm text-gray-400">
                              {request.permissions.copyTrading ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Max Amount</span>
                            <span className="text-sm text-gray-400">
                              {request.permissions.maxAmount} SOL
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Allowed Tokens</span>
                            <span className="text-sm text-gray-400">
                              {request.permissions.allowedTokens.length} tokens
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="border-red-600 text-red-300 hover:bg-red-900"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No pending delegation requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Users with Delegation */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Users with Delegation</h2>
              <p className="text-gray-400 text-sm">Users who can copy your trades</p>
            </div>
            <div className="p-6">
              {usersWithDelegation.length > 0 ? (
                <div className="space-y-4">
                  {usersWithDelegation.map((user, index) => (
                    <div key={index} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">
                            {user.userAddress.slice(0, 8)}...{user.userAddress.slice(-8)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Approved: {new Date(user.approvedAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">
                          Active
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Max Amount</span>
                          <span className="text-sm text-gray-400">
                            {user.permissions.maxAmount} SOL
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Allowed Tokens</span>
                          <span className="text-sm text-gray-400">
                            {user.permissions.allowedTokens.length} tokens
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No users with delegation</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copy Trading Statistics */}
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">Copy Trading Statistics</h2>
            <p className="text-gray-400 text-sm">Overall platform performance</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{copyTradingStats?.totalTrades || 0}</p>
                <p className="text-gray-400">Total Copy Trades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{copyTradingStats?.successfulTrades || 0}</p>
                <p className="text-gray-400">Successful Trades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">{copyTradingStats?.averageReturn?.toFixed(1) || 0}%</p>
                <p className="text-gray-400">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
