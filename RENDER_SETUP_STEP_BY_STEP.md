# Render Setup Guide - Step by Step

This guide will walk you through deploying your Solana Airdrop backend to Render.

## Prerequisites
- GitHub repository with your airdrop backend code
- Render account (free tier works)
- Your Solana wallet private key (base64 encoded)
- Google reCAPTCHA v3 keys

## Step 1: Create a Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## Step 2: Create a PostgreSQL Database

1. From Render Dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure your database:
   - **Name**: `jewel-icu-airdrop-db`
   - **Database**: Leave as generated name
   - **User**: Leave as generated name
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15
   - **Plan**: Free (or Starter for production)
4. Click "Create Database"
5. Wait for database to be created (takes 1-2 minutes)
6. Once created, copy the "Internal Database URL" - you'll need this

## Step 3: Create the Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub account if not already connected
3. Select your repository: `jewel-icu-airdrop`
4. Configure the service:

### Basic Settings:
- **Name**: `jewel-icu-airdrop-api`
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: `airdrop-backend` (IMPORTANT!)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Instance Type:
- **Plan**: Free (or Starter for production)

## Step 4: Configure Environment Variables

Click "Advanced" and add these environment variables:

```bash
# Database (use the Internal Database URL from Step 2)
DATABASE_URL=postgresql://user:password@host/database

# Solana Configuration
AIRDROP_PRIVATE_KEY=your_base64_encoded_private_key
TOKEN_MINT_ADDRESS=your_token_mint_address
AIRDROP_AMOUNT=1000000000

# Security
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret_key
ADMIN_API_KEY=generate_a_secure_random_string

# Server Configuration
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### How to get these values:

1. **DATABASE_URL**: Copy from your PostgreSQL dashboard (Internal Database URL)

2. **AIRDROP_PRIVATE_KEY**: 
   - If you have a wallet.json file:
     ```bash
     cd airdrop-backend
     node convert-key.js
     ```
   - Copy the base64 output

3. **TOKEN_MINT_ADDRESS**: Your SPL token's mint address

4. **RECAPTCHA_SECRET_KEY**: 
   - Go to https://www.google.com/recaptcha/admin
   - Create a new site with reCAPTCHA v3
   - Copy the secret key

5. **ADMIN_API_KEY**: Generate a secure key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **ALLOWED_ORIGINS**: Your frontend domain (where index.html is hosted)

## Step 5: Deploy the Service

1. After adding all environment variables, click "Create Web Service"
2. Render will start building and deploying your service
3. This takes 3-5 minutes for the first deployment
4. Watch the logs for any errors

## Step 6: Verify Deployment

Once deployed, you'll get a URL like: `https://jewel-icu-airdrop-api.onrender.com`

Test the deployment:

1. **Health Check**:
   ```bash
   curl https://jewel-icu-airdrop-api.onrender.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Stats Endpoint** (with your admin key):
   ```bash
   curl https://jewel-icu-airdrop-api.onrender.com/api/airdrop/stats \
     -H "X-Admin-Key: your_admin_api_key"
   ```

## Step 7: Update Your Frontend

Update your frontend files to use the Render API URL:

1. In `index.html`, `index-updated.html`, etc., find:
   ```javascript
   const API_URL = 'http://localhost:3001';
   ```

2. Replace with:
   ```javascript
   const API_URL = 'https://jewel-icu-airdrop-api.onrender.com';
   ```

3. Commit and push these changes to GitHub

## Step 8: Set Up Auto-Deploy (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Build & Deploy"
3. Enable "Auto-Deploy" for the main branch
4. Now every push to GitHub will automatically deploy

## Step 9: Configure Custom Domain (Optional)

1. In your service dashboard, click "Settings"
2. Under "Custom Domains", click "Add Custom Domain"
3. Enter your domain: `api.yourdomain.com`
4. Add the provided CNAME record to your DNS
5. Wait for SSL certificate (automatic)

## Step 10: Monitor Your Service

1. **Logs**: Check "Logs" tab for real-time logs
2. **Metrics**: View CPU, Memory usage in "Metrics" tab
3. **Events**: See deployment history in "Events" tab

## Troubleshooting

### Service Won't Start
- Check logs for errors
- Verify all environment variables are set
- Ensure `airdrop-backend` is set as root directory

### Database Connection Failed
- Verify DATABASE_URL is the Internal URL (not External)
- Check if database is active
- Ensure service and database are in same region

### CORS Errors
- Update ALLOWED_ORIGINS to include your frontend domain
- Include protocol (https://)

### Rate Limiting Issues
- Adjust RATE_LIMIT_MAX_REQUESTS if needed
- Default is 10 requests per 15 minutes

## Production Checklist

Before going live:

- [ ] Upgrade to paid plan for better performance
- [ ] Enable health checks in Render settings
- [ ] Set up monitoring/alerts
- [ ] Test with small amount first
- [ ] Have backup wallet ready
- [ ] Document admin API key securely

## Getting Your Service Details for GitHub Actions

For the GitHub Actions deployment workflow, you'll need:

1. **API Key**:
   - Go to Account Settings → API Keys
   - Create new API key
   - Save as `RENDER_API_KEY` in GitHub secrets

2. **Service ID**:
   - In your service dashboard URL: `https://dashboard.render.com/web/srv-xxxxx`
   - The `srv-xxxxx` part is your service ID
   - Save as `RENDER_SERVICE_ID` in GitHub secrets

3. **Service URL**:
   - Your public URL: `https://jewel-icu-airdrop-api.onrender.com`
   - Save as `RENDER_SERVICE_URL` in GitHub secrets

## Next Steps

1. Test the airdrop with a small amount
2. Monitor logs during first real use
3. Set up alerts for errors
4. Consider implementing additional features:
   - Webhook notifications
   - Advanced analytics
   - Multi-token support

Congratulations! Your airdrop backend is now live on Render! 🎉