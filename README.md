# Solana Copy Trading Platform

A comprehensive social trading platform built for Solana that allows users to track top-performing wallets and automatically copy their trades. Built with Next.js, TypeScript, and Privy for authentication.

## Features

### 🔍 Wallet Tracking
- Monitor top-performing Solana wallets in real-time
- Track wallet performance metrics (PnL, win rate, total trades)
- Rank wallets by performance score
- Add custom tags and descriptions for tracked wallets

### 📊 Performance Analytics
- Detailed performance charts and metrics
- Historical performance tracking
- Wallet ranking and comparison tools
- Visual analytics with interactive charts

### 🔄 Copy Trading
- Automatic copy trading from top performers
- Manual copy trading with customizable amounts
- Risk assessment and signal strength indicators
- Real-time trading signals and notifications

### 🔐 Delegation System
- Secure delegation of trading permissions
- Admin approval workflow for copy trading access
- Granular permission controls (max amounts, allowed tokens)
- User management and access control

### 🛡️ Admin Panel
- Manage delegation requests
- Monitor platform statistics
- Oversee copy trading activities
- User management and access control

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Privy
- **Blockchain**: Solana Web3.js
- **Charts**: Recharts
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- Solana RPC endpoint
- Privy App ID and Secret

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd copy-trading-social-media
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_admin_wallet_private_key_here

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# Admin Configuration
ADMIN_WALLET_ADDRESS=your_admin_wallet_address_here
```

5. Start the development server:
```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── analytics/          # Analytics page
│   ├── admin/              # Admin panel
│   ├── copy-trading/       # Copy trading interface
│   ├── wallets/            # Wallet tracking
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── admin/              # Admin components
│   ├── analytics/          # Analytics components
│   ├── copy-trading/       # Copy trading components
│   ├── dashboard/          # Dashboard components
│   ├── navigation/         # Navigation components
│   ├── ui/                 # Reusable UI components
│   └── wallet-tracker/    # Wallet tracking components
└── lib/                    # Core functionality
    ├── auth.ts             # Authentication logic
    ├── copy-trading.ts     # Copy trading engine
    ├── solana.ts           # Solana integration
    ├── transaction-indexer.ts # Transaction processing
    ├── utils.ts            # Utility functions
    └── wallet-tracker.ts   # Wallet tracking system
```

## Key Features Explained

### Wallet Tracking System
The platform continuously monitors Solana wallets by:
- Fetching recent transactions via Solana RPC
- Analyzing transaction patterns and performance
- Calculating PnL, win rates, and other metrics
- Ranking wallets by performance score

### Transaction Indexer
A sophisticated system that:
- Indexes and categorizes transactions (swaps, transfers, stakes)
- Extracts token transfer information
- Identifies trading patterns and opportunities
- Provides real-time transaction monitoring

### Copy Trading Engine
Automated trading system that:
- Monitors tracked wallets for new transactions
- Generates trading signals based on performance
- Executes copy trades with customizable parameters
- Manages risk and position sizing

### Delegation System
Secure permission management:
- Users request delegation from admin wallets
- Admins approve/reject requests with custom permissions
- Granular control over trading amounts and token restrictions
- Secure storage of delegation permissions

## Usage

### For Regular Users
1. **Connect Wallet**: Use Privy to connect your Solana wallet
2. **Request Delegation**: Request copy trading permissions from admin
3. **Browse Wallets**: Explore top-performing wallets
4. **Copy Trades**: Execute copy trades manually or enable auto-copy
5. **Monitor Performance**: Track your copy trading results

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` (requires admin wallet)
2. **Manage Delegations**: Approve/reject user delegation requests
3. **Monitor Platform**: View platform statistics and user activity
4. **Track Performance**: Monitor overall copy trading performance

## Security Considerations

- All wallet connections are handled securely through Privy
- Delegation permissions are stored locally (in production, use secure database)
- Private keys should never be exposed in client-side code
- Admin functions are protected by wallet address verification
- All transactions are validated before execution

## Development

### Adding New Features
1. Create components in appropriate directories
2. Add new pages in the `app/` directory
3. Update navigation in `components/navigation/navbar.tsx`
4. Add any new API routes in `app/api/`

### Testing
```bash
yarn lint          # Run ESLint
yarn build         # Build for production
yarn start         # Start production server
```

## Deployment

1. Build the application:
```bash
yarn build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Configure environment variables in your deployment platform

4. Ensure your Solana RPC endpoint is accessible from production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## Roadmap

- [ ] Database integration for persistent storage
- [ ] Advanced risk management features
- [ ] Social features (following, leaderboards)
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with more DEXs
- [ ] Automated strategy backtesting
- [ ] Community features and discussions