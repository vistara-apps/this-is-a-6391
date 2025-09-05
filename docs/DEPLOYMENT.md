# Shmoo Clicker Deployment Guide

This guide covers the complete deployment process for the Shmoo Clicker application, including smart contract deployment and frontend hosting.

## 🚀 Quick Deployment Checklist

- [ ] Get Alchemy API key
- [ ] Deploy smart contract to Ethereum mainnet
- [ ] Configure environment variables
- [ ] Deploy frontend to hosting platform
- [ ] Test all functionality
- [ ] Monitor for issues

## 📋 Prerequisites

### Required Accounts & Services
1. **Alchemy Account**: For Ethereum mainnet access
   - Sign up at [alchemy.com](https://alchemy.com)
   - Create a new app for Ethereum Mainnet
   - Copy the API key

2. **Ethereum Wallet**: For contract deployment
   - MetaMask or similar wallet
   - Sufficient ETH for deployment (~0.01-0.02 ETH)

3. **Hosting Platform**: Choose one:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages
   - IPFS

### Development Tools
- Node.js 18+
- Git
- Code editor (VS Code recommended)

## 🔧 Smart Contract Deployment

### Option 1: Remix IDE (Recommended for beginners)

1. **Open Remix IDE**
   - Go to [remix.ethereum.org](https://remix.ethereum.org)

2. **Create Contract File**
   - Create new file: `ShmooPoints.sol`
   - Copy contract code from `contracts/ShmooPoints.sol`

3. **Compile Contract**
   - Go to "Solidity Compiler" tab
   - Select compiler version: `0.8.19+`
   - Click "Compile ShmooPoints.sol"

4. **Deploy Contract**
   - Go to "Deploy & Run Transactions" tab
   - Select Environment: "Injected Provider - MetaMask"
   - Connect your MetaMask wallet
   - Ensure you're on Ethereum Mainnet
   - Click "Deploy"
   - Confirm transaction in MetaMask

5. **Copy Contract Address**
   - After deployment, copy the contract address
   - Save it for environment configuration

### Option 2: Hardhat (Advanced)

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   ```

2. **Initialize Hardhat**
   ```bash
   npx hardhat init
   ```

3. **Configure Hardhat**
   Create `hardhat.config.js`:
   ```javascript
   require("@nomiclabs/hardhat-ethers");
   require("@nomiclabs/hardhat-etherscan");

   module.exports = {
     solidity: "0.8.19",
     networks: {
       mainnet: {
         url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       }
     },
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY
     }
   };
   ```

4. **Deploy Contract**
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

### Gas Estimation
- Deployment cost: ~1,200,000 gas
- At 20 gwei: ~0.024 ETH
- At 50 gwei: ~0.06 ETH

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   VITE_SHMOO_CONTRACT_ADDRESS=0x...
   VITE_WALLETCONNECT_PROJECT_ID=9f4bd472c01ba49282b42e5e1874c2af
   VITE_NETWORK=mainnet
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Domain will be provided (e.g., `shmoo-clicker.vercel.app`)

4. **Custom Domain (Optional)**
   - Add custom domain in Vercel settings
   - Configure DNS records

### Option 2: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   Add the same variables as Vercel

4. **Deploy**
   - Netlify will build and deploy automatically

### Option 3: GitHub Pages

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages**
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Select `gh-pages` branch

### Option 4: IPFS (Decentralized)

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Upload to IPFS**
   - Use [Pinata](https://pinata.cloud) or [Fleek](https://fleek.co)
   - Upload the `dist` folder
   - Get IPFS hash

3. **Access via Gateway**
   - `https://gateway.pinata.cloud/ipfs/{hash}`
   - `https://{hash}.ipfs.dweb.link`

## 🔐 Environment Configuration

### Production Environment Variables

```env
# Required
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_SHMOO_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Optional (defaults provided)
VITE_WALLETCONNECT_PROJECT_ID=9f4bd472c01ba49282b42e5e1874c2af
VITE_NETWORK=mainnet

# Optional: Turnkey (future enhancement)
VITE_TURNKEY_API_BASE_URL=https://api.turnkey.com
VITE_TURNKEY_ORGANIZATION_ID=your_org_id
```

### Security Best Practices

1. **API Keys**
   - Never commit API keys to repository
   - Use environment variables in hosting platform
   - Rotate keys regularly

2. **Contract Address**
   - Verify contract address before deployment
   - Use checksummed addresses
   - Test on testnet first

3. **Domain Security**
   - Use HTTPS only
   - Configure security headers
   - Enable HSTS

## 🧪 Testing Deployment

### Pre-deployment Testing

1. **Local Testing**
   ```bash
   npm run build
   npm run preview
   ```

2. **Contract Verification**
   - Verify contract on Etherscan
   - Test all contract functions
   - Check gas costs

3. **Wallet Integration**
   - Test with multiple wallets
   - Verify transaction signing
   - Check error handling

### Post-deployment Testing

1. **Functionality Tests**
   - [ ] Wallet connection works
   - [ ] Shmoo point generation works
   - [ ] Transaction history displays
   - [ ] Etherscan links work
   - [ ] Stats update correctly

2. **Performance Tests**
   - [ ] Page loads quickly
   - [ ] Responsive on mobile
   - [ ] Works on different browsers
   - [ ] Handles network errors

3. **Security Tests**
   - [ ] HTTPS enabled
   - [ ] No console errors
   - [ ] Environment variables secure
   - [ ] Contract interactions safe

## 📊 Monitoring & Maintenance

### Monitoring Setup

1. **Application Monitoring**
   - Use Vercel Analytics or similar
   - Monitor page load times
   - Track user interactions

2. **Contract Monitoring**
   - Watch for contract events
   - Monitor gas usage
   - Track total points generated

3. **Error Tracking**
   - Implement error reporting (Sentry)
   - Monitor console errors
   - Track failed transactions

### Maintenance Tasks

1. **Regular Updates**
   - Update dependencies monthly
   - Monitor security advisories
   - Test after updates

2. **Performance Optimization**
   - Optimize bundle size
   - Implement caching strategies
   - Monitor Core Web Vitals

3. **User Support**
   - Monitor user feedback
   - Update documentation
   - Fix reported issues

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
- Check variable names (must start with `VITE_`)
- Verify values are correct
- Restart deployment after changes

#### Contract Connection Issues
- Verify contract address is correct
- Check network configuration
- Ensure Alchemy API key is valid

#### Wallet Connection Issues
- Check WalletConnect project ID
- Verify supported networks
- Test with different wallets

### Emergency Procedures

1. **Contract Issues**
   - Contract is non-upgradeable
   - Deploy new contract if needed
   - Update frontend configuration

2. **Frontend Issues**
   - Rollback to previous deployment
   - Fix issues and redeploy
   - Communicate with users

3. **API Issues**
   - Switch to backup RPC provider
   - Update Alchemy configuration
   - Monitor service status

## 📈 Scaling Considerations

### Performance Optimization
- Implement CDN for static assets
- Use service workers for caching
- Optimize images and fonts

### Infrastructure Scaling
- Use multiple RPC providers
- Implement rate limiting
- Add monitoring and alerting

### Feature Enhancements
- Add analytics tracking
- Implement user notifications
- Add social sharing features

## 📚 Additional Resources

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Deployment Guide](https://docs.netlify.com/)
- [Alchemy Documentation](https://docs.alchemy.com/)
- [Ethereum Development Guide](https://ethereum.org/en/developers/)
- [Web3 Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
