# Jewel ICU Airdrop Feature

## Overview
This feature implements an airdrop functionality that allows connected wallets to claim 1 JEWEL ICU token with a single click.

## Features
- **Wallet Integration**: Airdrop button only appears when a wallet is connected
- **One-Click Claim**: Simple click to claim 1 JEWEL ICU token
- **Visual Feedback**: Loading states and toast notifications
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Works on desktop and mobile devices

## Implementation Details

### Token Information
- **Token Name**: Jewel ICU
- **Mint Address**: `37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump`
- **Airdrop Amount**: 1 token (1 × 10^9 lamports)
- **Network**: Solana Mainnet-Beta

### UI Components

#### Airdrop Button
- Located in the header next to wallet connection
- Purple/pink gradient design
- Shows/hides based on wallet connection status
- Includes loading animation during processing

```html
<button class="airdrop-button" id="airdropBtn" style="display: none;">
    <svg>...</svg>
    Claim Airdrop
</button>
```

#### Styling
```css
.airdrop-button {
    background: linear-gradient(135deg, #9C27B0, #E91E63);
    /* Animated shimmer effect on loading */
}
```

### JavaScript Implementation

The airdrop functionality is implemented in the `JewelAirdrop` class:

```javascript
class JewelAirdrop {
    constructor() {
        this.JEWEL_ICU_MINT = '37ApeZ2X8dwKZkV22wDqLzDFh4QRkTMSvkc3uau6pump';
        this.AIRDROP_AMOUNT = 1;
        this.DECIMALS = 9;
    }
    
    async handleAirdrop() {
        // Validates wallet connection
        // Creates token accounts if needed
        // Processes airdrop (demo mode)
        // Shows success/error messages
    }
}
```

## Current Status: Demo Mode

The current implementation operates in **demo mode** for security reasons:
- Simulates the airdrop process
- Shows success messages without actual token transfer
- Prevents potential abuse without server-side validation

## Production Requirements

To make this feature production-ready, you'll need:

### 1. Server-Side Component
```javascript
// Example server endpoint
app.post('/api/airdrop', async (req, res) => {
    const { walletAddress } = req.body;
    
    // Verify eligibility
    if (await hasClaimedAirdrop(walletAddress)) {
        return res.status(400).json({ error: 'Already claimed' });
    }
    
    // Process airdrop
    const signature = await processAirdrop(walletAddress);
    await markAsClaimed(walletAddress);
    
    return res.json({ signature });
});
```

### 2. Database Schema
```sql
CREATE TABLE airdrops (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(44) UNIQUE NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_signature VARCHAR(88),
    amount DECIMAL(20, 9)
);
```

### 3. Security Measures
- Rate limiting per IP address
- CAPTCHA verification
- Wallet age verification
- Minimum balance requirements
- Anti-bot measures

### 4. Airdrop Wallet Setup
```javascript
// Server-side wallet management
const airdropWallet = Keypair.fromSecretKey(
    Buffer.from(process.env.AIRDROP_PRIVATE_KEY, 'base64')
);
```

## Testing

1. Open `index.html` in a web browser
2. Connect your Solflare wallet
3. Click the "Claim Airdrop" button that appears
4. Observe the loading state and success message

## Integration with Existing Code

The airdrop feature integrates seamlessly with:
- Existing wallet connection system
- Toast notification system
- Responsive design framework
- SPL token utilities

## Future Enhancements

1. **Multi-token Support**: Allow different token airdrops
2. **Referral System**: Bonus tokens for referrals
3. **Scheduled Airdrops**: Time-based distribution
4. **NFT Holder Rewards**: Special airdrops for NFT holders
5. **Staking Integration**: Airdrop to stakers

## Troubleshooting

### Common Issues

1. **"Please connect your wallet first"**
   - Ensure wallet is properly connected
   - Refresh the page and reconnect

2. **Transaction fails**
   - Check network connection
   - Ensure sufficient SOL for fees
   - Verify token account exists

3. **Button doesn't appear**
   - Wallet must be connected
   - Check browser console for errors

## Support

For issues or questions about the airdrop feature:
- Check the browser console for detailed error messages
- Ensure you're using a supported wallet (Solflare, Phantom)
- Verify you're on the correct network (Mainnet-Beta)

---

**Note**: This is a demonstration implementation. For production use, implement proper server-side validation and security measures to prevent abuse and ensure fair distribution.