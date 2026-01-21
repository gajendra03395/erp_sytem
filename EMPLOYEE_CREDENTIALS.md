# Employee Credentials System

## How Employees Get Their Login Credentials

### For Admins: Creating Employee Credentials

1. **Login as Admin**
   - Email: `admin@erp.com`
   - Password: `admin123`

2. **Navigate to Admin Panel**
   - Click the hamburger menu (mobile) or go to the sidebar
   - Look for **"Administration"** section (ADMIN only)
   - Click **"Manage Employees"**

3. **Create New Employee**
   - Click **"+ Add New Employee"** button
   - Fill in the form:
     - **Name**: Employee's full name (e.g., "John Doe")
     - **Email**: Employee's email (e.g., "john@company.com")
     - **Role**: Select role (ADMIN, SUPERVISOR, or OPERATOR)
   - Click **"Create Employee"**

4. **Share Credentials with Employee**
   - System automatically generates a secure 16-character password
   - **IMPORTANT**: The plaintext password is ONLY shown once to the admin
   - Click the **copy button** to copy the password
   - Share with employee via secure channel (email, message, etc.)
   - **Message template**: 
     ```
     Your ERP login credentials:
     Email: john@company.com
     Password: [paste generated password]
     
     Please keep these secure and change your password after first login.
     ```

### For Employees: Logging In

1. Go to `/auth/login` (or homepage redirects there automatically)
2. Enter the email and password provided by admin
3. Click **"Sign In"**
4. Access the dashboard and all available features based on your role

---

## Testing the System

### Test Credentials (Already in System)

| Email | Password | Role |
|-------|----------|------|
| `admin@erp.com` | `admin123` | ADMIN |
| `emp@erp.com` | `emp123` | OPERATOR |
| `supervisor@erp.com` | `supervisor123` | SUPERVISOR |

### Create Test Employee

1. Log in as admin
2. Go to Admin > Manage Employees
3. Create new employee:
   - **Name**: `Test User`
   - **Email**: `test@company.com`
   - **Role**: `OPERATOR`
4. Copy the generated password
5. Log out
6. Log in with `test@company.com` and the generated password
7. Verify you can access the dashboard

---

## Technical Details

### Storage

- **Credentials File**: `public/credentials.json`
- **Session Storage**: Browser `localStorage`
- **Authentication**: JWT tokens (base64 encoded)
- **Password**: Auto-generated 16-character random strings

### API Endpoints

**Create Employee (POST)**
```
POST /api/auth/employees
Content-Type: application/json

{
  "name": "Employee Name",
  "email": "email@company.com",
  "role": "OPERATOR"
}

Response:
{
  "credential": {
    "id": "uuid",
    "name": "Employee Name",
    "email": "email@company.com",
    "password": "GeneratedPassword123",
    "role": "OPERATOR",
    "created_at": "2024-01-20T10:00:00Z"
  }
}
```

**Get All Employees (GET)**
```
GET /api/auth/employees

Response:
{
  "credentials": [
    { ... employee data ... },
    { ... employee data ... }
  ]
}
```

**Delete Employee (DELETE)**
```
DELETE /api/auth/employees
Content-Type: application/json

{
  "email": "email@company.com"
}
```

---

## Role-Based Access

### Admin Role
- ✅ Create new employee credentials
- ✅ View all employees
- ✅ Delete employees
- ✅ Access to: Dashboard, Inventory, Employees, Machines, Quality Control, **Admin Panel**

### Supervisor Role
- ❌ Cannot create/manage credentials (read-only)
- ✅ Access to: Dashboard, Employees, Quality Control
- ✅ View reports and statistics

### Operator Role
- ❌ Cannot create/manage credentials
- ✅ Access to: Dashboard, Inventory, Machines
- ✅ View and update their assigned tasks

---

## Future Enhancements

- [ ] Email notifications when credentials are created
- [ ] Password change functionality for employees
- [ ] Bulk employee import (CSV)
- [ ] Admin password reset
- [ ] Credential history/audit log
- [ ] Temporary password expiry
- [ ] Two-factor authentication (2FA)
