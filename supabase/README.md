# Supabase Database Setup

This directory contains the SQL schema and migrations for the Manufacturing ERP system using Supabase (PostgreSQL).

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run the Schema**
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Execute the script

3. **Seed Sample Data (Optional)**
   - In the SQL Editor, run `seed.sql` to insert sample data

4. **Configure Environment Variables**
   - Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Database Tables

- **users**: Authentication and user management
- **employees**: Employee directory with departments and status
- **inventory**: Raw materials and finished goods tracking
- **machines**: Machine status and maintenance tracking
- **quality_control**: QC inspection logs

## Row Level Security (RLS)

The schema includes RLS policies:
- Admins have full access to all tables
- Employees can read data from all tables
- QC employees can insert QC records

Adjust these policies based on your security requirements.
