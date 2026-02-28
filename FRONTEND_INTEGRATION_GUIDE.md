# Frontend Integration Guide - Adding Airdrop to Your Website

## Overview
You should update your existing `index.html` file by adding the airdrop functionality from `index-updated.html`. Do NOT replace your entire index.html file.

## Step-by-Step Integration

### 1. Update Configuration Variables
Add these at the top of your JavaScript section in `index.html`:

```javascript
// Production Airdrop Configuration
const AIRDROP_API_URL = 'http://localhost:3001'; // Change to your production API URL
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY'; // Add your actual reCAPTCHA key
```

### 2. Add reCAPTCHA Script (in <head>)
```html
<!-- Google reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
```

### 3. Replace the JewelAirdrop Class
Find your existing `JewelAirdrop` class in `index.html` (around line 1461) and replace it with the updated version from `index-updated.html` (lines 57-295).

The new version includes:
- Production API calls
- CAPTCHA integration
- Better error handling
- Transaction status display

### 4. Key Changes in the New Code

**Old (Demo) Code:**
```javascript
// Simulate success for demo
setTimeout(() => {
    walletConnection.showToast('🎉 Airdrop successful! You would receive 1 JEWEL ICU token.', 'success');
    this.setButtonLoading(false);
    this.isProcessing = false;
}, 2000);
```

**New (Production) Code:**
```javascript
// Call production API
const response = await fetch(`${AIRDROP_API_URL}/api/airdrop/claim`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        walletAddress: walletConnection.provider.publicKey.toString(),
        captchaToken: captchaToken,
        signature: signature
    })
});
```

### 5. Production URLs to Update

Before deploying, change these values:

```javascript
// Local/Development
const AIRDROP_API_URL = 'http://localhost:3001';

// Production (examples)
const AIRDROP_API_URL = 'https://api.jewel.icu';  // If using subdomain
// OR
const AIRDROP_API_URL = 'https://jewel.icu:3001'; // If using port
// OR
const AIRDROP_API_URL = 'https://your-backend-url.herokuapp.com'; // If using Heroku
```

### 6. Testing Before Production

1. Test locally first:
   - Keep `AIRDROP_API_URL = 'http://localhost:3001'`
   - Make sure Docker is running
   - Test the airdrop flow

2. Test with production backend:
   - Update `AIRDROP_API_URL` to your deployed backend
   - Test from your local frontend
   - Verify transactions work

3. Deploy to production:
   - Update all URLs
   - Add reCAPTCHA keys
   - Deploy your updated `index.html`

## Important Notes

⚠️ **Do NOT**:
- Replace your entire index.html with index-updated.html
- Forget to update the API URL
- Deploy without testing

✅ **Do**:
- Keep your existing website structure
- Only update the airdrop-related code
- Test thoroughly before going live
- Set up reCAPTCHA for production

## Quick Checklist

- [ ] Updated AIRDROP_API_URL to production backend
- [ ] Added reCAPTCHA site key
- [ ] Replaced JewelAirdrop class with new version
- [ ] Tested locally with Docker backend
- [ ] Tested with production backend
- [ ] Verified wallet has sufficient tokens
- [ ] Deployed updated index.html

Your website at jewel.icu will then have a fully functional airdrop system!