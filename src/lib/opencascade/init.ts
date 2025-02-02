import type { OpenCascadeInstance } from './types'

let ocInstance: OpenCascadeInstance | null = null

export const initializeOpenCascade = async () => {
  if (!ocInstance) {
    try {
      const OpenCascade = await import('opencascade.js')
      ocInstance = await OpenCascade.default()
      console.log('OpenCascade.js initialized successfully')
    } catch (error) {
      console.error('Failed to initialize OpenCascade.js:', error)
      throw error
    }
  }
  return ocInstance
}

export const getOpenCascade = () => {
  if (!ocInstance) {
    throw new Error('OpenCascade.js not initialized. Call initializeOpenCascade() first.')
  }
  return ocInstance
}

// Helper function to ensure OpenCascade is initialized before use
export const withOpenCascade = async <T>(callback: (oc: OpenCascadeInstance) => T): Promise<T> => {
  const oc = await initializeOpenCascade()
  return callback(oc)
}

// Clean up OpenCascade instance
export const cleanupOpenCascade = () => {
  if (ocInstance) {
    // Add any necessary cleanup here
    ocInstance = null
  }
} 