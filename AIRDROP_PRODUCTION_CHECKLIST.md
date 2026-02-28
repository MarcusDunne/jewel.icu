# Jewel ICU Airdrop - Production Implementation Checklist

## Quick Start Guide
This checklist provides actionable steps to move your airdrop from demo to production.

## Phase 1: Immediate Setup (Day 1-2)

### 1. Airdrop Wallet Setup ⚡ CRITICAL
```bash
# Generate new wallet for airdrop
solana-keygen new --outfile ~/jewel-airdrop-wallet.json

# Save the public key
solana address -k ~/jewel-airdrop-wallet.json

# Fund the wallet with JEWEL ICU tokens
# Calculate: (expected_recipients × 1 token) + 10% buffer for fees
```

**Checklist:**
- [ ] Generate dedicated airdrop wallet
- [ ] Secure private key in password manager
- [ ] Fund wallet with JEWEL ICU tokens
- [ ] Test with small amount first (10-100 tokens)

### 2. Choose Your Backend Stack
**Option A: Node.js/Express (Recommended for JavaScript developers)**
```bash
mkdir jewel-airdrop-backend
cd jewel-airdrop-backend
npm init -y
npm install express cors helmet rate-limit-flexible dotenv
npm install @solana/web3.js @solana/spl-token
npm install pg # for PostgreSQL
```

**Option B: Python/FastAPI (If you prefer Python)**
```bash
mkdir jewel-airdrop-backend
cd jewel-airdrop-backend
python -m venv venv
pip install fastapi uvicorn solana-py sqlalchemy psycopg2
```

### 3. Database Setup
**PostgreSQL (Recommended)**
```sql
-- Create database
CREATE DATABASE jewel_airdrop;

-- Essential tables only
CREATE TABLE airdrop_claims (
    wallet_address VARCHAR(44) PRIMARY KEY,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_signature VARCHAR(88),
    ip_address INET
);

CREATE INDEX idx_claimed_at ON airdrop_claims(claimed_at);
```

## Phase 2: Core Implementation (Day 3-5)

### 4. Minimal Viable Backend
Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Connection, PublicKey, Keypair, Transaction } = require('@solana/web3.js');
const { createTransferInstruction, getAssociatedTokenAddress } = require('@solana/spl-token');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://jewel.icu' }));
app.use(express.json());

// Load airdrop wallet
const airdropWallet = Keypair.fromSecretKey(
  Buffer.from(process.env.AIRDROP_PRIVATE_KEY, 'base64')
);

// Airdrop endpoint
app.post('/api/airdrop/claim', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    // Check if already claimed
    const claimed = await checkIfClaimed(walletAddress);
    if (claimed) {
      return res.status(400).json({ error: 'Already claimed' });
    }
    
    // Process airdrop
    const signature = await processAirdrop(walletAddress);
    
    // Record claim
    await recordClaim(walletAddress, signature, req.ip);
    
    res.json({ success: true, signature });
  } catch (error) {
    console.error('Airdrop error:', error);
    res.status(500).json({ error: 'Airdrop failed' });
  }
});

app.listen(3001, () => {
  console.log('Airdrop server running on port 3001');
});
```

### 5. Environment Variables
Create `.env`:
```bash
# NEVER commit this file
AIRDROP_PRIVATE_KEY=base64_encoded_private_key_here
DATABASE_URL=postgresql://user:password@localhost/jewel_airdrop
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
JEWEL_TOKEN_MINT=37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump
```

### 6. Update Frontend
Modify your [`handleAirdrop()`](index.html:1477) function:
```javascript
async handleAirdrop() {
    if (this.isProcessing) return;
    
    if (!walletConnection || !walletConnection.connected) {
        walletConnection.showToast('Please connect your wallet first', 'error');
        return;
    }

    this.isProcessing = true;
    this.setButtonLoading(true);

    try {
        // Call your backend API
        const response = await fetch('https://api.jewel.icu/airdrop/claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: walletConnection.provider.publicKey.toString()
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            walletConnection.showToast('🎉 Airdrop successful! Check your wallet.', 'success');
            // Optionally show transaction link
            console.log('Transaction:', `https://solscan.io/tx/${data.signature}`);
        } else {
            walletConnection.showToast(data.error || 'Airdrop failed', 'error');
        }
    } catch (error) {
        console.error('Airdrop error:', error);
        walletConnection.showToast('Network error. Please try again.', 'error');
    } finally {
        this.setButtonLoading(false);
        this.isProcessing = false;
    }
}
```

## Phase 3: Security Essentials (Day 6-7)

### 7. Add Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 requests per IP
    message: 'Too many requests, please try again later.'
});

app.use('/api/airdrop', limiter);
```

