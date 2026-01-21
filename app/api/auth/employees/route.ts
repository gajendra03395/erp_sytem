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
      const parsed = JSON.parse(data)
      // Ensure array format
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (err) {
    console.error('Error reading credentials:', err)
  }
  return []
}

function saveCredentials(credentials: UserCredential[]) {
  try {
    const dir = path.dirname(CREDENTIALS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
  } catch (err) {
    console.error('Error saving credentials:', err)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Remove authorization check for now - add it back when proper auth is implemented
    const credentials = getCredentials()
    return NextResponse.json({ success: true, data: credentials })
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, employee_id, role } = await request.json()

    if (!name || !email || !employee_id || !role) {
      return NextResponse.json(
        { error: 'Name, email, employee ID, and role are required' },
        { status: 400 }
      )
    }

    // Generate random password
    const password = Math.random().toString(36).substring(2, 10) + 
                    Math.random().toString(36).substring(2, 10).toUpperCase()

    const credentials = getCredentials()
    
    // Check if email already exists
    if (credentials.some(c => c.email === email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Check if employee_id already exists
    if (credentials.some(c => c.employee_id === employee_id)) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      )
    }

    // Create new credential
    const newCredential: UserCredential = {
      id: Date.now().toString(),
      name,
      email,
      employee_id,
      password,
      role,
      created_at: new Date().toISOString(),
    }

    credentials.push(newCredential)
    saveCredentials(credentials)

    return NextResponse.json(
      {
        success: true,
        message: 'Employee credentials created successfully',
        credential: newCredential,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating credentials:', error)
    return NextResponse.json(
      { error: 'Failed to create credentials' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const credentials = getCredentials()
    const filtered = credentials.filter(c => c.email !== email)

    if (filtered.length === credentials.length) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    saveCredentials(filtered)

    return NextResponse.json({ success: true, message: 'Employee deleted' })
  } catch (error) {
    console.error('Error deleting credentials:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
