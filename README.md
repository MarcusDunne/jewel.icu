# Jewel ICU Airdrop System

![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A production-ready Solana token airdrop system with secure backend API, token locking functionality, and web interface for the Jewel ICU token ecosystem.

## 🚀 Features

### Core Functionality
- **One-Click Airdrop Claims** - Simple and intuitive claiming process
- **Anti-Bot Protection** - Google reCAPTCHA v3 integration
- **Rate Limiting** - IP-based rate limiting to prevent abuse
- **Database Tracking** - PostgreSQL for reliable claim tracking
- **Admin Dashboard** - Real-time statistics and management

### Security Features
- **Wallet Validation** - Ensures valid Solana addresses
- **Duplicate Prevention** - One claim per wallet address
- **Secure Key Storage** - Base64 encoded private keys
- **CORS Protection** - Configurable origin restrictions
- **API Authentication** - Admin endpoints protection

### Token Lock Program
- **Time-Based Locking** - Lock tokens for 1 hour to 1 year
- **Solana Smart Contract** - Secure on-chain implementation
- **Web Interface** - Easy-to-use locking/unlocking UI
- **Multiple Lock Periods** - Flexible duration options

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Solana CLI tools
- A funded Solana wallet with tokens to distribute
- Google reCAPTCHA v3 keys

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/jewel-icu-airdrop.git
cd jewel-icu-airdrop
```

### 2. Backend Setup
```bash
cd airdrop-backend
npm install

# Create and configure environment
cp .env.example .env
# Edit .env with your configuration

# Create wallet (if needed)
node create-wallet.js

# Start the server
npm start
```

### 3. Frontend Setup
The frontend files are in the root directory:
- `index.html` - Main airdrop interface
- `token-lock-ui.html` - Token locking interface
- `js/tokenLock.js` - Token lock functionality

Serve these files with any web server or open directly in a browser.

## 📚 Documentation

- [Quick Start Guide](airdrop-backend/QUICK_START.md) - Detailed setup instructions
- [Deployment Guide](AIRDROP_DEPLOYMENT_GUIDE.md) - Deploy to production
- [Security Guide](AIRDROP_SECURITY_GUIDE.md) - Security best practices
- [Production Checklist](AIRDROP_PRODUCTION_CHECKLIST.md) - Pre-launch checklist
- [Frontend Integration](FRONTEND_INTEGRATION_GUIDE.md) - Integrate with your website

## 🏗️ Project Structure

```
├── airdrop-backend/          # Backend API server
│   ├── server.js            # Express server
│   ├── database.js          # PostgreSQL setup
│   ├── utils/               # Validation & CAPTCHA
│   └── Dockerfile           # Container configuration
├── programs/token-lock/      # Solana smart contract
│   └── src/lib.rs          # Token lock program
├── js/                      # Frontend JavaScript
│   └── tokenLock.js        # Token lock client
├── .github/workflows/       # CI/CD pipelines
│   ├── ci.yml              # Testing workflow
│   ├── deploy-render.yml   # Deployment workflow
│   └── docker.yml          # Docker build workflow
├── index.html              # Main airdrop UI
└── token-lock-ui.html      # Token lock UI
```

## 🚀 Deployment Options

### Render (Recommended)
See [Render Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)

### Other Platforms
- Railway - [Quick Deploy Guide](RAILWAY_DEPLOY_NOW.md)
- Heroku - Use the included Dockerfile
- VPS - Docker Compose deployment
- DigitalOcean App Platform

## 🔧 Configuration

### Environment Variables
```env
# Solana Configuration
AIRDROP_PRIVATE_KEY=base64_encoded_private_key
TOKEN_MINT_ADDRESS=your_token_mint_address
AIRDROP_AMOUNT=1000000000  # In smallest units

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/airdrop

# Security
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret
ADMIN_API_KEY=secure_admin_key

# Server
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com
```

### API Endpoints

- `POST /api/airdrop/claim` - Claim tokens
- `GET /api/airdrop/stats` - Get statistics (requires admin key)
- `GET /api/airdrop/history` - Get claim history (requires admin key)
- `GET /health` - Health check endpoint

## 🧪 Testing

```bash
cd airdrop-backend

# Run the test script
node test-airdrop.js

# Or use curl
curl -X POST http://localhost:3001/api/airdrop/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "YOUR_WALLET", "recaptchaToken": "test"}'
```

## 🔒 Security Considerations

1. **Private Key Security** - Never commit private keys
2. **Rate Limiting** - Configured for 10 requests per 15 minutes per IP
3. **Input Validation** - All inputs are validated and sanitized
4. **CORS Policy** - Restrict to your domain only
5. **Database Security** - Use strong passwords and SSL connections

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Solana Foundation for the blockchain infrastructure
- SPL Token program for token standards
- The open-source community for various tools and libraries

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review security guidelines before deployment

---

**⚠️ Important**: Always test on devnet before deploying to mainnet. Ensure you have proper security measures in place before handling real tokens.