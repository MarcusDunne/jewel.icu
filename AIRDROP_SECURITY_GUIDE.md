# Jewel ICU Airdrop Security Checklist & Implementation Guide

## Overview
This guide provides a comprehensive security framework for implementing a production-ready airdrop system for JEWEL ICU tokens. Following these guidelines will help prevent common attacks and ensure fair distribution.

## Table of Contents
1. [Critical Security Measures](#critical-security-measures)
2. [Backend Security Implementation](#backend-security-implementation)
3. [Frontend Security](#frontend-security)
4. [Wallet Security](#wallet-security)
5. [Database Security](#database-security)
6. [API Security](#api-security)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Emergency Procedures](#emergency-procedures)

---

## Critical Security Measures

### 1. Private Key Management
**Priority: CRITICAL**

```javascript
// NEVER hardcode private keys
// Use environment variables with proper encryption
const AIRDROP_PRIVATE_KEY = process.env.AIRDROP_WALLET_KEY;

// Use a key management service in production
// Options: AWS KMS, HashiCorp Vault, Azure Key Vault
```

**Implementation Checklist:**
- [ ] Store private keys in environment variables
- [ ] Use a secure key management service
- [ ] Implement key rotation policy (every 30-90 days)
- [ ] Never commit keys to version control
- [ ] Use separate keys for development/staging/production

### 2. Rate Limiting
**Priority: HIGH**

```javascript
// Example using express-rate-limit
const rateLimit = require('express-rate-limit');

const airdropLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many airdrop attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to airdrop endpoints
app.use('/api/airdrop', airdropLimiter);
```

**Rate Limiting Strategy:**
- [ ] Limit by IP address: 3 attempts per 15 minutes
- [ ] Limit by wallet address: 1 claim per wallet forever
- [ ] Implement progressive delays for repeated attempts
- [ ] Use distributed rate limiting for multiple servers

### 3. CAPTCHA Integration
**Priority: HIGH**

```javascript
// Example using Google reCAPTCHA v3
const axios = require('axios');

async function verifyCaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: secret,
        response: token
      }
    }
  );
  
  // Score threshold (0.0 - 1.0, higher is more human-like)
  return response.data.success && response.data.score > 0.5;
}
```

**CAPTCHA Checklist:**
- [ ] Implement reCAPTCHA v3 or hCaptcha
- [ ] Set appropriate score threshold (0.5-0.7)
- [ ] Log failed CAPTCHA attempts
- [ ] Consider fallback to v2 for low scores

---

## Backend Security Implementation

### 1. Request Validation
```javascript
// Validate all incoming requests
const { body, validationResult } = require('express-validator');

const validateAirdropRequest = [
  body('walletAddress')
    .isString()
    .matches(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
    .withMessage('Invalid Solana wallet address'),
  body('captchaToken')
    .isString()
    .notEmpty()
    .withMessage('CAPTCHA token required'),
  body('signature')
    .isString()
    .notEmpty()
    .withMessage('Request signature required'),
];
```

### 2. Signature Verification
```javascript
// Verify that requests come from the actual wallet owner
const nacl = require('tweetnacl');
const bs58 = require('bs58');

function verifyWalletSignature(message, signature, publicKey) {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    return false;
  }
}
```

### 3. Anti-Bot Measures
```javascript
// Implement multiple checks
async function performAntiBotChecks(walletAddress, ipAddress) {
  const checks = {
    walletAge: await checkWalletAge(walletAddress),
    walletBalance: await checkWalletBalance(walletAddress),
    ipReputation: await checkIPReputation(ipAddress),
    previousActivity: await checkPreviousActivity(walletAddress),
    suspiciousPattern: await detectSuspiciousPattern(ipAddress, walletAddress)
  };
  
  // Scoring system
  let score = 0;
  if (checks.walletAge > 30) score += 25; // Wallet older than 30 days
  if (checks.walletBalance > 0.01) score += 25; // Has SOL balance
  if (checks.ipReputation === 'clean') score += 25; // Clean IP
  if (checks.previousActivity) score += 25; // Has on-chain activity
  
  return score >= 50; // Require at least 50% score
}
```

---

## Frontend Security

### 1. Content Security Policy (CSP)
```html
<!-- Add to your HTML head -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://unpkg.com https://www.google.com/recaptcha/; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://api.mainnet-beta.solana.com;">
```

### 2. Request Signing
```javascript
// Sign requests on the frontend
async function createSignedRequest(wallet, data) {
  const message = JSON.stringify({
    ...data,
    timestamp: Date.now(),
    nonce: crypto.randomUUID()
  });
  
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await wallet.signMessage(encodedMessage);
  
  return {
    message,
    signature: bs58.encode(signature),
    publicKey: wallet.publicKey.toString()
  };
}
```

### 3. API Communication Security
```javascript
// Use HTTPS and implement request encryption
class SecureAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = 30000; // 30 second timeout
  }
  
  async claimAirdrop(walletAddress, captchaToken) {
    // Create signed request
    const signedRequest = await createSignedRequest(wallet, {
      action: 'claim_airdrop',
      walletAddress,
      captchaToken
    });
    
    // Send with proper headers
    const response = await fetch(`${this.baseURL}/api/airdrop/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
        'X-Timestamp': Date.now().toString()
      },
      body: JSON.stringify(signedRequest),
      timeout: this.timeout
    });
    
    if (!response.ok) {
      throw new Error(`Airdrop failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

---

## Wallet Security

### 1. Airdrop Wallet Setup
```bash
# Generate a new wallet for airdrops only
solana-keygen new --outfile ~/airdrop-wallet.json

# Fund with exact amount needed + fees
# Calculate: (number_of_recipients * airdrop_amount) + (estimated_fees)
```

### 2. Multi-Signature Setup (Recommended)
```javascript
// Use a multi-sig wallet for large airdrops
const { Multisig } = require('@solana/spl-governance');

// Require 2 of 3 signatures for transfers
const multisigConfig = {
  threshold: 2,
  signers: [
    process.env.SIGNER_1_PUBKEY,
    process.env.SIGNER_2_PUBKEY,
    process.env.SIGNER_3_PUBKEY
  ]
};
```

### 3. Transaction Limits
```javascript
// Implement daily transfer limits
const DAILY_TRANSFER_LIMIT = 1000; // tokens
const HOURLY_TRANSFER_LIMIT = 100; // tokens

async function checkTransferLimits() {
  const dailyTransferred = await getDailyTransferAmount();
  const hourlyTransferred = await getHourlyTransferAmount();
  
  if (dailyTransferred >= DAILY_TRANSFER_LIMIT) {
    throw new Error('Daily transfer limit reached');
  }
  
  if (hourlyTransferred >= HOURLY_TRANSFER_LIMIT) {
    throw new Error('Hourly transfer limit reached');
  }
}
```

---

## Database Security

### 1. Schema Design
```sql
-- Airdrop claims table with security fields
CREATE TABLE airdrop_claims (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(44) UNIQUE NOT NULL,
    ip_address INET NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_signature VARCHAR(88),
    amount DECIMAL(20, 9) NOT NULL,
    captcha_score DECIMAL(3, 2),
    user_agent TEXT,
    referrer TEXT,
    country_code VARCHAR(2),
    risk_score INTEGER,
    INDEX idx_wallet (wallet_address),
    INDEX idx_ip (ip_address),
    INDEX idx_claimed_at (claimed_at)
);

-- Blacklist table
CREATE TABLE blacklist (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    type ENUM('wallet', 'ip', 'email') NOT NULL,
    reason TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_blacklist (value, type)
);

-- Rate limiting table
CREATE TABLE rate_limits (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    type ENUM('ip', 'wallet') NOT NULL,
    attempts INTEGER DEFAULT 1,
    first_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_limit (identifier, type)
);
```

### 2. Data Encryption
```javascript
// Encrypt sensitive data
const crypto = require('crypto');

class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## API Security

### 1. Authentication & Authorization
```javascript
// Implement API key authentication for admin endpoints
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Apply to admin routes
app.use('/api/admin', apiKeyAuth);
```

### 2. CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://jewel.icu',
      'https://www.jewel.icu'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 3. Input Sanitization
```javascript
const validator = require('validator');
const xss = require('xss');

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove XSS attempts
  input = xss(input);
  
  // Escape special characters
  input = validator.escape(input);
  
  // Remove null bytes
  input = input.replace(/\0/g, '');
  
  return input;
}

// Apply to all inputs
app.use((req, res, next) => {
  req.body = sanitizeAllInputs(req.body);
  req.query = sanitizeAllInputs(req.query);
  req.params = sanitizeAllInputs(req.params);
  next();
});
```

---

## Monitoring & Alerts

### 1. Real-time Monitoring
```javascript
// Monitor critical metrics
class AirdropMonitor {
  constructor() {
    this.metrics = {
      totalClaims: 0,
      failedClaims: 0,
      suspiciousActivity: 0,
      walletBalance: 0
    };
  }
  
  async checkHealth() {
    // Check wallet balance
    this.metrics.walletBalance = await this.getWalletBalance();
    
    // Alert if balance is low
    if (this.metrics.walletBalance < 100) {
      await this.sendAlert('LOW_BALANCE', {
        balance: this.metrics.walletBalance,
        estimatedClaimsRemaining: Math.floor(this.metrics.walletBalance)
      });
    }
    
    // Check for suspicious patterns
    const recentClaims = await this.getRecentClaims(60); // Last 60 minutes
    if (this.detectAnomalies(recentClaims)) {
      await this.sendAlert('SUSPICIOUS_ACTIVITY', {
        claims: recentClaims
      });
    }
  }
  
  detectAnomalies(claims) {
    // Check for:
    // - Multiple claims from same IP
    // - Sequential wallet addresses
    // - Unusual geographic patterns
    // - Rapid claim velocity
    
    const ipCounts = {};
    const claimTimes = [];
    
    claims.forEach(claim => {
      ipCounts[claim.ip_address] = (ipCounts[claim.ip_address] || 0) + 1;
      claimTimes.push(claim.claimed_at);
    });
    
    // Flag if same IP has more than 3 claims
    const suspiciousIPs = Object.entries(ipCounts)
      .filter(([ip, count]) => count > 3);
    
    return suspiciousIPs.length > 0;
  }
}
```

### 2. Logging Strategy
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'airdrop.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Log all airdrop attempts
function logAirdropAttempt(data) {
  logger.info('Airdrop attempt', {
    timestamp: new Date().toISOString(),
    walletAddress: data.walletAddress,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    captchaScore: data.captchaScore,
    result: data.result,
    transactionSignature: data.signature
  });
}
```

### 3. Alert System
```javascript
// Set up alerts for critical events
const alertChannels = {
  email: async (message) => {
    // Send email alert
  },
  slack: async (message) => {
    // Send Slack notification
  },
  sms: async (message) => {
    // Send SMS for critical alerts
  }
};

const alertThresholds = {
  LOW_BALANCE: 100, // tokens
  HIGH_FAILURE_RATE: 0.2, // 20% failure rate
  RAPID_CLAIMS: 50, // claims per minute
  SUSPICIOUS_IP_CLAIMS: 5 // claims from same IP
};
```

---

## Emergency Procedures

### 1. Kill Switch Implementation
```javascript
// Global kill switch for emergencies
let AIRDROP_ENABLED = true;

// Admin endpoint to toggle
app.post('/api/admin/airdrop/toggle', apiKeyAuth, async (req, res) => {
  AIRDROP_ENABLED = !AIRDROP_ENABLED;
  
  logger.warn(`Airdrop ${AIRDROP_ENABLED ? 'enabled' : 'disabled'} by admin`);
  
  res.json({ 
    status: 'success', 
    airdropEnabled: AIRDROP_ENABLED 
  });
});

// Check in airdrop handler
if (!AIRDROP_ENABLED) {
  return res.status(503).json({ 
    error: 'Airdrop temporarily disabled' 
  });
}
```

### 2. Incident Response Plan
```markdown
## Incident Response Checklist

### Suspected Attack
1. [ ] Enable kill switch immediately
2. [ ] Analyze recent logs for patterns
3. [ ] Check wallet balance
4. [ ] Identify attack vector
5. [ ] Block malicious IPs/wallets
6. [ ] Implement additional checks
7. [ ] Re-enable with enhanced security

### Wallet Compromise
1. [ ] Disable all airdrop endpoints
2. [ ] Transfer remaining funds to secure wallet
3. [ ] Revoke all permissions
4. [ ] Generate new wallet
5. [ ] Update environment variables
6. [ ] Audit all transactions
7. [ ] Notify affected users if necessary

### High Volume Attack
1. [ ] Increase rate limits
2. [ ] Enable CAPTCHA v2 (more strict)
3. [ ] Require manual approval for claims
4. [ ] Implement queue system
5. [ ] Scale infrastructure if needed
```

### 3. Backup & Recovery
```javascript
// Regular backups
const schedule = require('node-schedule');

// Backup claims data every hour
schedule.scheduleJob('0 * * * *', async () => {
  try {
    await backupDatabase();
    await exportClaimsData();
    logger.info('Hourly backup completed');
  } catch (error) {
    logger.error('Backup failed', error);
    await sendAlert('BACKUP_FAILED', error);
  }
});

// Export claims for audit
async function exportClaimsData() {
  const claims = await db.query('SELECT * FROM airdrop_claims');
  const csv = convertToCSV(claims);
  
  // Store in secure location
  await uploadToS3(`backups/claims_${Date.now()}.csv`, csv);
}
```

---

## Security Audit Checklist

### Pre-Launch
- [ ] Private keys stored securely
- [ ] Rate limiting tested
- [ ] CAPTCHA integration working
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Kill switch tested
- [ ] Load testing completed
- [ ] Security scan performed
- [ ] Code review completed
- [ ] Incident response plan ready

### Post-Launch
- [ ] Monitor first 100 claims closely
- [ ] Check for anomalies
- [ ] Verify transaction success rate
- [ ] Monitor wallet balance
- [ ] Review logs for errors
- [ ] Check system performance
- [ ] Gather user feedback
- [ ] Adjust rate limits if needed

### Daily Checks
- [ ] Wallet balance sufficient
- [ ] No suspicious activity
- [ ] All systems operational
- [ ] Backup successful
- [ ] Error rate acceptable
- [ ] Response times normal

---

## Additional Resources

1. **Solana Security Best Practices**: https://docs.solana.com/security-best-practices
2. **OWASP API Security**: https://owasp.org/www-project-api-security/
3. **Rate Limiting Strategies**: https://cloud.google.com/architecture/rate-limiting-strategies-techniques
4. **Key Management**: https://cloud.google.com/kms/docs/key-management-service

---

## Support & Updates

This security guide should be reviewed and updated regularly as new threats emerge and best practices evolve. Consider scheduling quarterly security reviews and staying informed about the latest security vulnerabilities in the Solana ecosystem.

For questions or security concerns, establish a security contact email (e.g., security@jewel.icu) and response procedures.