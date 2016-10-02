import {GlObject} from "./GlObject";
import {ShaderType} from "./GlEnums";
import {Context} from "./Context";
import {Attribute, AttributeConfiguration} from "./Attributes";
import {Texture} from "./Textures";

export class Shader extends GlObject {

    private code: string;

    private _type: ShaderType;
    private _glShader: WebGLShader;

    constructor(context: Context, type: ShaderType, code: string) {
        super(context);

        this._type = type;
        this.code = code;    

        this._init();
    }

    get glShader() { return this._glShader; };
    get type() { return this._type; };

    protected _init() {
        if (this._glShader)
            this.gl.deleteShader(this._glShader);

        this._glShader = this.gl.createShader(this._type);
        this.gl.shaderSource(this._glShader, this.code);
        this.gl.compileShader(this._glShader);
        var status = <number>this.gl.getShaderParameter(this._glShader, this.gl.COMPILE_STATUS);
        if (status != 1) {
            var info = this.gl.getShaderInfoLog(this._glShader);
            throw Error("Shader compile error ("+ ShaderType[this.type] +") : " + info);
        }

    }

    public dispose() {
        this.gl.deleteShader(this._glShader);
        super.dispose();
    }
}

export class ShaderProgram extends GlObject {

    private _glProgram: WebGLProgram;
    
    private _uniformLocations: any;

    private _vertexShader: Shader;
    private _fragmentShader: Shader;

    constructor(context: Context, vertexShader: Shader, fragmentShader: Shader) {
        super(context);

        this._vertexShader = vertexShader;
        this._fragmentShader = fragmentShader;
        this._init();
    }

    get glProgram(): WebGLProgram { return this._glProgram; }
    
    get vertexShader() : Shader { return this._vertexShader; }
    get fragmentShader(): Shader { return this._fragmentShader; }
    
    get isUsed(): boolean { return this.context.shader == this; }
    
    protected _init() {
        if (this._glProgram)
            this.gl.deleteProgram(this._glProgram);

        this._glProgram = this.gl.createProgram();
        this.gl.attachShader(this._glProgram, this._vertexShader.glShader);
        this.gl.attachShader(this._glProgram, this._fragmentShader.glShader);

        this.gl.linkProgram(this._glProgram);
        
        this.gl.detachShader(this._glProgram, this._fragmentShader.glShader);
        this.gl.detachShader(this._glProgram, this._vertexShader.glShader);

        var status = <number>this.gl.getProgramParameter(this._glProgram, this.gl.LINK_STATUS);
        if (status != 1) {
            var info = this.gl.getProgramInfoLog(this._glProgram);
            throw Error(info);
        }
        
        this._uniformLocations = {};
    }

    public use() {
        this.context.shader = this;
    }
    
    public sendMatrix4(name: string, matrix4: Float32Array) {
        this.gl.uniformMatrix4fv(this._resolveUniform(name), false, matrix4)
    }

    public sendVector3(name: string, vector3: Float32Array) {
        this.gl.uniform3fv(this._resolveUniform(name), vector3);
    }

    public sendVector2(name: string, vector2: Float32Array) {
        this.gl.uniform2fv(this._resolveUniform(name), vector2);
    }

    public sendFloat(name: string, value: number) {
        this.gl.uniform1f(this._resolveUniform(name), value);
    }

    public sendInt(name: string, value: number){
        this.gl.uniform1i(this._resolveUniform(name), value);
    }

    public sendAttributes(attributeConf: AttributeConfiguration) {
        for (var i = 0; i < attributeConf.attributes.length; i++) {
            let a = attributeConf.attributes[i];
            //console.log("Attribute: "+ i, "Components: " + a.components, "Type: " + DataType[a.dataType], "Normalize: " + a.normalize, "Stride: " + attributeConf.vertexSize, "Offset: " + attributeConf.getOffset(a));
            this.gl.vertexAttribPointer(i, a.components, a.dataType, a.normalize, attributeConf.vertexSize, attributeConf.getOffset(a));
            this.gl.enableVertexAttribArray(i);
        }
    }

    public sendTexture(name: string, texture: Texture){
        if(texture.slot == null)
            throw "Texture is not bound!";
        else {
            this.gl.uniform1i(this._resolveUniform(name), texture.slot);
        }
    }

    private _setAttributes(attributes: Attribute[]): void {
        for (var i = 0; i < attributes.length; i++) {
            this.gl.bindAttribLocation(this._glProgram, i, attributes[i].name);

        }
    }
    
    private _resolveUniform(name: string): WebGLUniformLocation {
        if (this._uniformLocations[name] === undefined) {
            var handle = this.gl.getUniformLocation(this._glProgram, name);
            if (handle == null) {
                console.warn("'" + name + "' does not exist in shader.");
            }
            this._uniformLocations[name] = handle;
        }
        return this._uniformLocations[name];
    }
            
    dispose() {
        this.gl.deleteProgram(this._glProgram);
        super.dispose();
    }
}