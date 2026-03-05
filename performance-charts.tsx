import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Check if wallet is admin
    const adminWallets = process.env.ADMIN_WALLET_ADDRESS?.split(',') || [];
    const isAdmin = adminWallets.includes(walletAddress);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
