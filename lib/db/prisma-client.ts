import { PrismaClient } from '@prisma/client'

// Fix for browser compatibility - use globalThis instead of global
const globalForPrisma = (typeof globalThis !== 'undefined' ? globalThis : (global as any)) as unknown as {
  prisma: PrismaClient | undefined
}

const getPrismaClient = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['error'],
    })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()

if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
