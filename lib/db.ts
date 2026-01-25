import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _db: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  console.log('[DB] Creating Prisma client...');
  console.log('[DB] DATABASE_URL exists:', !!connectionString);
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // Use PrismaNeon adapter with connection string directly
  const adapter = new PrismaNeon({ connectionString });
  console.log('[DB] Prisma client created successfully with Neon adapter');
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
