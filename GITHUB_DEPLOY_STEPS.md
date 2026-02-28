# GitHub Deployment Steps for Railway

## Yes, Deploy the Backend Directory!

Railway needs your entire project structure, including the `airdrop-backend` directory, to build and deploy your application.

## Option 1: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop** if you don't have it:
   - Go to https://desktop.github.com/
   - Download and install

2. **Add your repository**:
   - Open GitHub Desktop
   - Click "Add" → "Add Existing Repository"
   - Browse to your project folder: `c:/Users/marcu/OneDrive/AI/Claude Dev/Claude Opus 4/Websites/Jewel.icu/jewel.icu v 9`

3. **Commit your changes**:
   - You'll see all the new/modified files listed
   - In the bottom left, add a commit message: "Fix Railway deployment issues"
   - Click "Commit to main"

4. **Push to GitHub**:
   - Click "Push origin" button at the top

## Option 2: Using Git Command Line

If you need to install Git first:
1. Download Git from https://git-scm.com/download/win
2. Install with default settings
3. Restart your terminal/VS Code

Then run these commands:
```bash
# Navigate to your project directory
cd "c:/Users/marcu/OneDrive/AI/Claude Dev/Claude Opus 4/Websites/Jewel.icu/jewel.icu v 9"

# Add all files including airdrop-backend
git add .

# Commit changes
git commit -m "Fix Railway deployment issues"

# Push to GitHub
git push origin main
```

## Option 3: Manual Upload via GitHub Web

1. Go to your repository on GitHub.com
2. Click "Add file" → "Upload files"
3. Drag and drop your entire `airdrop-backend` folder
4. Add commit message: "Fix Railway deployment issues"
5. Click "Commit changes"

## Important Files to Include

Make sure these are all pushed to GitHub:
- `/airdrop-backend/` (entire directory)
  - `server.js`
  - `database.js`
  - `package.json`
  - `Dockerfile`
  - `start.sh`
  - All other files in this directory
- `/test-railway-backend.html`
- `/RAILWAY_TROUBLESHOOTING.md`

## After Pushing to GitHub

1. **Railway will automatically detect the changes** and start a new deployment
2. **Monitor the deployment** in your Railway dashboard
3. **Check the logs** for any errors
4. **Test your endpoints** using the test-railway-backend.html file

## Verify Your Repository Structure

Your GitHub repository should have this structure:
```
your-repo/
├── airdrop-backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   ├── Dockerfile
│   ├── start.sh
│   ├── init-db.js
│   ├── diagnose.js
│   ├── simple-start.js
│   └── ... (other backend files)
├── index.html
├── test-railway-backend.html
├── README.md
└── ... (other project files)
```

## Railway Configuration

Make sure your Railway service is configured to:
1. **Root Directory**: `/` (not `/airdrop-backend`)
2. **Dockerfile Path**: `airdrop-backend/Dockerfile`
3. **Watch Paths**: Leave empty to watch all files

This way Railway will find your Dockerfile in the airdrop-backend directory and build from there.