# Update Your index.html

Once you have deployed to Render and received your URL (e.g., `https://jewel-icu-airdrop.onrender.com`), you need to update your index.html file.

## Find and Replace

In your index.html, find this line (around line 1491):
```javascript
const AIRDROP_API_URL = 'http://localhost:3001'; // Change to your production API URL when deploying
```

Replace it with your Render URL:
```javascript
const AIRDROP_API_URL = 'https://jewel-icu-airdrop.onrender.com'; // Your actual Render URL
```

## Important Notes

1. Make sure to use HTTPS (not HTTP)
2. Don't include a trailing slash
3. The URL will be something like: `https://[your-app-name].onrender.com`

## After Updating

1. Save the index.html file
2. Upload it to www.jewel.icu via FileZilla
3. Clear your browser cache
4. Test the airdrop functionality

## Quick Test

1. Visit https://www.jewel.icu
2. Connect your Solflare wallet
3. Click "Claim Airdrop"
4. You should see a success message and transaction link

If you see any errors, check:
- Browser console (F12) for JavaScript errors
- Network tab to see if API calls are reaching your backend
- Render dashboard logs for backend errors