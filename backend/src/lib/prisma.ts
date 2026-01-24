import { PrismaClient } from '../../src/generated/prisma'

declare global {
    var prisma : PrismaClient | undefined
}

export const client = globalThis.prisma || new PrismaClient({
    accelerateUrl : process.env.DB_ACCELERATE_URL!
})

if(process.env.NODE_ENV !== 'production') globalThis.prisma = client