// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

export enum BufferType {
    ArrayBuffer = 0x8892,
    ElementArrayBuffer = 0x8893
}

export enum VertexWindingMode {
    ClockWise = 0x0900,
    CounterClockWise = 0x0901
}

export enum TextureWrapMode {
    Repeat = 0x2901, 
    ClampToEdge = 0x812F, 
    MirroredRepeat = 0x8370
}

export enum TextureFilterMode {
    Nearest = 0x2600,	 
    Linear = 0x2601, 
    NearestMipmapNearest = 0x2700, 
    LinearMipmapNearest = 0x2701, 
    NearestMipmapLinear = 0x2702, 
    LinearMipmapLinear = 0x2703
}

export enum ShaderType {
    Vertex = 0x8B31,
    Fragment = 0x8B30
}

export enum PrimitiveType {
    Points = 0x0000,	
    Lines = 0x0001,
    LineLoop = 0x0002,
    LineStrip = 0x0003,
    Triangles = 0x0004,
    TriangleStrip = 0x0005,
    TriangleFan =0x0006
}

export enum DataType {
    Byte = 0x1400,
    UnsignedByte = 0x1401,
    Short = 0x1402,
    UnsignedShort = 0x1403,
    Int = 0x1404,
    UnsignedInt = 0x1405,
    Float = 0x1406
}

export enum CullingMode {
    None = 0x0000,
    Front = 0x0404,
    Back = 0x0405,
    FrontAndBack = 0x0408
}

export enum BufferUsageType {
    StreamDraw = 0x88E0,
    StaticDraw = 0x88E4,
    DynamicDraw = 0x88E8
}