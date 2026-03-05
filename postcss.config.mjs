'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, useAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Home, TrendingUp, Copy, Shield, Menu, X, LogOut, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const { authenticated, userProfile, disconnectWallet } = useAuth();
  const { isAdmin } = useAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Wallet Tracker', href: '/wallets', icon: TrendingUp },
    { name: 'Copy Trading', href: '/copy-trading', icon: Copy },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Shield }] : []),
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SolanaCopy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  {userProfile?.displayName || 'User'}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  userProfile?.copyTradingEnabled 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {userProfile?.copyTradingEnabled ? 'Active' : 'Inactive'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-700 rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {authenticated ? (
                <div className="border-t border-slate-600 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-300">
                    {userProfile?.displayName || 'User'}
                  </div>
                  <div className={`px-3 py-2 text-sm ${
                    userProfile?.copyTradingEnabled 
                      ? 'text-green-300' 
                      : 'text-yellow-300'
                  }`}>
                    {userProfile?.copyTradingEnabled ? 'Copy Trading Active' : 'Copy Trading Inactive'}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      disconnectWallet();
                      setIsMenuOpen(false);
                    }}
                    className="w-full mt-2 border-slate-600 text-gray-300 hover:bg-slate-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="border-t border-slate-600 pt-3 mt-3">
                  <Button
                    onClick={() => {
                      window.location.href = '/';
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
