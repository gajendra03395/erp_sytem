-- Sample Data for Manufacturing ERP

-- Insert Sample Employees
INSERT INTO employees (employee_id, name, email, phone, department, role, status, shift) VALUES
('EMP001', 'John Smith', 'john.smith@erp.com', '+1234567890', 'production', 'OPERATOR', 'active', 'Day'),
('EMP002', 'Sarah Johnson', 'sarah.johnson@erp.com', '+1234567891', 'qc', 'SUPERVISOR', 'active', 'Day'),
('EMP003', 'Mike Davis', 'mike.davis@erp.com', '+1234567892', 'maintenance', 'OPERATOR', 'active', 'Night'),
('EMP004', 'Emily Brown', 'emily.brown@erp.com', '+1234567893', 'admin', 'ADMIN', 'active', 'Day'),
('EMP005', 'David Wilson', 'david.wilson@erp.com', '+1234567894', 'production', 'OPERATOR', 'active', 'Night'),
('EMP006', 'Lisa Anderson', 'lisa.anderson@erp.com', '+1234567895', 'qc', 'SUPERVISOR', 'active', 'Night'),
('EMP007', 'Robert Taylor', 'robert.taylor@erp.com', '+1234567896', 'production', 'OPERATOR', 'active', 'Day'),
('EMP008', 'Jennifer Martinez', 'jennifer.martinez@erp.com', '+1234567897', 'qc', 'OPERATOR', 'active', 'Day'),
('EMP009', 'James White', 'james.white@erp.com', '+1234567898', 'maintenance', 'SUPERVISOR', 'active', 'Day'),
('EMP010', 'Maria Garcia', 'maria.garcia@erp.com', '+1234567899', 'production', 'OPERATOR', 'active', 'Night'),
('EMP011', 'William Lee', 'william.lee@erp.com', '+1234567900', 'production', 'OPERATOR', 'active', 'Day'),
('EMP012', 'Patricia Harris', 'patricia.harris@erp.com', '+1234567901', 'qc', 'OPERATOR', 'active', 'Night'),
('EMP013', 'Michael Clark', 'michael.clark@erp.com', '+1234567902', 'maintenance', 'OPERATOR', 'active', 'Night'),
('EMP014', 'Linda Lewis', 'linda.lewis@erp.com', '+1234567903', 'admin', 'ADMIN', 'active', 'Day'),
('EMP015', 'Richard Walker', 'richard.walker@erp.com', '+1234567904', 'production', 'SUPERVISOR', 'active', 'Day'),
('EMP016', 'Barbara Hall', 'barbara.hall@erp.com', '+1234567905', 'qc', 'OPERATOR', 'active', 'Day'),
('EMP017', 'Thomas Allen', 'thomas.allen@erp.com', '+1234567906', 'production', 'OPERATOR', 'on_leave', 'Night'),
('EMP018', 'Susan Young', 'susan.young@erp.com', '+1234567907', 'maintenance', 'OPERATOR', 'active', 'Day'),
('EMP019', 'Charles King', 'charles.king@erp.com', '+1234567908', 'production', 'OPERATOR', 'active', 'Night'),
('EMP020', 'Jessica Wright', 'jessica.wright@erp.com', '+1234567909', 'qc', 'SUPERVISOR', 'active', 'Day'),
('EMP021', 'Daniel Lopez', 'daniel.lopez@erp.com', '+1234567910', 'production', 'OPERATOR', 'inactive', 'Day'),
('EMP022', 'Karen Scott', 'karen.scott@erp.com', '+1234567911', 'maintenance', 'OPERATOR', 'active', 'Night'),
('EMP023', 'Matthew Green', 'matthew.green@erp.com', '+1234567912', 'production', 'OPERATOR', 'active', 'Day'),
('EMP024', 'Nancy Adams', 'nancy.adams@erp.com', '+1234567913', 'qc', 'OPERATOR', 'active', 'Night'),
('EMP025', 'Anthony Baker', 'anthony.baker@erp.com', '+1234567914', 'admin', 'ADMIN', 'active', 'Day');

-- Insert Sample Inventory Items
INSERT INTO inventory (item_name, category, stock_level, unit, reorder_point, supplier, last_stock_date) VALUES
('Steel Sheets', 'raw_material', 5000.00, 'kg', 1000.00, 'ABC Suppliers', '2024-03-15'),
('Aluminum Rods', 'raw_material', 8.00, 'kg', 500.00, 'XYZ Metals', '2024-03-10'),
('Plastic Pellets', 'raw_material', 8000.00, 'kg', 2000.00, 'Polymer Co.', '2024-03-12'),
('Widget A', 'finished_good', 5.00, 'units', 300.00, 'Internal Production', '2024-03-18'),
('Widget B', 'finished_good', 2200.00, 'units', 500.00, 'Internal Production', '2024-03-16'),
('Component X', 'finished_good', 3500.00, 'units', 700.00, 'Internal Production', '2024-03-14');

