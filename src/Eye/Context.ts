import {Event, EventArgs} from "../Core";
import { Buffer } from "./Buffers";
import { Rectangle } from "./Geometry";
import { ShaderProgram } from "./Shaders";
import { CullingMode, VertexWindingMode, PrimitiveType } from "./GlEnums";
import { Texture } from "./Textures";
import { IndexBuffer } from "./Buffers";

export class Context {

    private _canvas: HTMLCanvasElement;
    private _glContext: WebGLRenderingContext;

    private _viewport: Rectangle;

    private _buffer: Buffer;
    private _shader: ShaderProgram;

    private _cullingEnabled: boolean;
    private _cullingMode: CullingMode;

    private _vertexWindingMode: VertexWindingMode;
    private _clearColor: Float32Array;

    private _textures: Texture[];
    private _options: { [key: string]: any };

    private _depthTest: boolean;
    private _blending: boolean;

    public contextLost: Event<EventArgs>;
    public contextRestored: Event<EventArgs>;


    constructor(canvas: HTMLCanvasElement, options?: {[key:string]:any}) {
        this._canvas = canvas;
        this._viewport = new Rectangle(0, 0, canvas.width, canvas.height);
        this._clearColor = new Float32Array([0,0,0,1]);
        this._cullingEnabled = false;
        this._cullingMode = CullingMode.None;
        this._vertexWindingMode = VertexWindingMode.CounterClockWise;
        this._textures = [];
        this._options = options;

        this.contextLost = new Event<EventArgs>(this);
        this.contextRestored = new Event<EventArgs>(this);

        this.init();

        var that = this;

        canvas.addEventListener("webglcontextlost", function (event) {
            that.contextLost.trigger(EventArgs.Empty);
            event.preventDefault();
        }, false);

        canvas.addEventListener("webglcontextrestored", function (event) {
            that.init();
            that.contextRestored.trigger(EventArgs.Empty);
        }, false);

    }

    get canvas(): HTMLCanvasElement { return this._canvas; };
    get glContext(): WebGLRenderingContext { return this._glContext; };

    get viewport(): Rectangle { return this._viewport; };
    set viewport(value: Rectangle) {
        this._glContext.viewport(value.x, value.y, value.width, value.height);
        this._viewport = value;
    }

    get clearColor(): Float32Array { return this._clearColor; }
    set clearColor(value: Float32Array) {
        this._glContext.clearColor(value[0], value[1], value[2], value[3] || 1);
        this._clearColor = value;
    }

    get buffer(): Buffer { return this._buffer; }
    set buffer(value: Buffer) {
        if (value && value != this._buffer) {
            this._glContext.bindBuffer(value.bufferType, value.glBuffer);
            this._buffer = value;
        }
    }

    get shader(): ShaderProgram { return this._shader; }
    set shader(value: ShaderProgram) {
        this._glContext.useProgram(value.glProgram);
        this._shader = value;
    }

    get cullingMode(): CullingMode { return this._cullingMode; }
    set cullingMode(value: CullingMode){
        if(value == CullingMode.None){
            this._glContext.disable(this._glContext.CULL_FACE);
            this._cullingEnabled = false;
        }
        else {
            this._glContext.enable(this._glContext.CULL_FACE);
            this._glContext.cullFace(value);
            this._cullingEnabled = true;
        }
        this._cullingMode = value;
    }

    get vertexWindingMode(): VertexWindingMode { return this._vertexWindingMode; }
    set vertexWindingMode(value: VertexWindingMode){
        this._glContext.frontFace(value);
    }

    get depthTest(): boolean { return this._depthTest; }
    set depthTest(value: boolean) {
        if(value == true)
            this._glContext.enable(this._glContext.DEPTH_TEST);
        else
            this._glContext.disable(this._glContext.DEPTH_TEST);

        this._depthTest = value;
    }

    get blending(): boolean { return this._blending; }
    set blending(value: boolean) {
        if(value == true)
            this._glContext.enable(this._glContext.BLEND);
        else
            this._glContext.disable(this._glContext.BLEND);

        this._blending = value;
    }

    setTexture(slot: number, texture: Texture){
        if(this._textures[slot] != texture){
            this._textures[slot] = texture;
            this._glContext.activeTexture(this._glContext.TEXTURE0 + slot);
            this._glContext.bindTexture(this._glContext.TEXTURE_2D, texture.glTexture);
        }
    }

    getTexture(slot: number){
        return this._textures[slot];
    }

    enableAlphaBlending(){
        this.depthTest = false;
        this.blending = true;
        let gl = this._glContext;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
            
    init() {
        this._glContext = <WebGLRenderingContext>this._canvas.getContext("experimental-webgl", this._options);
        if (this._glContext === null) {
            throw new Error("WebGL not supported.");
        }
        this.viewport = this._viewport;
        this.clearColor = this._clearColor;
        this.cullingMode = this._cullingMode;
        this.vertexWindingMode = this._vertexWindingMode;
    }

    clear() {
        this._glContext.clear(this._glContext.COLOR_BUFFER_BIT);
    }

    draw(primitiveType: PrimitiveType, offset: number, amount: number, indexBuffer?: IndexBuffer)
    {
        if(indexBuffer){
            indexBuffer.bind();
            this.glContext.drawElements(primitiveType, amount, indexBuffer.dataType, offset);
        }
        else {
            this.glContext.drawArrays(primitiveType, offset, amount);
        }
    }
    
}

