export interface OpenCascadeInstance {
  BRepPrimAPI_MakeBox: any;
  BRepPrimAPI_MakeCylinder: any;
  BRepPrimAPI_MakeSphere: any;
  BRepAlgoAPI_Fuse: any;
  BRepAlgoAPI_Cut: any;
  BRepFilletAPI_MakeFillet: any;
  gp_Pnt: any;
  gp_Dir: any;
  gp_Ax2: any;
}

export interface OpenCascadeConfig {
  locateFile?: (file: string) => string;
  wasmBinary?: ArrayBuffer;
} 