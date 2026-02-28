// Token Lock Program Utilities for jewel.icu
import { 
    Connection, 
    PublicKey, 
    SystemProgram,
    Transaction,
    TransactionInstruction,
    SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js';
import { 
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount
} from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { BN } from 'bn.js';

// Program ID - Update this after deployment
// This is a placeholder - replace with your actual deployed program ID
export const TOKEN_LOCK_PROGRAM_ID = new PublicKey('TokenLock111111111111111111111111111111111');

// IDL for the token lock program
export const TOKEN_LOCK_IDL = {
    version: "0.1.0",
    name: "token_lock",
    instructions: [
        {
            name: "initializeVault",
            accounts: [
                { name: "vault", isMut: true, isSigner: false },
                { name: "tokenMint", isMut: false, isSigner: false },
                { name: "authority", isMut: true, isSigner: true },
                { name: "systemProgram", isMut: false, isSigner: false }
            ],
            args: [
                { name: "vaultBump", type: "u8" }
            ]
        },
        {
            name: "lockTokens",
            accounts: [
                { name: "vault", isMut: true, isSigner: false },
                { name: "lockRecord", isMut: true, isSigner: false },
                { name: "userTokenAccount", isMut: true, isSigner: false },
                { name: "vaultTokenAccount", isMut: true, isSigner: false },
                { name: "user", isMut: true, isSigner: true },
                { name: "tokenProgram", isMut: false, isSigner: false },
                { name: "systemProgram", isMut: false, isSigner: false }
            ],
            args: [
                { name: "amount", type: "u64" },
                { name: "unlockTimestamp", type: "i64" }
            ]
        },
        {
            name: "unlockTokens",
            accounts: [
                { name: "vault", isMut: true, isSigner: false },
                { name: "lockRecord", isMut: true, isSigner: false },
                { name: "userTokenAccount", isMut: true, isSigner: false },
                { name: "vaultTokenAccount", isMut: true, isSigner: false },
                { name: "user", isMut: true, isSigner: true },
                { name: "tokenProgram", isMut: false, isSigner: false }
            ],
            args: []
        },
        {
            name: "getLockInfo",
            accounts: [
                { name: "lockRecord", isMut: false, isSigner: false }
            ],
            args: []
        }
    ],
    accounts: [
        {
            name: "Vault",
            type: {
                kind: "struct",
                fields: [
                    { name: "authority", type: "publicKey" },
                    { name: "tokenMint", type: "publicKey" },
                    { name: "bump", type: "u8" },
                    { name: "totalLocked", type: "u64" }
                ]
            }
        },
        {
            name: "LockRecord",
            type: {
                kind: "struct",
                fields: [
                    { name: "owner", type: "publicKey" },
                    { name: "amount", type: "u64" },
                    { name: "unlockTimestamp", type: "i64" },
                    { name: "lockedAt", type: "i64" },
                    { name: "vault", type: "publicKey" },
                    { name: "isUnlocked", type: "bool" }
                ]
            }
        }
    ],
    events: [
        {
            name: "TokensLocked",
            fields: [
                { name: "user", type: "publicKey", index: false },
                { name: "amount", type: "u64", index: false },
                { name: "unlockTimestamp", type: "i64", index: false },
                { name: "vault", type: "publicKey", index: false }
            ]
        },
        {
            name: "TokensUnlocked",
            fields: [
                { name: "user", type: "publicKey", index: false },
                { name: "amount", type: "u64", index: false },
                { name: "vault", type: "publicKey", index: false }
            ]
        }
    ]
};

export class TokenLockClient {
    constructor(connection, wallet) {
        this.connection = connection;
        this.wallet = wallet;
        this.provider = new anchor.AnchorProvider(
            connection,
            wallet,
            { commitment: 'confirmed' }
        );
        this.program = new anchor.Program(TOKEN_LOCK_IDL, TOKEN_LOCK_PROGRAM_ID, this.provider);
    }

    // Get vault PDA
    async getVaultPDA(tokenMint) {
        const [vaultPDA, bump] = await PublicKey.findProgramAddress(
            [Buffer.from('vault'), tokenMint.toBuffer()],
            TOKEN_LOCK_PROGRAM_ID
        );
        return { vaultPDA, bump };
    }

    // Get lock record PDA
    async getLockRecordPDA(vault, user) {
        const [lockRecordPDA, bump] = await PublicKey.findProgramAddress(
            [Buffer.from('lock'), vault.toBuffer(), user.toBuffer()],
            TOKEN_LOCK_PROGRAM_ID
        );
        return { lockRecordPDA, bump };
    }

    // Initialize a vault for a token
    async initializeVault(tokenMint) {
        try {
            const { vaultPDA, bump } = await this.getVaultPDA(tokenMint);
            
            const tx = await this.program.methods
                .initializeVault(bump)
                .accounts({
                    vault: vaultPDA,
                    tokenMint: tokenMint,
                    authority: this.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            return {
                success: true,
                signature: tx,
                vault: vaultPDA
            };
        } catch (error) {
            console.error('Error initializing vault:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Lock tokens into the vault
    async lockTokens(tokenMint, amount, lockDurationSeconds) {
        try {
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            const { lockRecordPDA } = await this.getLockRecordPDA(vaultPDA, this.wallet.publicKey);
            
            // Calculate unlock timestamp
            const currentTime = Math.floor(Date.now() / 1000);
            const unlockTimestamp = currentTime + lockDurationSeconds;
            
            // Get user token account
            const userTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                this.wallet.publicKey
            );
            
            // Get vault token account
            const vaultTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                vaultPDA,
                true // allowOwnerOffCurve
            );
            
            // Check if vault token account exists, create if not
            const vaultTokenAccountInfo = await this.connection.getAccountInfo(vaultTokenAccount);
            
            let instructions = [];
            if (!vaultTokenAccountInfo) {
                instructions.push(
                    createAssociatedTokenAccountInstruction(
                        this.wallet.publicKey,
                        vaultTokenAccount,
                        vaultPDA,
                        tokenMint
                    )
                );
            }
            
            const tx = await this.program.methods
                .lockTokens(new BN(amount), new BN(unlockTimestamp))
                .accounts({
                    vault: vaultPDA,
                    lockRecord: lockRecordPDA,
                    userTokenAccount: userTokenAccount,
                    vaultTokenAccount: vaultTokenAccount,
                    user: this.wallet.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(instructions)
                .rpc();

            return {
                success: true,
                signature: tx,
                lockRecord: lockRecordPDA,
                unlockTimestamp: new Date(unlockTimestamp * 1000)
            };
        } catch (error) {
            console.error('Error locking tokens:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Unlock tokens after lock period
    async unlockTokens(tokenMint) {
        try {
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            const { lockRecordPDA } = await this.getLockRecordPDA(vaultPDA, this.wallet.publicKey);
            
            // Get user token account
            const userTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                this.wallet.publicKey
            );
            
            // Get vault token account
            const vaultTokenAccount = await getAssociatedTokenAddress(
                tokenMint,
                vaultPDA,
                true
            );
            
            const tx = await this.program.methods
                .unlockTokens()
                .accounts({
                    vault: vaultPDA,
                    lockRecord: lockRecordPDA,
                    userTokenAccount: userTokenAccount,
                    vaultTokenAccount: vaultTokenAccount,
                    user: this.wallet.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            return {
                success: true,
                signature: tx
            };
        } catch (error) {
            console.error('Error unlocking tokens:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get lock information for a user
    async getLockInfo(tokenMint, userPublicKey = null) {
        try {
            const user = userPublicKey || this.wallet.publicKey;
            if (!user) {
                throw new Error('User public key is required');
            }
            
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            const { lockRecordPDA } = await this.getLockRecordPDA(vaultPDA, user);
            
            // Check if lock record exists first
            const lockRecordInfo = await this.connection.getAccountInfo(lockRecordPDA);
            if (!lockRecordInfo) {
                return {
                    success: false,
                    error: 'No lock record found for this user',
                    lockInfo: null
                };
            }
            
            const lockRecord = await this.program.account.lockRecord.fetch(lockRecordPDA);
            
            const currentTime = Math.floor(Date.now() / 1000);
            const timeRemaining = Math.max(0, lockRecord.unlockTimestamp.toNumber() - currentTime);
            const canUnlock = !lockRecord.isUnlocked && currentTime >= lockRecord.unlockTimestamp.toNumber();
            
            return {
                success: true,
                lockInfo: {
                    owner: lockRecord.owner.toString(),
                    amount: lockRecord.amount.toString(),
                    unlockTimestamp: new Date(lockRecord.unlockTimestamp.toNumber() * 1000),
                    lockedAt: new Date(lockRecord.lockedAt.toNumber() * 1000),
                    isUnlocked: lockRecord.isUnlocked,
                    timeRemaining: timeRemaining,
                    timeRemainingFormatted: this.formatTimeRemaining(timeRemaining),
                    canUnlock: canUnlock
                }
            };
        } catch (error) {
            console.error('Error getting lock info:', error);
            return {
                success: false,
                error: error.message,
                lockInfo: null
            };
        }
    }

    // Get all lock records for a vault
    async getAllLockRecords(tokenMint) {
        try {
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            
            // Fetch all lock records
            const lockRecords = await this.program.account.lockRecord.all([
                {
                    memcmp: {
                        offset: 8 + 32 + 8 + 8 + 8, // After owner, amount, unlock_timestamp, locked_at
                        bytes: vaultPDA.toBase58()
                    }
                }
            ]);
            
            const currentTime = Math.floor(Date.now() / 1000);
            
            return {
                success: true,
                records: lockRecords.map(record => ({
                    publicKey: record.publicKey.toString(),
                    owner: record.account.owner.toString(),
                    amount: record.account.amount.toString(),
                    unlockTimestamp: new Date(record.account.unlockTimestamp.toNumber() * 1000),
                    lockedAt: new Date(record.account.lockedAt.toNumber() * 1000),
                    isUnlocked: record.account.isUnlocked,
                    timeRemaining: Math.max(0, record.account.unlockTimestamp.toNumber() - currentTime),
                    canUnlock: !record.account.isUnlocked && currentTime >= record.account.unlockTimestamp.toNumber()
                }))
            };
        } catch (error) {
            console.error('Error getting all lock records:', error);
            return {
                success: false,
                error: error.message,
                records: []
            };
        }
    }

    // Get vault information
    async getVaultInfo(tokenMint) {
        try {
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            
            // Check if vault exists first
            const vaultInfo = await this.connection.getAccountInfo(vaultPDA);
            if (!vaultInfo) {
                return {
                    success: false,
                    error: 'Vault does not exist for this token',
                    vaultInfo: null
                };
            }
            
            const vault = await this.program.account.vault.fetch(vaultPDA);
            
            return {
                success: true,
                vaultInfo: {
                    authority: vault.authority.toString(),
                    tokenMint: vault.tokenMint.toString(),
                    totalLocked: vault.totalLocked.toString(),
                    vaultAddress: vaultPDA.toString()
                }
            };
        } catch (error) {
            console.error('Error getting vault info:', error);
            return {
                success: false,
                error: error.message,
                vaultInfo: null
            };
        }
    }

    // Format time remaining in human-readable format
    formatTimeRemaining(seconds) {
        if (seconds <= 0) return 'Unlockable';
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 && days === 0) parts.push(`${secs}s`);
        
        return parts.join(' ') || '0s';
    }

    // Check if a vault exists for a token
    async vaultExists(tokenMint) {
        try {
            const { vaultPDA } = await this.getVaultPDA(tokenMint);
            const vaultInfo = await this.connection.getAccountInfo(vaultPDA);
            return vaultInfo !== null;
        } catch (error) {
            console.error('Error checking vault existence:', error);
            return false;
        }
    }
}

// Export utility functions for use in the main application
export const tokenLockUtils = {
    // Create a new client instance
    createClient: (connection, wallet) => {
        return new TokenLockClient(connection, wallet);
    },
    
    // Format token amount (assuming 9 decimals for SPL tokens)
    formatTokenAmount: (amount, decimals = 9) => {
        return (parseInt(amount) / Math.pow(10, decimals)).toFixed(decimals);
    },
    
    // Parse token amount to smallest unit
    parseTokenAmount: (amount, decimals = 9) => {
        return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
    }
};