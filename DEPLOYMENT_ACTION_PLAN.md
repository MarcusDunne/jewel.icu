# 🚀 Deployment Action Plan for Jewel ICU Airdrop

## Current Status
- ✅ Backend is running locally with Docker
- ✅ Airdrop wallet has 12,000 JEWEL ICU tokens
- ❌ Website can't connect due to HTTPS/HTTP mismatch
- 🎯 Need to deploy backend to cloud for production

## Step 1: Upload to GitHub (10 minutes)

### Option A: GitHub Web Upload (Easiest)
1. Go to https://github.com/new
2. Create repository named `jewel-icu-airdrop`
3. Make it PRIVATE
4. Click "uploading an existing file"
5. Drag ALL files from `airdrop-backend` folder EXCEPT:
   - `.env` file (contains private key)
   - `.env.test` file
   - `node_modules` folder
6. Commit changes

### Option B: GitHub Desktop
1. Download from https://desktop.github.com/
2. Create new repository from `airdrop-backend` folder
3. Publish to GitHub as private repo

## Step 2: Deploy to Render (15 minutes)

1. **Sign up** at https://render.com
2. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub account
   - Select `jewel-icu-airdrop` repository
   
3. **Configure Service**:
   - Name: `jewel-icu-airdrop`
   - Environment: `Docker`
   - Branch: `main`
   - Instance Type: `Free`

4. **Add Environment Variables** (copy each line exactly):
```
NODE_ENV = production
PORT = 3001
SOLANA_RPC_URL = https://api.mainnet-beta.solana.com
TOKEN_MINT_ADDRESS = 37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump
JEWEL_TOKEN_MINT = 37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump
AIRDROP_AMOUNT = 100
CORS_ORIGIN = https://www.jewel.icu,https://jewel.icu
AIRDROP_WALLET_PRIVATE_KEY = WzI0OCw4OSwzNywxMjcsMjM0LDEwNiwxNDYsNTMsMjAsMjksMjAxLDI0Niw5NiwyMjcsMjAxLDYsMTkzLDIzMywyNDEsMTAwLDE3OSw3Miw0NywxNDgsMTc1LDI1NCwzNiwzMSw5MSwyMjMsMTQyLDIxNywxMjMsMjE5LDIyMyw5MSw1LDQzLDIxMiw1NywyNDgsMTUwLDEwNyw5NywxMzQsMTEyLDE4LDU5LDE2NSwxMzAsMzcsMTQ0LDgxLDIxLDEyMSwyMDQsMTE5LDE3NywyNDksMTIxLDExMywyMDksMTQ5LDE5NV0=
ADMIN_API_KEY = 24b9ae3687679c45241ae0781a38be56e14432b5c7edc34556b87270e3637ac1
ENCRYPTION_KEY = 6d9e7d0de4794c48eac5a8f3b2c1d9e7f0a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1
```

5. **Create Web Service** and wait for deployment

## Step 3: Update Your Website (5 minutes)

1. **Get your Render URL** (will be like: `https://jewel-icu-airdrop.onrender.com`)

2. **Edit index.html**:
   - Open in any text editor
   - Find line 1491
   - Change from:
     ```javascript
     const AIRDROP_API_URL = 'http://localhost:3001';
     ```
   - To your Render URL:
     ```javascript
     const AIRDROP_API_URL = 'https://jewel-icu-airdrop.onrender.com';
     ```

3. **Upload to website**:
   - Use FileZilla to upload updated index.html to www.jewel.icu

## Step 4: Test (2 minutes)

1. Visit https://www.jewel.icu
2. Connect Solflare wallet
3. Click "Claim Airdrop"
4. Verify you receive 100 JEWEL ICU tokens

## Troubleshooting

### "Network Error" still appears:
- Check Render deployment logs
- Verify all environment variables are set
- Make sure you're using HTTPS in the URL

### "SPL Token undefined":
- Clear browser cache (Ctrl+F5)
- Check browser console for errors

### Deployment fails on Render:
- Check you added ALL environment variables
- Verify Docker environment is selected
- Check build logs for errors

## Important Notes

- Render free tier sleeps after 15 minutes
- First request after sleep will be slow
- For production, consider upgrading ($7/month)
- Your wallet address: 9LVbz3KCR7rKeDAnYgrTRVgBud2b7RYaVFg8pUmvjU6v

## Need Help?

All your deployment files are ready:
- `MANUAL_DEPLOYMENT_STEPS.md` - Detailed instructions
- `RENDER_DEPLOYMENT_CHECKLIST.md` - Environment variables ready to copy
- `render.yaml` - Automated deployment config