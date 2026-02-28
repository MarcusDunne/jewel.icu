# Token Lock System for Jewel.icu

This document describes the SPL token locking functionality integrated into jewel.icu, allowing users to lock tokens into liquidity pools for specified time periods.

## Overview

The token lock system consists of:
1. **Solana Program** - Smart contract for locking/unlocking tokens
2. **Frontend Utilities** - JavaScript library for interacting with the program
3. **UI Components** - Integrated interface in the main website
4. **Detection Methods** - Functions to check lock status and periods

## Features

### 1. Token Locking
- Lock any SPL token for a specified duration
- Predefined duration options (1 hour to 1 year)
- Custom duration support
- Automatic vault creation for new tokens

### 2. Lock Detection
- Check lock status for any wallet address
- View all locks for a specific token
- Real-time time remaining calculations
- Automatic unlock availability detection

### 3. Token Unlocking
- Unlock tokens after lock period expires
- Secure transfer back to user wallet
- Transaction confirmation and status updates

## File Structure

```
jewel.icu v 5/
├── programs/
│   └── token-lock/
│       ├── Cargo.toml          # Rust dependencies
│       └── src/
│           └── lib.rs          # Solana program code
├── js/
│   └── tokenLock.js           # Frontend utilities
├── token-lock-ui.html         # Standalone UI demo
└── index.html                 # Main website with integration
```

## Usage

### For Users

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Open Token Lock**: Click "Lock Tokens" button (bottom right)
3. **Enter Details**:
   - Token mint address
   - Amount to lock
   - Lock duration
4. **Confirm Transaction**: Approve in wallet
5. **View Status**: See your locked tokens in the modal
6. **Unlock**: Click "Unlock" when period expires

### For Developers

#### Initialize Token Lock Client
```javascript
import { TokenLockClient, tokenLockUtils } from './js/tokenLock.js';

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('devnet'),
    'confirmed'
);

const tokenLockClient = tokenLockUtils.createClient(connection, wallet);
```

#### Lock Tokens
```javascript
// Lock 100 tokens for 30 days
const amount = tokenLockUtils.parseTokenAmount('100');
const duration = 30 * 24 * 60 * 60; // 30 days in seconds

const result = await tokenLockClient.lockTokens(
    tokenMintPublicKey,
    amount,
    duration
);
```

#### Check Lock Status
```javascript
const lockInfo = await tokenLockClient.getLockInfo(
    tokenMintPublicKey,
    userPublicKey
);

console.log('Locked amount:', lockInfo.lockInfo.amount);
console.log('Time remaining:', lockInfo.lockInfo.timeRemainingFormatted);
console.log('Can unlock:', lockInfo.lockInfo.canUnlock);
```

#### Detect All Locks for a Token
```javascript
const allLocks = await tokenLockClient.getAllLockRecords(tokenMintPublicKey);

allLocks.records.forEach(record => {
    console.log(`${record.owner}: ${record.amount} tokens locked until ${record.unlockTimestamp}`);
});
```

## Program Details

### Program ID
```
TokenLock111111111111111111111111111111111
```
*Note: This is a placeholder. Deploy the program and update this ID.*

### Key Accounts

1. **Vault**: Holds locked tokens for a specific mint
   - PDA: `["vault", token_mint]`
   - Stores total locked amount

2. **Lock Record**: Individual user's lock information
   - PDA: `["lock", vault, user]`
   - Stores amount, unlock time, status

### Instructions

1. **initialize_vault**: Create vault for new token
2. **lock_tokens**: Lock tokens with duration
3. **unlock_tokens**: Unlock after expiry
4. **get_lock_info**: Query lock details

## Security Considerations

1. **Time-based Security**: Tokens cannot be unlocked before expiry
2. **Owner Verification**: Only token owner can unlock their tokens
3. **Vault Isolation**: Each token has separate vault
4. **Atomic Operations**: All transfers are atomic

## Deployment

### 1. Build Solana Program
```bash
cd programs/token-lock
cargo build-bpf
```

### 2. Deploy Program
```bash
solana program deploy target/deploy/token_lock.so
```

### 3. Update Program ID
Update `TOKEN_LOCK_PROGRAM_ID` in `js/tokenLock.js` with deployed address

### 4. Test Integration
- Connect wallet on jewel.icu
- Click "Lock Tokens" button
- Test with devnet tokens

## API Reference

### TokenLockClient Methods

#### `initializeVault(tokenMint)`
Creates a new vault for a token mint.

#### `lockTokens(tokenMint, amount, lockDurationSeconds)`
Locks tokens for specified duration.

#### `unlockTokens(tokenMint)`
Unlocks tokens after lock period.

#### `getLockInfo(tokenMint, userPublicKey)`
Gets lock information for a user.

#### `getAllLockRecords(tokenMint)`
Gets all lock records for a token.

#### `getVaultInfo(tokenMint)`
Gets vault information including total locked.

#### `vaultExists(tokenMint)`
Checks if vault exists for token.

## Error Handling

Common errors and solutions:

1. **"Invalid unlock time"**: Duration must be in future
2. **"Lock period not expired"**: Wait for unlock time
3. **"Already unlocked"**: Tokens already withdrawn
4. **"Vault not found"**: Initialize vault first

## Future Enhancements

1. **Partial Unlocking**: Allow unlocking portions
2. **Lock Extensions**: Extend lock periods
3. **Reward Distribution**: Distribute rewards to locked tokens
4. **Governance Integration**: Use locks for voting power
5. **Multi-sig Support**: Require multiple signatures

## Support

For issues or questions:
- Check browser console for errors
- Ensure wallet is connected
- Verify sufficient SOL for fees
- Confirm token mint is valid SPL token

## License

This token lock system is part of the Jewel ICU project.