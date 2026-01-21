import fs from 'fs'
import path from 'path'
import type { Machine, CreateMachine, UpdateMachine } from '@/types/machine'

const MACHINES_FILE = path.join(process.cwd(), 'public', 'machines.json')

// Get all machines from file
export function getStoredMachines(): Machine[] {
  try {
    if (fs.existsSync(MACHINES_FILE)) {
      const data = fs.readFileSync(MACHINES_FILE, 'utf-8')
      const machines = JSON.parse(data)
      // Convert date strings back to Date objects
      return machines.map((machine: any) => ({
        ...machine,
        created_at: new Date(machine.created_at),
        updated_at: new Date(machine.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading machines:', err)
  }
  return []
}

// Save machines to file
export function saveMachines(machines: Machine[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(MACHINES_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(MACHINES_FILE, JSON.stringify(machines, null, 2))
  } catch (err) {
    console.error('Error saving machines:', err)
    throw new Error('Failed to save machines')
  }
}

// Add new machine
export function addStoredMachine(machineData: CreateMachine): Machine {
  const machines = getStoredMachines()
  
  // Check if machine name already exists
  if (machines.some(machine => machine.machine_name === machineData.machine_name)) {
    throw new Error(`Machine ${machineData.machine_name} already exists`)
  }
  
  const newMachine: Machine = {
    id: Date.now().toString(),
    machine_name: machineData.machine_name,
    machine_type: machineData.machine_type,
    status: machineData.status || 'idle',
    last_service_date: machineData.last_service_date,
    next_service_date: machineData.next_service_date,
    location: machineData.location,
    notes: machineData.notes,
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedMachines = [...machines, newMachine]
  saveMachines(updatedMachines)
  
  return newMachine
}

// Update machine
export function updateStoredMachine(id: string, updates: UpdateMachine): Machine {
  const machines = getStoredMachines()
  const machineIndex = machines.findIndex(machine => machine.id === id)
  
  if (machineIndex === -1) {
    throw new Error('Machine not found')
  }
  
  const updatedMachine = {
    ...machines[machineIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  machines[machineIndex] = updatedMachine
  saveMachines(machines)
  
  return updatedMachine
}

// Delete machine
export function deleteStoredMachine(id: string): void {
  const machines = getStoredMachines()
  const updatedMachines = machines.filter(machine => machine.id !== id)
  
  if (machines.length === updatedMachines.length) {
    throw new Error('Machine not found')
  }
  
  saveMachines(updatedMachines)
}

// Get machine by ID
export function getStoredMachineById(id: string): Machine | null {
  const machines = getStoredMachines()
  return machines.find(machine => machine.id === id) || null
}
