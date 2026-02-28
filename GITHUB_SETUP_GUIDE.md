# GitHub Repository Setup Guide for Jewel ICU Airdrop

Follow these steps to set up your GitHub repository with all the configurations we've created.

## Step 1: Create the Repository

1. Go to https://github.com/new
2. Fill in the following:
   - **Repository name:** `jewel-icu-airdrop`
   - **Description:** `A production-ready Solana token airdrop system with secure backend API, token locking functionality, and web interface for the Jewel ICU token ecosystem.`
   - **Public/Private:** Choose based on your preference
   - **Initialize with:** Leave unchecked (we'll push existing code)

3. Click "Create repository"

## Step 2: Initial Setup Commands

Run these commands in your project directory:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Solana airdrop system with backend API and frontend"

# Add your GitHub repository as origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jewel-icu-airdrop.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Add Repository Topics

1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add these topics (comma-separated):
   ```
   solana, airdrop, spl-token, web3, cryptocurrency, token-distribution, nodejs, express, postgresql, docker, token-lock, defi
   ```
4. Click "Save changes"

## Step 4: Configure Repository Secrets

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets by clicking "New repository secret":

### For Render Deployment (if using Render):
- **Name:** `RENDER_API_KEY`
  - Get from: https://dashboard.render.com/account/api-keys
  - Click "Create API Key" and copy the value

- **Name:** `RENDER_SERVICE_ID`
  - Get from: Your Render service URL (e.g., if URL is https://xxx.onrender.com, the ID is srv-xxx)
  - Or find in Render dashboard under service settings

- **Name:** `RENDER_SERVICE_URL`
  - Value: Your full Render service URL (e.g., https://your-service.onrender.com)

### For Docker Hub (optional):
- **Name:** `DOCKER_USERNAME`
  - Value: Your Docker Hub username

- **Name:** `DOCKER_PASSWORD`
  - Value: Your Docker Hub password or access token

## Step 5: Update Dependabot Configuration

Since I need your GitHub username, you'll need to update the dependabot.yml file:

1. Edit `.github/dependabot.yml`
2. Find and replace all instances of `@your-github-username` with your actual GitHub username (e.g., `@johndoe`)
3. Commit and push the change:
   ```bash
   git add .github/dependabot.yml
   git commit -m "chore: update dependabot configuration with GitHub username"
   git push
   ```

## Step 6: Enable GitHub Actions

1. Go to the Actions tab in your repository
2. If prompted, click "I understand my workflows, go ahead and enable them"

## Step 7: Configure Branch Protection (Recommended)

1. Go to Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Check these options:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select these status checks:
     - `Test Backend`
     - `Security Scan`
     - `Validate Frontend`
5. Click "Create"

## Step 8: Create a README.md

Create a comprehensive README for your repository:

```bash
# Create README from the existing documentation
cat > README.md << 'EOF'
# Jewel ICU Airdrop System

A production-ready Solana token airdrop system with secure backend API, token locking functionality, and web interface.

## Features

- 🚀 One-click token claiming
- 🔒 Anti-bot protection with reCAPTCHA
- 📊 Admin dashboard with statistics
- 🔐 Token locking smart contract
- 🐳 Docker support
- 📱 Responsive web interface

## Quick Start

See [airdrop-backend/QUICK_START.md](airdrop-backend/QUICK_START.md) for detailed setup instructions.

## Documentation

- [Deployment Guide](AIRDROP_DEPLOYMENT_GUIDE.md)
- [Security Guide](AIRDROP_SECURITY_GUIDE.md)
- [Production Checklist](AIRDROP_PRODUCTION_CHECKLIST.md)
- [Frontend Integration](FRONTEND_INTEGRATION_GUIDE.md)

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript
- **Blockchain:** Solana Web3.js, SPL Token
- **Smart Contract:** Rust, Anchor Framework

## Deployment

The project supports multiple deployment platforms:
- [Render](RENDER_DEPLOYMENT_GUIDE.md) (Recommended)
- Railway
- Heroku
- Docker/VPS

## License

MIT License
EOF

git add README.md
git commit -m "docs: add comprehensive README"
git push
```

## Step 9: Test Your Setup

1. Make a small change to test CI:
   ```bash
   echo "# Test CI" >> test.md
   git add test.md
   git commit -m "test: verify CI workflow"
   git push
   ```

2. Go to the Actions tab to see your workflows running

3. Once verified, remove the test file:
   ```bash
   git rm test.md
   git commit -m "chore: remove test file"
   git push
   ```

## Step 10: First Release (Optional)

Create your first release:

1. Go to Releases → Create a new release
2. Tag version: `v1.0.0`
3. Release title: `Initial Release`
4. Describe the features
5. Click "Publish release"

This will trigger the Docker build workflow to create tagged images.

## Troubleshooting

### Push Permission Denied
If you get permission denied when pushing:
```bash
# Use personal access token
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/jewel-icu-airdrop.git
```

### Workflows Not Running
- Check if Actions are enabled in repository settings
- Verify file paths are correct (.github/workflows/)
- Check workflow syntax in Actions tab

### Secrets Not Working
- Ensure secret names match exactly (case-sensitive)
- Verify secrets are added to the correct repository
- Check if using organization secrets (may need different permissions)

## Next Steps

1. **Monitor Dependabot**: Check Pull Requests tab weekly for dependency updates
2. **Review Security**: Check Security tab for vulnerability alerts
3. **Setup Notifications**: Configure email/Slack notifications for workflow failures
4. **Add Badges**: Add status badges to your README:
   ```markdown
   ![CI](https://github.com/YOUR_USERNAME/jewel-icu-airdrop/workflows/CI%20-%20Test%20and%20Lint/badge.svg)
   ![Docker](https://github.com/YOUR_USERNAME/jewel-icu-airdrop/workflows/Docker%20Build%20and%20Push/badge.svg)
   ```

Remember to replace `YOUR_USERNAME` with your actual GitHub username throughout this guide!