### 8. Add Basic Validation
```javascript
// Validate wallet address
function isValidSolanaAddress(address) {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
}

// In your endpoint
if (!isValidSolanaAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
}
```

## Phase 4: Deployment (Day 8-10)

### 9. Deployment Options

**Option A: Heroku (Simple)**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create jewel-airdrop-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

**Option B: DigitalOcean App Platform**
- Create new app
- Connect GitHub repo
- Add PostgreSQL database
- Set environment variables
- Deploy

**Option C: AWS/Google Cloud (Advanced)**
- Use EC2/Compute Engine
- Set up load balancer
- Configure auto-scaling

### 10. DNS & SSL Setup
- Point api.jewel.icu to your backend
- Ensure HTTPS is enabled (most platforms handle this)
- Update CORS settings to match

## Phase 5: Testing & Launch (Day 11-12)

### 11. Testing Checklist
- [ ] Test with testnet first
- [ ] Verify rate limiting works
- [ ] Test duplicate claim prevention
- [ ] Check error handling
- [ ] Monitor server logs
- [ ] Test with different wallets

### 12. Soft Launch Strategy
1. **Alpha Test**: Test with team members only
2. **Beta Test**: Invite 10-20 community members
3. **Limited Launch**: Open for first 100 users
4. **Full Launch**: Open to everyone

## Monitoring & Maintenance

### Daily Tasks
- [ ] Check wallet balance
- [ ] Review claim logs
- [ ] Monitor error rates
- [ ] Check for suspicious activity

### Weekly Tasks
- [ ] Backup database
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Analyze claim patterns

## Emergency Contacts & Procedures

### Kill Switch
Add to your backend:
```javascript
// Emergency stop
let AIRDROP_ENABLED = true;

// Check in endpoint
if (!AIRDROP_ENABLED) {
    return res.status(503).json({ error: 'Airdrop temporarily disabled' });
}
```

### If Something Goes Wrong
1. **Disable airdrop immediately** (set AIRDROP_ENABLED = false)
2. **Check wallet balance** - ensure funds are safe
3. **Review recent logs** - identify the issue
4. **Fix the problem** - update code/configuration
5. **Test thoroughly** - ensure fix works
6. **Re-enable carefully** - monitor closely

## Cost Estimates

### Infrastructure Costs (Monthly)
- **Backend Hosting**: $5-50 (depending on traffic)
- **Database**: $0-15 (free tier often sufficient)
- **Domain/SSL**: $0 (if using subdomain)
- **Monitoring**: $0-20 (optional)

### Transaction Costs
- **SOL for fees**: ~0.00025 SOL per airdrop
- **For 10,000 airdrops**: ~2.5 SOL

## Next Steps After Launch

1. **Implement Advanced Security** (see AIRDROP_SECURITY_GUIDE.md)
2. **Add Analytics** - Track success metrics
3. **Create Admin Dashboard** - Monitor in real-time
4. **Plan Future Airdrops** - Seasonal campaigns
5. **Community Feedback** - Gather and implement

---

## Quick Commands Reference

```bash
# Check wallet balance
solana balance <airdrop-wallet-address>

# Monitor server logs
heroku logs --tail # or your platform's equivalent

# Quick database query
psql -d jewel_airdrop -c "SELECT COUNT(*) FROM airdrop_claims;"

# Backup database
pg_dump jewel_airdrop > backup_$(date +%Y%m%d).sql
```

---

**Remember**: Start simple, test thoroughly, and scale gradually. You can always add more features after the basic airdrop is working reliably.