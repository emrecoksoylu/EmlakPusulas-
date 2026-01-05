import { PrismaClient } from '@prisma/client'

// Robust check for Vercel Environment
if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
    console.error("FATAL ERROR: DATABASE_URL is not defined in Vercel Environment Variables. Prisma will fail.");
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
