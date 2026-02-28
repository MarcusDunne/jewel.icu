# Jewel ICU Airdrop - Deployment Guide

This guide walks you through deploying your airdrop system to production.

## Pre-Deployment Checklist

### 1. Airdrop Wallet Setup ✅
```bash
# Generate wallet (if not done already)
cd airdrop-backend
solana-keygen new --no-bip39-passphrase --outfile airdrop-wallet.json

# Get wallet address
solana address -k airdrop-wallet.json

# Convert to base64 for .env file
base64 < airdrop-wallet.json | tr -d '\n'
```

### 2. Fund Your Wallet 💰
Calculate required tokens:
- Expected claims: 10,000
- Tokens per claim: 1
- Buffer for fees: 10%
- **Total needed: 11,000 JEWEL ICU tokens**

### 3. Environment Configuration 🔧
Create production `.env` file:
```env
# Required
NODE_ENV=production
PORT=3001
DATABASE_URL=your_production_database_url
AIRDROP_PRIVATE_KEY=your_base64_private_key
ADMIN_API_KEY=generate_strong_key_here
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Security (Highly Recommended)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
RECAPTCHA_THRESHOLD=0.5
EXPECTED_HOSTNAME=jewel.icu

# Optional
ENCRYPTION_KEY=generate_with_openssl_rand_hex_32
SLACK_WEBHOOK_URL=your_slack_webhook
```

## Deployment Options

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Create Heroku App**
```bash
cd airdrop-backend
heroku create jewel-icu-airdrop
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set AIRDROP_PRIVATE_KEY="your_base64_key"
heroku config:set ADMIN_API_KEY="your_admin_key"
heroku config:set RECAPTCHA_SECRET_KEY="your_recaptcha_key"
# Set all other variables from .env
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy airdrop backend"
git push heroku main
```

5. **Verify**
```bash
heroku logs --tail
heroku open
```

### Option 2: DigitalOcean App Platform

1. **Create App**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Connect GitHub repository
   - Select `airdrop-backend` directory

2. **Configure App**
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: 3001

3. **Add Database**
   - Click "Add Resource"
   - Select "Database"
   - Choose PostgreSQL

4. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 3: AWS EC2

1. **Launch EC2 Instance**
```bash
# Use Amazon Linux 2 or Ubuntu 20.04
# Instance type: t3.small (minimum)
# Security group: Allow ports 22, 80, 443, 3001
```

2. **Connect and Setup**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Install PostgreSQL
sudo amazon-linux-extras install postgresql14 -y

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo yum install nginx -y
```

3. **Deploy Code**
```bash
# Clone repository
git clone https://github.com/your-repo/jewel-icu.git
cd jewel-icu/airdrop-backend

# Install dependencies
npm install

# Copy .env file
nano .env  # Paste your production config

# Start with PM2
pm2 start server.js --name jewel-airdrop
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name api.jewel.icu;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL with Let's Encrypt**
```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.jewel.icu
```

### Option 4: Docker Deployment

1. **Build Image**
```bash
cd airdrop-backend
docker build -t jewel-airdrop:latest .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

3. **Deploy to Cloud**
```bash
# Tag for registry
docker tag jewel-airdrop:latest your-registry/jewel-airdrop:latest

# Push to registry
docker push your-registry/jewel-airdrop:latest

# Deploy on server
docker pull your-registry/jewel-airdrop:latest
docker run -d \
  --name jewel-airdrop \
  -p 3001:3001 \
  --env-file .env \
  your-registry/jewel-airdrop:latest
```

## Post-Deployment Steps

### 1. Update Frontend

Edit your `index.html`:
```javascript
// Update API URL
const AIRDROP_API_URL = 'https://api.jewel.icu'; // Your actual API URL

// Update reCAPTCHA site key
const RECAPTCHA_SITE_KEY = 'your_actual_site_key';
```

### 2. DNS Configuration

Add DNS records:
```
Type: A
Name: api
Value: your-server-ip

# Or for Heroku/platforms:
Type: CNAME
Name: api
Value: your-app.herokuapp.com
```

### 3. Test Production

```bash
# Run test suite against production
cd airdrop-backend
TEST_API_URL=https://api.jewel.icu node test-airdrop.js

# Check health
curl https://api.jewel.icu/api/health

# Monitor logs
heroku logs --tail  # or your platform's equivalent
```

### 4. Enable Monitoring

1. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Monitor: https://api.jewel.icu/api/health
   - Alert on downtime

2. **Error Tracking**
   - Add Sentry or Rollbar
   - Track JavaScript errors
   - Monitor API errors

3. **Analytics**
   - Track claim success rate
   - Monitor wallet balance
   - Watch for suspicious patterns

## Security Hardening

### 1. Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Fail2ban Setup
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
```

### 3. Regular Updates
```bash
# Set up automatic security updates
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## Maintenance Tasks

### Daily
- [ ] Check wallet balance
- [ ] Review error logs
- [ ] Monitor claim rate

### Weekly
- [ ] Backup database
- [ ] Review security logs
- [ ] Check for suspicious activity

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Performance optimization

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend is running
   - Verify port configuration
   - Check Nginx/proxy settings

2. **Database Connection Failed**
   - Verify DATABASE_URL
   - Check firewall rules
   - Ensure PostgreSQL is running

3. **Wallet Balance Low**
   - Check wallet address
   - Verify token balance
   - Top up if needed

4. **High Error Rate**
   - Check logs for patterns
   - Verify RPC endpoint
   - Monitor Solana network status

### Emergency Procedures

1. **Disable Airdrop**
```bash
# Via API
curl -X POST https://api.jewel.icu/api/admin/airdrop/toggle \
  -H "X-API-Key: your_admin_key"

# Or set environment variable
heroku config:set AIRDROP_ENABLED=false
```

2. **Backup Wallet**
```bash
# Export private key
cat airdrop-wallet.json | base64 > wallet-backup.txt

# Transfer remaining funds if compromised
solana transfer --from airdrop-wallet.json RECIPIENT_ADDRESS ALL
```

## Launch Checklist

### Pre-Launch (1 day before)
- [ ] All tests passing
- [ ] Wallet funded
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Team briefed

### Launch Day
- [ ] Enable airdrop
- [ ] Announce on social media
- [ ] Monitor first 10 claims closely
- [ ] Check error rates
- [ ] Verify transactions on Solscan

### Post-Launch (First 24 hours)
- [ ] Monitor claim rate
- [ ] Check wallet balance
- [ ] Review any errors
- [ ] Respond to user issues
- [ ] Celebrate success! 🎉

## Support Resources

- **Solana Status**: https://status.solana.com
- **Heroku Status**: https://status.heroku.com
- **Your Monitoring**: [Add your monitoring dashboard URL]
- **Team Contact**: [Add emergency contact]

---

Good luck with your airdrop launch! 🚀