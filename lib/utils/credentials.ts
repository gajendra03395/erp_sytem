import fs from 'fs'
import path from 'path'

const CREDENTIALS_FILE = path.join(process.cwd(), 'public', 'credentials.json')

export interface CredentialUser {
  id: string
  name: string
  email: string
  employee_id: string
  password: string
  role: string
  created_at: string
}

// Generate random password
export function generatePassword(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Get all stored credentials
export function getStoredCredentials(): CredentialUser[] {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('Error reading credentials:', err)
  }
  return []
}

// Save credentials to file
export function saveCredentials(credentials: CredentialUser[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(CREDENTIALS_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
  } catch (err) {
    console.error('Error saving credentials:', err)
    throw new Error('Failed to save credentials')
  }
}

// Add new employee credentials
export function addEmployeeCredentials(
  employee: {
    id: string
    name: string
    email: string
    employee_id: string
    role: string
  }
): { password: string; credentials: CredentialUser } {
  const password = generatePassword()
  const credentials: CredentialUser = {
    ...employee,
    password,
    created_at: new Date().toISOString(),
  }

  const existingCredentials = getStoredCredentials()
  const updatedCredentials = [...existingCredentials, credentials]
  saveCredentials(updatedCredentials)

  return { password, credentials }
}

// Update employee credentials
export function updateEmployeeCredentials(
  employeeId: string,
  updates: Partial<CredentialUser>
): void {
  const existingCredentials = getStoredCredentials()
  const updatedCredentials = existingCredentials.map(cred => 
    cred.employee_id === employeeId ? { ...cred, ...updates } : cred
  )
  saveCredentials(updatedCredentials)
}

// Delete employee credentials
export function deleteEmployeeCredentials(employeeId: string): void {
  const existingCredentials = getStoredCredentials()
  const updatedCredentials = existingCredentials.filter(cred => cred.employee_id !== employeeId)
  saveCredentials(updatedCredentials)
}
