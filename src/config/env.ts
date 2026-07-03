import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  // Stellar
  STELLAR_NETWORK: (process.env.STELLAR_NETWORK as 'testnet' | 'mainnet') || 'testnet',
  STELLAR_HORIZON_URL: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  STELLAR_SERVER_SECRET: process.env.STELLAR_SERVER_SECRET || '',

  // USDC on Stellar
  USDC_CONTRACT_ID: process.env.USDC_CONTRACT_ID || '',
  USDC_ISSUER: process.env.USDC_ISSUER || '',

  // Feature flags
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
} as const;

// Validate required env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'STELLAR_SERVER_SECRET', 'USDC_CONTRACT_ID'];

if (env.NODE_ENV === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
