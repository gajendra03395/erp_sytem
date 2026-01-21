import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Store user credentials in a JSON file (for demo purposes)
const CREDENTIALS_FILE = path.join(process.cwd(), 'public', 'credentials.json')

interface UserCredential {
  id: string
  name: string
  email: string
  employee_id: string
  password: string
  role: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR'
  created_at: string
}

function getCredentials(): UserCredential[] {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading credentials:', error)
    return []
  }
}

function saveCredentials(credentials: UserCredential[]): void {
  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
  } catch (error) {
    console.error('Error saving credentials:', error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { emails } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Valid emails array is required' },
        { status: 400 }
      )
    }

    let deletedCount = 0
    const errors: string[] = []

    // Get current credentials
    const credentials = getCredentials()

    // Filter out the emails to delete
    const updatedCredentials = credentials.filter(cred => {
      if (emails.includes(cred.email)) {
        deletedCount++
        return false // Remove this credential
      }
      return true // Keep this credential
    })

    // Save updated credentials
    saveCredentials(updatedCredentials)

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `${deletedCount} employee(s) deleted successfully${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk delete' },
      { status: 500 }
    )
  }
}
