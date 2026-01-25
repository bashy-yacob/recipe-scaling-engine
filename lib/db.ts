import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, neonConfig } from '@neondatabase/serverless';

// Enable WebSocket for Neon serverless (only in edge/serverless environments)
if (typeof globalThis.WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaInitialized: boolean;
};

let _db: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Lazy getter for database client
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_db) {
      if (globalForPrisma.prisma) {
        _db = globalForPrisma.prisma;
      } else {
        _db = createPrismaClient();
        if (process.env.NODE_ENV !== 'production') {
          globalForPrisma.prisma = _db;
        }
      }
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  }
});
