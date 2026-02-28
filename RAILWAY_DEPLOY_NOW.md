# 🚀 Deploy to Railway in 5 Minutes (No GitHub!)

## Step 1: Prepare Your Files
Before uploading to Railway, you need to remove sensitive files:
1. Delete or rename `.env` to `.env.backup`
2. Delete `.env.test`
3. Delete `node_modules` folder (if it exists)

## Step 2: Create Railway Account
1. Go to https://railway.app
2. Sign up with your email
3. Verify your email

## Step 3: Deploy Your Backend
1. Click **"New Project"**
2. Select **"Empty Project"**
3. Click **"Add Service"** → **"Empty Service"**
4. In the service, click **"Settings"** tab
5. Under **"Deploy"**, click **"GitHub Repo"** dropdown
6. Select **"Upload from Computer"**
7. **Drag and drop** your entire `airdrop-backend` folder

## Step 4: Add Environment Variables
Click on **"Variables"** tab and add each of these (copy exactly):

```
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
TOKEN_MINT_ADDRESS=37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump
JEWEL_TOKEN_MINT=37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump
AIRDROP_AMOUNT=100
CORS_ORIGIN=https://www.jewel.icu,https://jewel.icu
AIRDROP_WALLET_PRIVATE_KEY=WzI0OCw4OSwzNywxMjcsMjM0LDEwNiwxNDYsNTMsMjAsMjksMjAxLDI0Niw5NiwyMjcsMjAxLDYsMTkzLDIzMywyNDEsMTAwLDE3OSw3Miw0NywxNDgsMTc1LDI1NCwzNiwzMSw5MSwyMjMsMTQyLDIxNywxMjMsMjE5LDIyMyw5MSw1LDQzLDIxMiw1NywyNDgsMTUwLDEwNyw5NywxMzQsMTEyLDE4LDU5LDE2NSwxMzAsMzcsMTQ0LDgxLDIxLDEyMSwyMDQsMTE5LDE3NywyNDksMTIxLDExMywyMDksMTQ5LDE5NV0=
ADMIN_API_KEY=24b9ae3687679c45241ae0781a38be56e14432b5c7edc34556b87270e3637ac1
ENCRYPTION_KEY=6d9e7d0de4794c48eac5a8f3b2c1d9e7f0a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1
```

## Step 5: Configure Docker
1. In **Settings** tab, scroll to **"Build"**
2. Set **"Builder"** to **"Dockerfile"**
3. Railway will auto-detect your Dockerfile

## Step 6: Deploy
1. Click **"Deploy"** button
2. Wait 5-10 minutes for deployment
3. Once deployed, click on your service
4. Find your URL in the **"Settings"** tab under **"Domains"**
5. It will look like: `https://your-app-name.up.railway.app`

## Step 7: Update Your Website
1. Edit `index.html` line 1491:
   ```javascript
   const AIRDROP_API_URL = 'https://your-app-name.up.railway.app';
   ```
2. Upload to www.jewel.icu

## Alternative: Use Render.com
If Railway doesn't work:
1. Go to https://render.com
2. Sign up
3. New → Web Service
4. Upload files directly (no GitHub)
5. Same environment variables
6. Deploy!

## Need Help?
- Railway free tier: 500 hours/month
- Render free tier: 750 hours/month
- Both provide HTTPS automatically
- Both work without GitHub