import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, '../../.env') });

function numberFromEnv(key, fallback) {
  const value = process.env[key];
  return value ? Number(value) : fallback;
}

export const env = {
  port: numberFromEnv('PORT', 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: numberFromEnv('DB_PORT', 3306),
    database: process.env.DB_NAME || 'skullvi_talent_engine',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: numberFromEnv('DB_CONNECTION_LIMIT', 10)
  },
  jwtSecret: process.env.JWT_SECRET || 'replace-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

