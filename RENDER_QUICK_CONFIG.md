# Render Quick Configuration Guide

## Your Generated Values

Here are all the values you need to configure Render. Copy and paste these exactly as shown.

### 1. Admin API Key (Generated)
```
ADMIN_API_KEY=90865ae47a14787853bbf8f63d53bc7edd849b3333b54d106746e09d1853929a
```

### 2. Environment Variables for Render

Copy this entire block into Render's environment variables:

```
DATABASE_URL=[Will be auto-filled by Render after creating PostgreSQL]
PORT=3001
NODE_ENV=production
ADMIN_API_KEY=90865ae47a14787853bbf8f63d53bc7edd849b3333b54d106746e09d1853929a
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### 3. Values You Need to Provide

You'll need to add these yourself in Render:

```
AIRDROP_PRIVATE_KEY=[Your wallet's base64 encoded private key]
TOKEN_MINT_ADDRESS=[Your SPL token mint address]
AIRDROP_AMOUNT=[Amount in smallest units, e.g., 1000000000]
RECAPTCHA_SECRET_KEY=[From Google reCAPTCHA v3]
ALLOWED_ORIGINS=[Your frontend URL, e.g., https://jewel.icu]
```

## Step-by-Step Instructions

### Step 1: Convert Your Private Key to Base64

Since you have a wallet, you need to convert your private key to base64 format.

If you have your private key as:
- **Array format** (e.g., [1,2,3,4...]): Use the `convert-key.js` script
- **Base58 string**: Use the `convert-base58-key.js` script

### Step 2: Get Google reCAPTCHA Keys

1. Go to: https://www.google.com/recaptcha/admin
2. Create new site:
   - Label: `Jewel ICU Airdrop`
   - Type: `reCAPTCHA v3`
   - Domains: Add your domain(s)
3. Copy the SECRET KEY

### Step 3: Create Services in Render

1. **Create PostgreSQL Database First**:
   - Name: `jewel-icu-airdrop-db`
   - Region: Oregon (US West)
   - Plan: Free

2. **Create Web Service**:
   - Repository: Your GitHub repo
   - Name: `jewel-icu-airdrop-api`
   - Root Directory: `airdrop-backend` ⚠️ IMPORTANT
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

### Step 4: Add All Environment Variables

In the Web Service settings, add all the environment variables from sections 2 and 3 above.

### Step 5: Deploy and Test

After deployment, test your endpoints:

```bash
# Health check
curl https://jewel-icu-airdrop-api.onrender.com/health

# Stats (with your admin key)
curl https://jewel-icu-airdrop-api.onrender.com/api/airdrop/stats \
  -H "X-Admin-Key: 90865ae47a14787853bbf8f63d53bc7edd849b3333b54d106746e09d1853929a"
```

## Important Notes

1. **Save your admin API key**: `90865ae47a14787853bbf8f63d53bc7edd849b3333b54d106746e09d1853929a`
2. **Root Directory**: Must be set to `airdrop-backend`
3. **Free Tier**: Service sleeps after 15 minutes of inactivity
4. **First Request**: May take ~30 seconds after sleep

## Need Help?

- Check logs in Render dashboard
- Ensure all environment variables are set
- Verify database connection (use Internal URL)
- Make sure your wallet has enough SOL for fees
- Ensure your wallet has the tokens to distribute