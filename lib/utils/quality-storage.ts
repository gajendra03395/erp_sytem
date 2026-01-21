import fs from 'fs'
import path from 'path'
import type { QualityControl, CreateQC, UpdateQC } from '@/types/qc'

const QUALITY_FILE = path.join(process.cwd(), 'public', 'quality-control.json')

// Get all quality checks from file
export function getStoredQualityChecks(): QualityControl[] {
  try {
    if (fs.existsSync(QUALITY_FILE)) {
      const data = fs.readFileSync(QUALITY_FILE, 'utf-8')
      const qualityChecks = JSON.parse(data)
      // Convert date strings back to Date objects
      return qualityChecks.map((check: any) => ({
        ...check,
        inspection_date: new Date(check.inspection_date),
        created_at: new Date(check.created_at),
        updated_at: new Date(check.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading quality checks:', err)
  }
  return []
}

// Alias for backward compatibility
export function getStoredQCRecords(): QualityControl[] {
  return getStoredQualityChecks()
}

// Save quality checks to file
export function saveQualityChecks(qualityChecks: QualityControl[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(QUALITY_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(QUALITY_FILE, JSON.stringify(qualityChecks, null, 2))
  } catch (err) {
    console.error('Error saving quality checks:', err)
    throw new Error('Failed to save quality checks')
  }
}

// Add new quality check
export function addStoredQualityCheck(checkData: CreateQC): QualityControl {
  const qualityChecks = getStoredQualityChecks()
  
  const newCheck: QualityControl = {
    id: Date.now().toString(),
    ...checkData,
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedChecks = [...qualityChecks, newCheck]
  saveQualityChecks(updatedChecks)
  
  return newCheck
}

// Update quality check
export function updateStoredQualityCheck(id: string, updates: UpdateQC): QualityControl {
  const qualityChecks = getStoredQualityChecks()
  const checkIndex = qualityChecks.findIndex(check => check.id === id)
  
  if (checkIndex === -1) {
    throw new Error('Quality check not found')
  }
  
  const updatedCheck = {
    ...qualityChecks[checkIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  qualityChecks[checkIndex] = updatedCheck
  saveQualityChecks(qualityChecks)
  
  return updatedCheck
}

// Delete quality check
export function deleteStoredQualityCheck(id: string): void {
  const qualityChecks = getStoredQualityChecks()
  const updatedChecks = qualityChecks.filter(check => check.id !== id)
  
  if (qualityChecks.length === updatedChecks.length) {
    throw new Error('Quality check not found')
  }
  
  saveQualityChecks(updatedChecks)
}

// Get quality check by ID
export function getStoredQualityCheckById(id: string): QualityControl | null {
  const qualityChecks = getStoredQualityChecks()
  return qualityChecks.find(check => check.id === id) || null
}
