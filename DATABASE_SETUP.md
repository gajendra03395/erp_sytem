# Database Setup Guide

Aapke paas do options hain database ke liye:

## Option 1: Supabase (PostgreSQL) - Recommended for SQL

### Setup Steps:

1. **Supabase Project Create Karein**
   - [supabase.com](https://supabase.com) par jayein
   - New project create karein
   - Project URL aur anon key note karein

2. **Schema Run Karein**
   - Supabase Dashboard → SQL Editor
   - `supabase/schema.sql` file ka content copy karein
   - Execute karein

3. **Sample Data (Optional)**
   - `supabase/seed.sql` run karein

4. **Environment Variables**
   - `.env.local` file mein add karein:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

6. **Use in Code**
   - `lib/db/index.ts` mein uncomment karein:
   ```typescript
   export * from './supabase'
   ```

---

## Option 2: Prisma with MongoDB

### Setup Steps:

1. **MongoDB Atlas Setup**
   - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) par account banayein
   - New cluster create karein
   - Connection string copy karein

2. **Install Prisma**
   ```bash
   npm install -D prisma
   npm install @prisma/client
   ```

3. **Environment Variables**
   - `.env` file mein add karein:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/manufacturing_erp?retryWrites=true&w=majority"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Push Schema**
   ```bash
   npx prisma db push
   ```

6. **Seed Data (Optional)**
   - `package.json` mein add karein:
   ```json
   {
     "prisma": {
       "seed": "ts-node prisma/seed.ts"
     }
   }
   ```
   ```bash
   npm install -D ts-node
   npx prisma db seed
   ```

7. **Use in Code**
   - `lib/db/index.ts` mein uncomment karein:
   ```typescript
   export * from './prisma'
   ```

---

## Database Tables/Collections

### 1. **users** - Authentication
- id, email, password_hash, role, employee_id

### 2. **employees** - Employee Directory
- id, employee_id, name, email, phone, department, status, shift

### 3. **inventory** - Inventory Management
- id, item_name, category, stock_level, unit, reorder_point

### 4. **machines** - Machine Tracking
- id, machine_name, machine_type, status, last_service_date, next_service_date, location

### 5. **quality_control** - QC Logs
- id, batch_no, result, inspector_name, inspector_id, inspection_date, notes

---

## Helper Functions

Donon databases ke liye same helper functions available hain:

- `getInventoryItems()`, `createInventoryItem()`, `updateInventoryItem()`, `deleteInventoryItem()`
- `getEmployees()`, `createEmployee()`, `updateEmployee()`, `deleteEmployee()`
- `getMachines()`, `createMachine()`, `updateMachine()`, `deleteMachine()`
- `getQCRecords()`, `createQCRecord()`, `updateQCRecord()`, `deleteQCRecord()`
- `getDashboardStats()` - Dashboard ke liye statistics

## Usage Example

```typescript
import { getInventoryItems, createInventoryItem } from '@/lib/db'

// Get all inventory items
const items = await getInventoryItems()

// Create new item
const newItem = await createInventoryItem({
  item_name: 'Steel Sheets',
  category: 'raw_material',
  stock_level: 5000,
  unit: 'kg',
  reorder_point: 1000,
})
```

---

## Recommendation

- **Supabase** use karein agar aapko SQL queries, relationships, aur RLS (Row Level Security) chahiye
- **Prisma + MongoDB** use karein agar aapko flexible schema aur NoSQL database chahiye
