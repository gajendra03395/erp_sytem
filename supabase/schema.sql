-- Manufacturing ERP Database Schema for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
    employee_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EMPLOYEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50) NOT NULL CHECK (department IN ('production', 'qc', 'maintenance', 'admin')),
    role VARCHAR(20) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'SUPERVISOR', 'OPERATOR')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    shift VARCHAR(20) NOT NULL DEFAULT 'Day' CHECK (shift IN ('Day', 'Night')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- ============================================
-- INVENTORY TABLE (Raw Materials & Finished Goods)
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('raw_material', 'finished_good')),
    stock_level DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    reorder_point DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    last_stock_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_level ON inventory(stock_level);

-- ============================================
-- MACHINES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_name VARCHAR(255) NOT NULL,
    machine_type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'idle' CHECK (status IN ('running', 'under_maintenance', 'idle')),
    last_service_date DATE NOT NULL,
    next_service_date DATE,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_machines_last_service ON machines(last_service_date);

-- ============================================
-- MAINTENANCE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    machine_name VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    technician_name VARCHAR(255),
    notes TEXT,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_machine_id ON maintenance_logs(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_service_date ON maintenance_logs(service_date);

-- ============================================
-- QUALITY CONTROL (QC) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quality_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_no VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity_inspected DECIMAL(10, 2) NOT NULL DEFAULT 0,
    result VARCHAR(10) NOT NULL CHECK (result IN ('pass', 'fail', 'pending')),
    inspector_name VARCHAR(255) NOT NULL,
    inspector_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    inspection_date DATE NOT NULL,
    defect_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qc_batch_no ON quality_control(batch_no);
CREATE INDEX IF NOT EXISTS idx_qc_result ON quality_control(result);
CREATE INDEX IF NOT EXISTS idx_qc_inspection_date ON quality_control(inspection_date);
CREATE INDEX IF NOT EXISTS idx_qc_inspector_id ON quality_control(inspector_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_control_updated_at BEFORE UPDATE ON quality_control
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access" ON employees
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access" ON inventory
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access" ON machines
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access" ON quality_control
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access" ON maintenance_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Employees can read their own data and related data
CREATE POLICY "Employees can read employees" ON employees
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'employee'));

CREATE POLICY "Employees can read inventory" ON inventory
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'employee'));

CREATE POLICY "Employees can read machines" ON machines
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'employee'));

CREATE POLICY "Employees can read QC records" ON quality_control
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'employee'));

CREATE POLICY "Employees can read maintenance logs" ON maintenance_logs
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'employee'));

-- Policy: Maintenance employees can insert maintenance logs
CREATE POLICY "Maintenance employees can insert logs" ON maintenance_logs
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (
            SELECT 1 FROM employees
            WHERE employees.id::text = auth.jwt() ->> 'employee_id'
            AND employees.department = 'maintenance'
        )
    );

-- Policy: QC employees can insert QC records
CREATE POLICY "QC employees can insert QC" ON quality_control
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (
            SELECT 1 FROM employees
            WHERE employees.id::text = auth.jwt() ->> 'employee_id'
            AND employees.department = 'qc'
        )
    );
