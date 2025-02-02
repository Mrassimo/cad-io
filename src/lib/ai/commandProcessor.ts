import { ShapeParams } from '../opencascade/shapes'

export interface CADCommand {
  operation: string
  params: ShapeParams
  sequence?: CADCommand[]
}

export interface ProcessedCommand {
  commands: CADCommand[]
  context: string
  error?: string
}

export class CommandProcessor {
  private static primitiveKeywords = {
    box: ['box', 'cube', 'block', 'rectangular'],
    cylinder: ['cylinder', 'tube', 'pipe', 'circular'],
    sphere: ['sphere', 'ball', 'round'],
  }

  private static dimensionKeywords = {
    width: ['width', 'wide', 'across'],
    height: ['height', 'tall', 'high'],
    depth: ['depth', 'deep', 'thick'],
    radius: ['radius', 'diameter', 'round'],
  }

  private static async extractDimensions(text: string): Promise<ShapeParams> {
    const params: ShapeParams = {}
    
    // Basic number extraction - this should be enhanced with more sophisticated NLP
    const numberPattern = /(\d+(\.\d+)?)\s*(mm|cm|m)?/g
    const matches = Array.from(text.matchAll(numberPattern))
    
    if (matches.length > 0) {
      // Simple assignment based on order - should be improved with context
      params.width = parseFloat(matches[0][1])
      if (matches.length > 1) params.height = parseFloat(matches[1][1])
      if (matches.length > 2) params.depth = parseFloat(matches[2][1])
    }

    return params
  }

  private static identifyPrimitive(text: string): string {
    for (const [primitive, keywords] of Object.entries(this.primitiveKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return primitive
      }
    }
    return 'box' // Default to box if no primitive is identified
  }

  static async processCommand(text: string): Promise<ProcessedCommand> {
    try {
      // This is a basic implementation - should be replaced with actual AI processing
      const operation = this.identifyPrimitive(text)
      const params = await this.extractDimensions(text)

      const command: CADCommand = {
        operation,
        params,
      }

      return {
        commands: [command],
        context: `Processed command to create a ${operation} with parameters: ${JSON.stringify(params)}`,
      }
    } catch (error) {
      return {
        commands: [],
        context: 'Failed to process command',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  static async processComplexCommand(text: string): Promise<ProcessedCommand> {
    // This method should be implemented to handle more complex operations
    // like "create a gaming mouse" which requires multiple shapes and operations
    return this.processCommand(text) // Fallback to simple processing for now
  }

  static async processSelectionCommand(text: string, selection: any): Promise<ProcessedCommand> {
    // This method should be implemented to handle commands that operate on selections
    // like "round these edges" or "make this part taller"
    return {
      commands: [],
      context: 'Selection commands not implemented yet',
      error: 'Not implemented',
    }
  }
} 