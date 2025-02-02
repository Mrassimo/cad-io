import { OpenCascadeInstance } from 'opencascade.js'
import { withOpenCascade } from './init'

export interface ShapeParams {
  width?: number
  height?: number
  depth?: number
  radius?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export class ShapeGenerator {
  private static async createBox(oc: OpenCascadeInstance, params: ShapeParams) {
    const { width = 1, height = 1, depth = 1, position = [0, 0, 0] } = params
    const [x, y, z] = position
    
    return new oc.BRepPrimAPI_MakeBox(
      new oc.gp_Pnt(x, y, z),
      width,
      height,
      depth
    ).Shape()
  }

  private static async createCylinder(oc: OpenCascadeInstance, params: ShapeParams) {
    const { radius = 0.5, height = 1, position = [0, 0, 0] } = params
    const [x, y, z] = position

    return new oc.BRepPrimAPI_MakeCylinder(
      new oc.gp_Ax2(new oc.gp_Pnt(x, y, z), new oc.gp_Dir(0, 0, 1)),
      radius,
      height
    ).Shape()
  }

  private static async createSphere(oc: OpenCascadeInstance, params: ShapeParams) {
    const { radius = 0.5, position = [0, 0, 0] } = params
    const [x, y, z] = position

    return new oc.BRepPrimAPI_MakeSphere(
      new oc.gp_Pnt(x, y, z),
      radius
    ).Shape()
  }

  static async executeOperation(operation: string, params: ShapeParams) {
    return withOpenCascade(async (oc) => {
      switch (operation.toLowerCase()) {
        case 'box':
          return this.createBox(oc, params)
        case 'cylinder':
          return this.createCylinder(oc, params)
        case 'sphere':
          return this.createSphere(oc, params)
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }
    })
  }

  static async booleanUnion(shape1: any, shape2: any) {
    return withOpenCascade(async (oc) => {
      const boolOp = new oc.BRepAlgoAPI_Fuse(shape1, shape2)
      boolOp.Build()
      return boolOp.Shape()
    })
  }

  static async booleanSubtract(shape1: any, shape2: any) {
    return withOpenCascade(async (oc) => {
      const boolOp = new oc.BRepAlgoAPI_Cut(shape1, shape2)
      boolOp.Build()
      return boolOp.Shape()
    })
  }

  static async fillet(shape: any, radius: number, edges: any[]) {
    return withOpenCascade(async (oc) => {
      const fillet = new oc.BRepFilletAPI_MakeFillet(shape)
      edges.forEach(edge => {
        fillet.Add(radius, edge)
      })
      return fillet.Shape()
    })
  }
} 