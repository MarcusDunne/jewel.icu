# Manual Deployment Steps

Since Git is not installed on your system, here are the manual steps to deploy your airdrop backend:

## Option 1: Use GitHub Desktop (Easiest)

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Create new repository**:
   - Click "File" → "New Repository"
   - Name: `jewel-icu-airdrop`
   - Local Path: Select your `airdrop-backend` folder
   - Click "Create Repository"
4. **Publish to GitHub**:
   - Click "Publish repository" button
   - Make it private
   - Click "Publish"

## Option 2: Upload via GitHub Web

1. **Go to GitHub**: https://github.com/new
2. **Create new repository**:
   - Name: `jewel-icu-airdrop`
   - Private repository
   - Don't initialize with README
3. **Upload files**:
   - Click "uploading an existing file"
   - Drag all files from `airdrop-backend` folder
   - EXCEPT: `.env`, `.env.test`, `node_modules` folder
   - Commit changes

## Deploy to Render

1. **Go to Render**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect GitHub** and authorize
4. **Select your repository**: `jewel-icu-airdrop`
5. **Configure**:
   - Name: `jewel-icu-airdrop`
   - Environment: `Docker`
   - Branch: `main`
   - Instance Type: `Free`

6. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

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

7. **Click "Create Web Service"**
8. **Wait for deployment** (5-10 minutes)
9. **Copy your URL** (e.g., `https://jewel-icu-airdrop.onrender.com`)

## Update Your Website

1. **Open** `index.html` in a text editor
2. **Find line 1491**:
   ```javascript
   const AIRDROP_API_URL = 'http://localhost:3001';
   ```
3. **Replace with your Render URL**:
   ```javascript
   const AIRDROP_API_URL = 'https://jewel-icu-airdrop.onrender.com';
   ```
4. **Save the file**
5. **Upload to www.jewel.icu** via FileZilla

## Test Your Airdrop

1. Visit https://www.jewel.icu
2. Connect Solflare wallet
3. Click "Claim Airdrop"
4. Should receive 100 JEWEL ICU tokens!

## Troubleshooting

- If deployment fails, check Render logs
- Make sure ALL environment variables are added
- The free tier may sleep - first request will be slow
- Check browser console (F12) for errors