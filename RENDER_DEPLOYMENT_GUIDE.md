# 📋 Complete Render.com Deployment Guide

## Before You Start - Prepare Your Files

### 1. Create a copy of your airdrop-backend folder
- Copy the entire `airdrop-backend` folder to your Desktop
- Name it `airdrop-backend-deploy`

### 2. Clean up sensitive files
In the `airdrop-backend-deploy` folder:
- **DELETE** `.env` file (contains your private key)
- **DELETE** `.env.test` file
- **DELETE** `node_modules` folder (if it exists)
- **KEEP** all other files

## Step 1: Create Render Account

1. Open your browser and go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your email
4. Verify your email address
5. Complete the onboarding (you can skip most questions)

## Step 2: Create New Web Service

1. Once logged in, click the **"New +"** button (top right)
2. Select **"Web Service"**
3. You'll see "Connect a repository" - but we won't use GitHub
4. Look for **"Public Git repository"** option at the bottom
5. **IMPORTANT**: Don't use this either - we'll use a different method

## Step 3: Deploy Without GitHub

Since Render's UI might push GitHub, here's the workaround:

1. Go to **https://dashboard.render.com/create/web-service**
2. If it asks for GitHub, click **"Cancel"** or go back
3. Alternative method:
   - Create a free GitHub account at github.com (if you don't have one)
   - Upload your files there (instructions below)
   - OR use the Render CLI method (advanced)

## Step 4: Quick GitHub Upload (Easiest Method)

### 4.1 Create GitHub Account (if needed)
1. Go to **https://github.com**
2. Sign up for free account
3. Verify your email

### 4.2 Upload Your Code
1. Go to **https://github.com/new**
2. Repository name: `jewel-icu-airdrop`
3. Set to **Private**
4. Click **"Create repository"**
5. Click **"uploading an existing file"**
6. Drag your `airdrop-backend-deploy` folder contents (NOT the folder itself)
7. Click **"Commit changes"**

## Step 5: Connect GitHub to Render

1. Go back to **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"**
4. Authorize Render to access your GitHub
5. Select your `jewel-icu-airdrop` repository
6. Click **"Connect"**

## Step 6: Configure Your Service

Fill in these settings:

- **Name**: `jewel-icu-airdrop`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Docker`
- **Build Command**: Leave empty (Docker handles it)
- **Start Command**: Leave empty (Docker handles it)

## Step 7: Add Environment Variables

Scroll down to **"Environment Variables"** and click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 3001 |
| SOLANA_RPC_URL | https://api.mainnet-beta.solana.com |
| TOKEN_MINT_ADDRESS | 37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump |
| JEWEL_TOKEN_MINT | 37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump |
| AIRDROP_AMOUNT | 100 |
| CORS_ORIGIN | https://www.jewel.icu,https://jewel.icu |
| AIRDROP_WALLET_PRIVATE_KEY | WzI0OCw4OSwzNywxMjcsMjM0LDEwNiwxNDYsNTMsMjAsMjksMjAxLDI0Niw5NiwyMjcsMjAxLDYsMTkzLDIzMywyNDEsMTAwLDE3OSw3Miw0NywxNDgsMTc1LDI1NCwzNiwzMSw5MSwyMjMsMTQyLDIxNywxMjMsMjE5LDIyMyw5MSw1LDQzLDIxMiw1NywyNDgsMTUwLDEwNyw5NywxMzQsMTEyLDE4LDU5LDE2NSwxMzAsMzcsMTQ0LDgxLDIxLDEyMSwyMDQsMTE5LDE3NywyNDksMTIxLDExMywyMDksMTQ5LDE5NV0= |
| ADMIN_API_KEY | 24b9ae3687679c45241ae0781a38be56e14432b5c7edc34556b87270e3637ac1 |
| ENCRYPTION_KEY | 6d9e7d0de4794c48eac5a8f3b2c1d9e7f0a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1 |

## Step 8: Select Instance Type

- Choose **"Free"** instance type
- Free tier includes:
  - 750 hours/month
  - 512 MB RAM
  - 0.1 CPU

## Step 9: Deploy

1. Click **"Create Web Service"**
2. Render will start building your Docker image
3. This takes 5-10 minutes
4. You'll see logs showing the build progress

## Step 10: Get Your URL

1. Once deployed, look for **"Your service is live 🎉"**
2. At the top of the page, you'll see your URL
3. It will look like: `https://jewel-icu-airdrop.onrender.com`
4. Copy this URL

## Step 11: Update Your Website

1. Open `index.html` in a text editor
2. Find line 1491:
   ```javascript
   const AIRDROP_API_URL = 'http://localhost:3001'; // Change to your production API URL when deploying
   ```
3. Replace with your Render URL:
   ```javascript
   const AIRDROP_API_URL = 'https://jewel-icu-airdrop.onrender.com'; // Your Render URL
   ```
4. Save the file
5. Upload to www.jewel.icu using FileZilla

## Step 12: Test Your Airdrop

1. Go to **https://www.jewel.icu**
2. Connect your Solflare wallet
3. Click **"Claim Airdrop"**
4. You should receive 100 JEWEL ICU tokens!

## Troubleshooting

### Build Failed
- Check the logs in Render dashboard
- Make sure Dockerfile is in the root directory
- Verify all files were uploaded

### Network Error
- Wait 2-3 minutes after deployment (cold start)
- Check environment variables are correct
- Verify CORS_ORIGIN includes your domain

### Free Tier Sleeping
- First request after 15 minutes will be slow
- This is normal for free tier
- Upgrade to paid for always-on ($7/month)

## Important Notes

- Your private key is now secure on Render's servers
- The backend URL is public but the API is protected
- Free tier is perfect for airdrops
- Monitor usage in Render dashboard

## Success Checklist

- [ ] Render account created
- [ ] Code uploaded to GitHub
- [ ] Web service deployed
- [ ] Environment variables added
- [ ] URL obtained
- [ ] index.html updated
- [ ] Website tested
- [ ] Airdrop working!