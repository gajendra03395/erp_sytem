# Mock Data Guide

This document describes the mock data available for testing your Manufacturing ERP system.

## Available Mock Data Files

### 1. QC Mock Data (`lib/mock-data/qc-mock-data.ts`)
- **15 QC Records** with varied results
- Includes: Pass, Fail, and Pending statuses
- Realistic defect reasons for failed inspections
- Mix of different products (Widget A, B, C, D, Component X, Y, Z)
- Different inspectors (Sarah Johnson, Lisa Anderson)
- Date range: March 15-29, 2024

### 2. Employee Mock Data (`lib/mock-data/employees-mock-data.ts`)
- **25 Employees** across all departments
- Roles: ADMIN (3), SUPERVISOR (5), OPERATOR (17)
- Departments: Production (10), QC (6), Maintenance (5), Admin (4)
- Shifts: Day (15), Night (10)
- Status: Active (23), On Leave (1), Inactive (1)

## Using Mock Data

### Option 1: Import in Components (For Testing)

```typescript
import { mockQCRecords } from '@/lib/mock-data/qc-mock-data'
import { mockEmployees } from '@/lib/mock-data/employees-mock-data'

// Use in your component
const [qcRecords, setQcRecords] = useState(mockQCRecords)
const [employees, setEmployees] = useState(mockEmployees)
```

### Option 2: Seed Database

#### For Supabase:
1. Run the seed SQL file:
   ```sql
   -- Already included in supabase/seed.sql
   ```

2. Or manually insert:
   ```sql
   -- Copy from supabase/seed.sql
   ```

#### For Prisma:
1. Update `prisma/seed.ts` to include the mock data
2. Run: `npx prisma db seed`

### Option 3: API Endpoint for Seeding

You can create a seed endpoint:

```typescript
// app/api/seed/route.ts
import { mockQCRecords } from '@/lib/mock-data/qc-mock-data'
import { mockEmployees } from '@/lib/mock-data/employees-mock-data'

export async function POST() {
  // Insert mock data into database
  // ...
}
```

## Mock Data Statistics

### QC Records Breakdown:
- **Pass**: 8 records (53.3%)
- **Fail**: 4 records (26.7%)
- **Pending**: 3 records (20%)
- **Total Inspected**: 1,625 units
- **Average Batch Size**: ~108 units

### Employee Breakdown:
- **By Department**:
  - Production: 10 employees
  - QC: 6 employees
  - Maintenance: 5 employees
  - Admin: 4 employees

- **By Role**:
  - ADMIN: 3 employees
  - SUPERVISOR: 5 employees
  - OPERATOR: 17 employees

- **By Shift**:
  - Day: 15 employees
  - Night: 10 employees

- **By Status**:
  - Active: 23 employees
  - On Leave: 1 employee
  - Inactive: 1 employee

## Sample Data Highlights

### QC Records:
- **BATCH-2024-001**: Widget A, 100 units, PASS ✅
- **BATCH-2024-003**: Component X, 75 units, FAIL ❌ (Surface finish defects)
- **BATCH-2024-006**: Widget C, 80 units, FAIL ❌ (Dimensional tolerance issues)
- **BATCH-2024-010**: Component X, 130 units, FAIL ❌ (Material defects)

### Employees:
- **EMP001**: John Smith - Production Operator (Day)
- **EMP002**: Sarah Johnson - QC Supervisor (Day)
- **EMP004**: Emily Brown - Admin (Day)
- **EMP017**: Thomas Allen - Production Operator (Night, On Leave)
- **EMP021**: Daniel Lopez - Production Operator (Day, Inactive)

## Customization

You can easily customize the mock data by:
1. Editing the TypeScript files in `lib/mock-data/`
2. Adding more records
3. Changing values to match your needs
4. Updating the seed SQL files

## Notes

- All dates are in 2024
- Phone numbers follow pattern: +1234567XXX
- Emails follow pattern: firstname.lastname@erp.com
- Employee IDs follow pattern: EMPXXX (001-025)
- Batch numbers follow pattern: BATCH-2024-XXX (001-015)
