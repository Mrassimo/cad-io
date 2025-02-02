import initOpenCascade, { OpenCascadeInstance } from 'opencascade.js'

let ocInstance: OpenCascadeInstance | null = null

export const initializeOpenCascade = async () => {
  if (!ocInstance) {
    try {
      // Initialize with explicit locateFile option for wasm loading
      ocInstance = await initOpenCascade({
        locateFile: (file: string) => {
          if (file.endsWith('.wasm')) {
            // Use the static path for wasm files
            return `/static/wasm/${file}`
          }
          return file
        },
      })
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