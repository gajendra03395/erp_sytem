# Prisma with MongoDB Setup

This directory contains the Prisma schema and setup files for the Manufacturing ERP system using MongoDB.

## Setup Instructions

1. **Install Prisma CLI**
   ```bash
   npm install -D prisma
   npm install @prisma/client
   ```

2. **Set up MongoDB**
   - Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/manufacturing_erp?retryWrites=true&w=majority"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

6. **Seed Sample Data (Optional)**
   ```bash
   npx prisma db seed
   ```

   Add this to your `package.json`:
   ```json
   {
     "prisma": {
       "seed": "ts-node prisma/seed.ts"
     }
   }
   ```

   Install ts-node if needed:
   ```bash
   npm install -D ts-node
   ```

## Database Models

- **User**: Authentication and user management
- **Employee**: Employee directory with departments and status
- **Inventory**: Raw materials and finished goods tracking
- **Machine**: Machine status and maintenance tracking
- **QualityControl**: QC inspection logs

## Useful Prisma Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma db pull` - Pull schema from existing database
- `npx prisma format` - Format schema file
