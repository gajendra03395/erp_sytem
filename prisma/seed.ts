import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users first
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@erp.com',
        passwordHash: await bcrypt.hash('admin123', 12),
        role: 'ADMIN',
      }
    }),
    prisma.user.create({
      data: {
        email: 'supervisor@erp.com',
        passwordHash: await bcrypt.hash('supervisor123', 12),
        role: 'SUPERVISOR',
      }
    }),
    prisma.user.create({
      data: {
        email: 'operator@erp.com',
        passwordHash: await bcrypt.hash('operator123', 12),
        role: 'OPERATOR',
      }
    })
  ])

  // Create employees
  await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        name: 'Admin User',
        email: 'admin@erp.com',
        phone: '+1234567890',
        department: 'admin',
        status: 'active',
        shift: 'Day',
        user: {
          connect: { id: users[0].id }
        }
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        name: 'Sarah Supervisor',
        email: 'supervisor@erp.com',
        phone: '+1234567891',
        department: 'production',
        status: 'active',
        shift: 'Day',
        user: {
          connect: { id: users[1].id }
        }
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP003',
        name: 'John Operator',
        email: 'operator@erp.com',
        phone: '+1234567892',
        department: 'production',
        status: 'active',
        shift: 'Day',
        user: {
          connect: { id: users[2].id }
        }
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP004',
        name: 'Mike Wilson',
        email: 'mike@erp.com',
        phone: '+1234567893',
        department: 'production',
        status: 'active',
        shift: 'Night'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP005',
        name: 'Lisa Chen',
        email: 'lisa@erp.com',
        phone: '+1234567894',
        department: 'qc',
        status: 'active',
        shift: 'Day'
      }
    })
  ])

  // Create some inventory items
  await Promise.all([
    prisma.inventoryItem.create({
      data: {
        itemName: 'Raw Material A',
        stockLevel: 1000,
        reorderPoint: 100,
        unit: 'kg',
        location: 'Warehouse A',
        category: 'Raw Materials',
        unitCost: 50.0,
        isActive: true
      }
    }),
    prisma.inventoryItem.create({
      data: {
        itemName: 'Component B',
        stockLevel: 500,
        reorderPoint: 50,
        unit: 'pcs',
        location: 'Warehouse B',
        category: 'Components',
        unitCost: 25.0,
        isActive: true
      }
    })
  ])

  // Create work orders
  await Promise.all([
    (prisma as any).workOrder.create({
      data: {
        orderNo: 'WO001',
        productName: 'Product A',
        productSku: 'PROD-A-001',
        quantity: 100,
        unit: 'pcs',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Urgent production run'
      }
    }),
    (prisma as any).workOrder.create({
      data: {
        orderNo: 'WO002',
        productName: 'Product B',
        productSku: 'PROD-B-001',
        quantity: 200,
        unit: 'pcs',
        priority: 'MEDIUM',
        status: 'PENDING',
        startDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        notes: 'Standard production run'
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