-- Insert Sample Machines
INSERT INTO machines (machine_name, machine_type, status, last_service_date, next_service_date, location) VALUES
('CNC Machine 01', 'CNC Milling', 'running', '2024-01-15', '2024-04-15', 'Production Floor A'),
('Press Machine 02', 'Hydraulic Press', 'running', '2024-02-01', '2024-05-01', 'Production Floor B'),
('Assembly Line 03', 'Assembly', 'running', '2024-01-20', '2024-04-20', 'Production Floor A'),
('Welding Station 04', 'Welding', 'under_maintenance', '2024-03-01', '2024-06-01', 'Production Floor B'),
('Quality Tester 05', 'Testing Equipment', 'idle', '2024-02-15', '2024-05-15', 'QC Lab');

-- Insert Sample QC Records
INSERT INTO quality_control (batch_no, product_name, quantity_inspected, result, inspector_name, inspector_id, inspection_date, defect_reason, notes) VALUES
('BATCH-2024-001', 'Widget A', 100, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-15', NULL, 'All parameters within limits. Excellent quality control.'),
('BATCH-2024-002', 'Widget B', 150, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-16', NULL, 'Excellent quality. All tests passed with flying colors.'),
('BATCH-2024-003', 'Component X', 75, 'fail', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-17', 'Minor defects found in surface finish. Some units have scratches and dents. Requires rework before approval.', 'Rework required. Contact production team.'),
('BATCH-2024-004', 'Widget A', 200, 'pending', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-18', NULL, 'Inspection in progress. Results pending.'),
('BATCH-2024-005', 'Component Y', 120, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-19', NULL, 'Perfect quality. Ready for shipment.'),
('BATCH-2024-006', 'Widget C', 80, 'fail', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-20', 'Dimensional tolerance issues. 15 units out of specification. Requires recalibration of production equipment.', 'Critical issue. Production line needs adjustment.'),
('BATCH-2024-007', 'Component Z', 90, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-21', NULL, 'All quality checks passed. Excellent batch.'),
('BATCH-2024-008', 'Widget A', 110, 'pending', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-22', NULL, 'Awaiting final test results.'),
('BATCH-2024-009', 'Widget B', 95, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-23', NULL, 'High quality standards maintained. Approved for distribution.'),
('BATCH-2024-010', 'Component X', 130, 'fail', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-24', 'Material defects detected. 8 units have cracks. Suspected issue with raw material quality. Need to investigate supplier.', 'Material quality issue. Contact procurement.'),
('BATCH-2024-011', 'Widget D', 105, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-25', NULL, 'Perfect inspection results. All criteria met.'),
('BATCH-2024-012', 'Component Y', 140, 'pending', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-26', NULL, 'Inspection scheduled. Results expected by end of day.'),
('BATCH-2024-013', 'Widget A', 125, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-27', NULL, 'Excellent batch quality. Ready for next stage.'),
('BATCH-2024-014', 'Widget C', 85, 'fail', 'Lisa Anderson', (SELECT id FROM employees WHERE employee_id = 'EMP006'), '2024-03-28', 'Color mismatch in 12 units. Paint quality inconsistent. Requires repainting of affected units.', 'Cosmetic defect. Non-critical but needs correction.'),
('BATCH-2024-015', 'Component Z', 115, 'pass', 'Sarah Johnson', (SELECT id FROM employees WHERE employee_id = 'EMP002'), '2024-03-29', NULL, 'Top quality. Exceeds standards.');

-- Insert Sample Maintenance Logs
INSERT INTO maintenance_logs (machine_id, machine_name, service_date, service_type, technician_name, cost, notes) VALUES
((SELECT id FROM machines WHERE machine_name = 'CNC Machine 01'), 'CNC Machine 01', '2024-01-15', 'Routine Maintenance', 'Mike Davis', 500.00, 'Replaced filters and lubricated moving parts'),
((SELECT id FROM machines WHERE machine_name = 'Press Machine 02'), 'Press Machine 02', '2024-02-01', 'Preventive Maintenance', 'Mike Davis', 750.00, 'Hydraulic system check and calibration'),
((SELECT id FROM machines WHERE machine_name = 'Assembly Line 03'), 'Assembly Line 03', '2024-01-20', 'Routine Maintenance', 'Mike Davis', 300.00, 'Belt replacement and alignment'),
((SELECT id FROM machines WHERE machine_name = 'Welding Station 04'), 'Welding Station 04', '2024-03-01', 'Repair', 'Mike Davis', 1200.00, 'Fixed power supply issue'),
((SELECT id FROM machines WHERE machine_name = 'Quality Tester 05'), 'Quality Tester 05', '2024-02-15', 'Calibration', 'Mike Davis', 400.00, 'Sensor calibration and accuracy check');
