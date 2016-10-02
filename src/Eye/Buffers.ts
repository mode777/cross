import {GlObject} from "./GlObject";
import {BufferUsageType, BufferType} from "./GlEnums";
import {Context} from "./Context"; 
import {DataType} from "./GlEnums";

/**
 * Base class for Buffers.
 * Wraps GlTypes ArrayBuffer and ElementArrayBuffer.
 * You can use this directly or use the inherited classes for more functionality.
 * 
 */
export class Buffer extends GlObject {

    private _usage: BufferUsageType;
    private _glBuffer: WebGLBuffer;
    private _bufferType: BufferType;
    private _data: ArrayBuffer;

    /**
     * Creates an instance of Buffer.
     * 
     * @param {Context} context 
     * Your current CrossEyeContext 
     * @param {ArrayBuffer} data
     * The data you want to store in the buffer. Do not confuse Javascript ArrayBuffer with WebGl ArrayBuffer.
     * @param {BufferType} bufferType
     * The type of buffer you are creating (ArrayBuffer or ElementArrayBuffer)
     * @param {BufferUsageType} [usage=BufferUsageType.StaticDraw]
     * Usage of the buffer. See WebGl documentation for more info.(https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants)
     */
    constructor(context: Context, data: ArrayBuffer, bufferType: BufferType, usage: BufferUsageType = BufferUsageType.StaticDraw) {
        super(context);

        this._usage = usage;
        this._bufferType = bufferType;
        this._data = data;
    }


    /**
     * Get the BufferUsageType of this buffer.
     * 
     * @readonly
     * @type {BufferUsageType}
     */
    get usage(): BufferUsageType { return this._usage; }
    
    
    /**
     * Get the WebGLBuffer object which this object is wrapping. 
     * 
     * @readonly
     * @type {WebGLBuffer}
     */
    get glBuffer(): WebGLBuffer { return this._glBuffer; }

    
    /**
     * The type of this buffer. Either ArrayBuffer (CrossEye.VertexBuffer) or ElementArrayBuffer (CrossEye.IndexBuffer) 
     * 
     * @readonly
     * @type {BufferType}
     */
    get bufferType(): BufferType { return this._bufferType; }

    
    /**
     * Returns true if the buffer is currently bound to the WebGlRenderingContext.
     * 
     * @readonly
     * @type {boolean}
     */
    get isBound(): boolean { return this.context.buffer == this }

    protected _init() {
        if (this.glBuffer)
            this.gl.deleteBuffer(this._glBuffer);

        this._glBuffer = this.gl.createBuffer();
        var prev = this.context.buffer;
        this.bind();
        this._setData(this._data);
        this.context.buffer = prev;
    }

    dispose() {
        this.gl.deleteBuffer(this._glBuffer);
        super.dispose();
    }


    /**
     * Will bind the buffer to the WebGl context. 
     * Do this begore performing operations on the buffer. 
     */
    bind(): void {
        this.context.buffer = this;
    }       

    private _setData(data: ArrayBuffer): void {
        this.gl.bufferData(this._bufferType, data, this._usage);
    }
    
}

/**
 * Wraps an WebGl ElementArrayBuffer. 
 * Commonly used to adress vertices in a vertex buffer.
 * Example: If your vertex buffer has 4 vertices laid out clockwise and you want to draw a quad with triangles
 * your IndexBuffer might look like this: [0,3,2, 0,2,1] 
 * 
 */
export class IndexBuffer extends Buffer {

    private _count: number;
    private _dataType: DataType;


    /**
     * Creates an instance of IndexBuffer.
     * 
     * @param {Context} context
     * Current context
     * @param {(Uint8Array | Uint16Array)} data
     * WebGl only allows unsingned bytes or shorts. This also means you cannot adress more than (2^16)-1 vertices in a buffer.
     * @param {BufferUsageType} [usage=BufferUsageType.StaticDraw]
     * A hint on how to use the buffer (Also see: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants)
     */
    constructor(context: Context, data: Uint8Array | Uint16Array, usage: BufferUsageType = BufferUsageType.StaticDraw) {
        super(context, data, BufferType.ElementArrayBuffer, usage);
        this._count = data.length;

        if (data instanceof Uint8Array) 
            this._dataType = DataType.UnsignedByte;
        else if (data instanceof Uint16Array) 
            this._dataType = DataType.UnsignedShort;

        this._init();
    }


    /**
     * Is either UnsignedByte or UnsingedShort. No others are allowed in WebGl.
     * 
     * @readonly
     * @type {DataType}
     */
    public get dataType(): DataType {
        return this._dataType;
    }

    
    /**
     * Number of indices in the buffer.
     * 
     * @readonly
     * @type {number}
     */
    public get count(): number {
        return this._count;
    }


}

/**
 * Wraps an WebGl ArrayBuffer.
 * Use this to store geometry. 
 * Typically you would use {VertexStore} to build your data and then put the raw data in the vertex buffer.
 * 
 */
export class VertexBuffer extends Buffer {


    /**
     * Creates an instance of VertexBuffer.
     * 
     * @param {Context} context
     * Current context.
     * @param {ArrayBuffer} data
     * Raw data to store and send to the GPU.
     * @param {BufferUsageType} [usage=BufferUsageType.StaticDraw]
     * Hint for the GPU on how to treat the data (Also see: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants)
     */
    constructor(context: Context, data: ArrayBuffer, usage: BufferUsageType = BufferUsageType.StaticDraw) {
        super(context, data, BufferType.ArrayBuffer, usage);
        this._init();
    }

}

