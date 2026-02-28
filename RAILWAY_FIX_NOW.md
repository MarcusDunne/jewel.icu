# Railway Deployment Fix - Action Plan

## Quick Fix Steps

### Step 1: Update Railway Settings

1. Go to your Railway dashboard
2. Click on your service
3. Go to "Settings" tab
4. Under "Deploy" section, update:
   - **Dockerfile Path**: `airdrop-backend/Dockerfile.railway`
   - **Root Directory**: `/` (leave empty)
   - **Start Command**: Remove any custom start command

### Step 2: Push Changes to GitHub

Push all the new files we created:

**Option A: Using GitHub Desktop**
1. Open GitHub Desktop
2. You should see all the new files
3. Commit message: "Fix Railway deployment with minimal server"
4. Push to GitHub

**Option B: Manual Upload**
1. Go to your GitHub repository
2. Upload these key files:
   - `airdrop-backend/server-minimal.js`
   - `airdrop-backend/Dockerfile.railway`
   - `airdrop-backend/railway.json`

### Step 3: Force Redeploy

After pushing:
1. Go to Railway dashboard
2. Click "Redeploy" button
3. Watch the logs carefully

### Step 4: What to Look For

In the Railway logs, you should see:
```
Starting minimal server...
PORT: [some number]
✅ Minimal server running on port [number]
🌐 Server is ready to accept connections
```

### Step 5: Test the Deployment

Once deployed, test with:
```
https://jewel-icu-airdrop-production-561b.up.railway.app
```

You should see JSON:
```json
{
  "message": "Jewel ICU Airdrop API - Minimal",
  "status": "running",
  "timestamp": "...",
  "environment": "production",
  "port": "..."
}
```

## If This Works

Once the minimal server is running:

1. **Switch back to full server**:
   - Change Dockerfile path back to `airdrop-backend/Dockerfile`
   - Redeploy

2. **Or gradually add features**:
   - Start with the minimal server
   - Add database connection
   - Add airdrop functionality

## If This Doesn't Work

### Check These Common Issues:

1. **Port Binding**
   - Railway assigns a dynamic PORT
   - Our minimal server uses `process.env.PORT`

2. **Build Errors**
   - Check "Build Logs" in Railway
   - Look for npm install failures

3. **Memory Limits**
   - Check if process is being killed
   - Look for "OOMKilled" in logs

### Alternative: Use Render Instead

If Railway continues to fail:
1. Create account at render.com
2. Follow `RENDER_DEPLOYMENT_GUIDE.md`
3. Render is more stable for Node.js apps

## Debug Commands

Run these in Railway's shell (if available):
```bash
# Check if server file exists
ls -la airdrop-backend/

# Test minimal server locally
node airdrop-backend/server-minimal.js

# Check environment
env | grep -E "(PORT|RAILWAY)"
```

## The Minimal Server Advantages

- No database connection (eliminates that failure point)
- Simple Express server (proven to work)
- Clear console logging
- Proper port binding for Railway
- CORS enabled for all origins

This should get your Railway deployment working!