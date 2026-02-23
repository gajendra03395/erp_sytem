// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined'

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
    if (isBrowser) {
      const data = localStorage.getItem('erp_credentials')
      if (data) {
        return JSON.parse(data)
      }
    }
  } catch (err) {
    console.error('Error reading credentials:', err)
  }
  return []
}

// Save credentials to storage
export function saveCredentials(credentials: CredentialUser[]): void {
  try {
    if (isBrowser) {
      localStorage.setItem('erp_credentials', JSON.stringify(credentials, null, 2))
    }
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
