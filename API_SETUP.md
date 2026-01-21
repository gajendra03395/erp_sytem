# API Setup Guide

Your Manufacturing ERP system now uses a complete API-based architecture with database persistence.

## Architecture Overview

```
Frontend (React Components)
    ↓
Custom Hooks (useInventory, useEmployees, etc.)
    ↓
API Client (lib/api/client.ts)
    ↓
API Routes (app/api/*/route.ts)
    ↓
Database Helpers (lib/db/supabase.ts or lib/db/prisma.ts)
    ↓
Database (Supabase PostgreSQL or MongoDB)
```

## API Endpoints

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new inventory item
- `GET /api/inventory/[id]` - Get single inventory item
- `PUT /api/inventory/[id]` - Update inventory item
- `DELETE /api/inventory/[id]` - Delete inventory item
- `POST /api/inventory/stock` - Add stock to existing item

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get single employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Machines
- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create new machine
- `GET /api/machines/[id]` - Get single machine
- `PUT /api/machines/[id]` - Update machine
- `DELETE /api/machines/[id]` - Delete machine

### Quality Control
- `GET /api/quality-control` - Get all QC records
- `POST /api/quality-control` - Create new QC record
- `GET /api/quality-control/[id]` - Get single QC record
- `PUT /api/quality-control/[id]` - Update QC record
- `DELETE /api/quality-control/[id]` - Delete QC record

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Setup

### Option 1: Supabase (PostgreSQL)

1. **Update API routes to use Supabase:**
   - All API routes currently import from `@/lib/db/supabase`
   - Make sure your `.env.local` has:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

2. **Run the schema:**
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql`

3. **Install Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```

### Option 2: Prisma (MongoDB)

1. **Update API routes to use Prisma:**
   - Change imports from `@/lib/db/supabase` to `@/lib/db/prisma` in all API route files

2. **Set up Prisma:**
   ```bash
   npm install prisma @prisma/client
   npx prisma generate
   npx prisma db push
   ```

3. **Environment variables:**
   ```env
   DATABASE_URL="mongodb+srv://..."
   ```

## How It Works

### Frontend Hooks

Each module has a custom hook that handles:
- Data fetching
- Loading states
- Error handling
- CRUD operations

Example:
```typescript
const { items, loading, error, addItem, updateItem, deleteItem } = useInventory()
```

### API Client

The API client (`lib/api/client.ts`) provides:
- `apiGet()` - GET requests
- `apiPost()` - POST requests
- `apiPut()` - PUT requests
- `apiDelete()` - DELETE requests

All requests automatically:
- Add JSON headers
- Handle errors
- Return typed responses

### Data Flow

1. **Component loads** → Hook fetches data from API
2. **User submits form** → Hook calls API with data
3. **API route** → Calls database helper function
4. **Database helper** → Executes database query
5. **Response** → Returns to frontend
6. **Hook updates** → Refetches data to show latest

## Features

✅ **Persistent Storage** - All data saved to database
✅ **Real-time Updates** - Data refreshes after mutations
✅ **Loading States** - Shows spinners while loading
✅ **Error Handling** - Displays error messages
✅ **Type Safety** - Full TypeScript support

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make sure your database is connected

3. Test each module:
   - Add items/employees/machines
   - Edit existing records
   - Delete records
   - Check that data persists after refresh

## Troubleshooting

### "Failed to fetch" errors
- Check database connection
- Verify environment variables
- Check API route files are using correct database helpers

### Data not persisting
- Verify database schema is set up
- Check database connection string
- Look at browser console and server logs

### Type errors
- Make sure all types match between frontend and API
- Check that database helpers return correct types
