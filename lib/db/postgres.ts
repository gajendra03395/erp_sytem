// PostgreSQL Database Configuration
const { PrismaClient } = require('@prisma/client')

// Real PostgreSQL Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/erp_db'
    }
  },
  log: ['query', 'info', 'warn', 'error'],
})

// Connection test
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

module.exports = { prisma, testConnection }
