# Railway Deployment Troubleshooting Guide

## Current Issue
Your Railway deployment shows the database initializing successfully but then the server appears to stop responding. Since you're on the paid tier, this isn't a sleep issue.

## Diagnosis Steps

### 1. Check Railway Logs
In your Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to the "Logs" tab
4. Look for any error messages after "✅ airdrop_claims table created"

### 2. Common Causes and Solutions

#### Issue 1: Database Pool Connection Error
**Symptom**: Server crashes after database initialization
**Fix Applied**: Modified `database.js` to handle pool creation more safely

#### Issue 2: Port Binding Issue
**Symptom**: Server can't bind to the assigned port
**Fix Applied**: Updated server to explicitly bind to `0.0.0.0` and use Railway's PORT

#### Issue 3: Memory or Resource Limits
**Symptom**: Process killed after startup
**Check**: Look for "OOMKilled" or resource limit messages in logs

### 3. Testing Steps

#### Step 1: Deploy the Debug Version
To isolate the issue, temporarily use the debug Dockerfile:

1. In Railway dashboard, go to your service settings
2. Under "Deploy" settings, change the Dockerfile path to `Dockerfile.debug`
3. This will run a simple server without database initialization

#### Step 2: Test with Simple Server
If the debug version works:
- The issue is in the main server startup sequence
- Proceed to Step 3

If the debug version also fails:
- The issue is with Railway configuration or resources
- Check Railway service logs for specific errors

#### Step 3: Gradual Testing
1. First, test without database:
   - Remove DATABASE_URL from Railway variables temporarily
   - Deploy and test

2. Then add database back:
   - Re-add DATABASE_URL
   - Deploy and test

### 4. Manual Commands to Run in Railway

You can run these commands in Railway's dashboard under the "Command" tab:

```bash
# Test basic connectivity
node -e "console.log('Node is working')"

# Test database connection
node diagnose.js

# Test simple server
node simple-start.js

# Check environment
env | grep -E "(PORT|DATABASE_URL|RAILWAY)"
```

### 5. Alternative Startup Methods

If the issue persists, try these alternative approaches:

#### Option A: Direct Node Start
Change your Railway start command to:
```
node server.js
```

#### Option B: Skip Database Init
Change start command to:
```
node server.js
```
And run database init separately after deployment.

### 6. What We've Fixed

1. **Database Module**: Made pool creation safer with better error handling
2. **Server Startup**: Added better logging and error handling
3. **Port Binding**: Explicitly bind to 0.0.0.0 with Railway's PORT
4. **Health Checks**: Updated to use dynamic PORT

### 7. Next Steps

1. **Commit and Push** all changes:
   ```bash
   git add .
   git commit -m "Fix Railway deployment issues"
   git push
   ```

2. **Monitor Deployment** in Railway dashboard

3. **Check Logs** immediately after deployment

4. **Test Endpoints** using `test-railway-backend.html`

### 8. If Still Not Working

1. **Check Railway Status**: https://railway.app/status
2. **Try Redeploying**: Use Railway's "Redeploy" button
3. **Check Resource Usage**: In Railway dashboard, check if you're hitting any limits
4. **Contact Railway Support**: Since you're on paid tier, you have access to support

### 9. Emergency Fallback

If Railway continues to have issues, you have these alternatives ready:
- Render deployment (see RENDER_DEPLOYMENT_GUIDE.md)
- Local deployment with ngrok/localtunnel
- Other cloud providers (Heroku, DigitalOcean App Platform)

## Expected Behavior

When working correctly, you should see in logs:
```
🚀 Starting Jewel ICU Airdrop Backend...
📊 DATABASE_URL is set, attempting connection...
✅ Database is ready
📋 Initializing database tables...
✅ Database initialization successful
🌐 Starting server on port [PORT]...
🚀 Airdrop server running on port [PORT]
```

And the health endpoint should respond with status 200.