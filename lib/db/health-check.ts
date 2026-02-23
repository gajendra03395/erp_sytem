import { prisma } from './prisma-client'

export class DatabaseHealthCheck {
  private static lastCheck: number = 0
  private static isHealthy: boolean = false
  private static checkInterval: number = 30000 // 30 seconds

  static async checkConnection(): Promise<boolean> {
    const now = Date.now()
    
    // Cache the result to avoid too frequent checks
    if (now - this.lastCheck < this.checkInterval && this.isHealthy) {
      return true
    }

    try {
      // Simple query to test connection
      await prisma.$queryRaw`SELECT 1 as health_check`
      
      this.isHealthy = true
      this.lastCheck = now
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      this.isHealthy = false
      this.lastCheck = now
      return false
    }
  }

  static async waitForConnection(maxRetries: number = 3, delay: number = 1000): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      const isConnected = await this.checkConnection()
      if (isConnected) {
        return true
      }
      
      if (i < maxRetries - 1) {
        console.log(`Database connection attempt ${i + 1} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
    
    return false
  }

  static getStatus(): { isHealthy: boolean; lastCheck: number } {
    return {
      isHealthy: this.isHealthy,
      lastCheck: this.lastCheck
    }
  }
}
