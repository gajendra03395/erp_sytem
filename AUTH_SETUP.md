# Authentication System

## Overview

Manufacturing ERP has a complete authentication system with login/logout functionality.

## Login Credentials

### Test Users

**Admin User:**
- Email: `admin@erp.com`
- Password: `admin123`
- Role: ADMIN

**Employee User:**
- Email: `emp@erp.com`
- Password: `emp123`
- Role: OPERATOR

**Supervisor User:**
- Email: `supervisor@erp.com`
- Password: `supervisor123`
- Role: SUPERVISOR

## How It Works

### 1. Login Flow

```
User -> Login Page (/auth/login)
   ↓
User enters email/password
   ↓
POST /api/auth/login
   ↓
API validates credentials against mock database
   ↓
If valid:
   - Generate token (base64 encoded JWT)
   - Return user data (name, email, role)
   - Store token in localStorage
   ↓
Redirect to /dashboard
```

### 2. Session Management

- **Token Storage:** localStorage as `auth_token`
- **User Info Stored:**
  - `user_role` - User's role (ADMIN, SUPERVISOR, OPERATOR)
  - `user_name` - Full name
  - `user_email` - Email address

### 3. Role-Based Features

- **ADMIN**: Full access to all features
- **SUPERVISOR**: Can manage employees and machines
- **OPERATOR**: Can view and log QC/inventory data

## Authentication Files

```
app/
  auth/
    login/
      page.tsx          # Login page component
  api/
    auth/
      login/
        route.ts        # Login endpoint
      logout/
        route.ts        # Logout endpoint

components/
  providers/
    AuthProvider.tsx    # Authentication context & hooks
```

## Key Functions

### useAuth Hook

```typescript
const { 
  currentRole,      // Current user's role
  userName,         // User's name
  userEmail,        // User's email
  isAuthenticated,  // Is user logged in?
  logout            // Logout function
} = useAuth()
```

### Login API

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@erp.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "base64encodedtoken",
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@erp.com",
    "role": "ADMIN"
  }
}
```

### Logout API

**Endpoint:** `POST /api/auth/logout`

Clears authentication data and redirects to login page.

## Features

✅ **Secure Login** - Password validation
✅ **Session Storage** - Token stored in localStorage
✅ **Role Management** - Role-based access control
✅ **Auto-Redirect** - Redirects to login if not authenticated
✅ **User Info Display** - Shows user name and email in sidebar
✅ **Logout** - Clears session and redirects to login

## Adding New Users

To add new test users, edit `/app/api/auth/login/route.ts`:

```typescript
const MOCK_USERS = [
  {
    id: '4',
    name: 'New User',
    email: 'newuser@erp.com',
    password: 'password123',
    role: 'SUPERVISOR' as const,
  },
  // ... other users
]
```

## Database Integration

To connect with a real database (Supabase/Prisma):

1. Update `/app/api/auth/login/route.ts` to query users from database
2. Implement password hashing (bcrypt recommended)
3. Use JWT tokens with expiration
4. Add refresh token mechanism

### Example with Supabase:

```typescript
import { supabase } from '@/lib/db/supabase'

const user = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single()

// Validate password with bcrypt
```

## Security Considerations

⚠️ **Current State:** Mock authentication for development
✅ **For Production:**

1. **Hash Passwords:** Use bcrypt or similar
2. **Use HTTPS:** All auth requests over HTTPS
3. **JWT Tokens:** Add expiration and refresh mechanism
4. **Secure Cookies:** Store tokens in httpOnly cookies
5. **CSRF Protection:** Add CSRF tokens
6. **Rate Limiting:** Limit login attempts
7. **Session Timeout:** Auto-logout after inactivity

## Troubleshooting

### "Invalid email or password"
- Check spelling of test credentials
- Ensure using exact case-sensitive email/password

### Session Lost After Refresh
- Tokens stored in localStorage (not persistent across hard refresh)
- Consider using cookies for persistence

### Can't Access Protected Routes
- Login first at `/auth/login`
- Check that auth_token exists in localStorage

## Testing Login

1. Go to `http://localhost:3000`
2. You'll be redirected to login page
3. Enter test credentials (admin@erp.com / admin123)
4. Click "Sign In"
5. You'll be redirected to dashboard
6. Click logout in sidebar to test logout
