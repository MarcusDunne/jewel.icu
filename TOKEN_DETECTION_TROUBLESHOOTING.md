# Token Lock Detection Troubleshooting Guide

## Why Detection Might Not Be Working

### 1. **Program ID Issue (Most Likely)**
The current implementation uses a placeholder Program ID:
```
TokenLock111111111111111111111111111111111
```

This is NOT a real deployed program. You need to:
1. Deploy your Solana program first
2. Update the `TOKEN_LOCK_PROGRAM_ID` in `js/tokenLock.js` with your actual deployed program ID

### 2. **Network Mismatch**
Make sure you're connected to the correct network where your program is deployed:
- If you deployed on devnet, use devnet
- If you deployed on mainnet, use mainnet-beta
- The UI currently defaults to devnet

### 3. **Vault Not Initialized**
Before you can detect locks, a vault must be initialized for the token. The detection will show "No vault found" if:
- The token has never been used with the lock program
- The vault initialization failed

### 4. **Invalid Token Mint Address**
Ensure you're using a valid SPL token mint address, not a wallet address or token account address.

## How to Test Detection

### Step 1: Use the Test Page
Open `test-token-detection.html` in your browser. This page provides detailed debugging information.

### Step 2: Test Connection First
1. Select your network (devnet/testnet/mainnet)
2. Click "Test Connection"
3. You should see "Connected successfully!"

### Step 3: Update Program ID (if deployed)
If you've deployed your program:
1. Enter your deployed program ID in the "Program ID" field
2. Update `js/tokenLock.js` line 20 with your actual program ID:
```javascript
export const TOKEN_LOCK_PROGRAM_ID = new PublicKey('YOUR_ACTUAL_PROGRAM_ID_HERE');
```

### Step 4: Check Vault
1. Enter a token mint address
2. Click "Check Vault"
3. This will tell you if a vault exists for the token

### Step 5: Detect Locks
1. Enter a token mint address
2. Optionally enter a wallet address
3. Click "Detect Locks"

## Common Error Messages and Solutions

### "No vault found for this token"
**Solution**: The token needs to be initialized first. Someone needs to call `initializeVault` for this token.

### "Error: Account does not exist"
**Solution**: The program is not deployed at the specified address, or you're on the wrong network.

### "Invalid token mint address format"
**Solution**: Make sure you're entering a valid Solana public key (base58 format).

### "Error getting lock info: No lock record found for this user"
**Solution**: This user hasn't locked any tokens yet. This is normal if they haven't used the lock feature.

## Testing with a Real Token

If you want to test with a real SPL token on devnet:

1. **Create a test token on devnet**:
```bash
spl-token create-token --url devnet
```

2. **Deploy your program to devnet** (if not already done):
```bash
anchor deploy --provider.cluster devnet
```

3. **Update the program ID** in `js/tokenLock.js`

4. **Initialize a vault** for your test token using the UI

5. **Lock some tokens** to create test data

6. **Test detection** with your token mint address

## Console Debugging

The test page includes a console that shows all operations. Check for:
- Network connection status
- Program ID being used
- Exact error messages from Solana

## Quick Checklist

- [ ] Program is deployed to Solana
- [ ] Program ID is updated in `js/tokenLock.js`
- [ ] Using correct network (devnet/mainnet)
- [ ] Valid SPL token mint address
- [ ] Vault is initialized for the token
- [ ] At least one lock exists (for testing)

## Need More Help?

1. Check browser console for detailed errors (F12)
2. Verify program deployment with:
   ```bash
   solana program show YOUR_PROGRAM_ID --url devnet
   ```
3. Test with known working tokens first
4. Ensure your RPC endpoint is responsive

## Example Working Flow

1. Deploy program → Get program ID
2. Update `TOKEN_LOCK_PROGRAM_ID` in code
3. Create/use an SPL token
4. Initialize vault for that token
5. Lock some tokens
6. Test detection - should now work!