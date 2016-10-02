import {GlObject} from "../GlObject";
import {TextureFilterMode,TextureWrapMode} from "../GlEnums";
import {Context} from "../Context";

export abstract class Texture extends GlObject {
    
    private _glTexture: WebGLTexture;
    private _slot: number;
    private _mipmaps: boolean;
    private _shrinkFilter: TextureFilterMode;
    private _enlargeFilter: TextureFilterMode;
    private _wrapHorizontal: TextureWrapMode;
    private _wrapVertical: TextureWrapMode;
    
    constructor(context: Context, createMipmaps: boolean){
        super(context);
        this._slot = null;
        this._mipmaps = createMipmaps;   
    }

    protected _init() {
        this._glTexture = this.gl.createTexture();
    }

    get glTexture(): WebGLTexture { return this._glTexture; }

    get slot(): number {
        if(this._slot != null){
            var tex = this.context.getTexture(this._slot);
            if(tex == this)
                return this._slot;
            else {
                this._slot = null;
                return null;
            }
        }
        return null;
    }

    get isBound(): boolean { return this.slot != null; }
    get hasMipmaps(): boolean { return this._mipmaps; }

    get shrinkFilter(): TextureFilterMode { return this._shrinkFilter; }
    set shrinkFilter(value: TextureFilterMode) {
        this.bind(this.slot != null ? this.slot : 0);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, value);
        this._shrinkFilter = value;
    }

    get enlargedFilter(): TextureFilterMode { return this._enlargeFilter; }
    set enlargedFilter(value: TextureFilterMode) {
        this.bind(this.slot != null ? this.slot : 0);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, value);
        this._enlargeFilter = value;
    } 

    set filter(value: TextureFilterMode) {
        this.enlargedFilter = value;
        this.shrinkFilter = value;
    }
    
    get horizontalWrap(): TextureWrapMode { return this._wrapHorizontal; }
    set horizontalWrap(value: TextureWrapMode) { 
        this.bind(this.slot != null ? this.slot : 0);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, value);
        this._wrapHorizontal = value; 
    }
    
    get verticalWrap(): TextureWrapMode { return this._wrapVertical; }
    set verticalWrap(value: TextureWrapMode) {
        this.bind(this.slot != null ? this.slot : 0);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, value);
        this._wrapVertical = value; 
    }

    set wrap(value: TextureWrapMode)  {
        this.horizontalWrap = value;
        this.verticalWrap = value;
    }

    bind(slot: number) {
        this.context.setTexture(slot, this);
        this._slot = slot;
    }

    unbind(){
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this._slot = null;
    }

    protected createMipmaps() {
        this.bind(this.slot != null ? this.slot : 0);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    public dispose() {
        this.gl.deleteTexture(this._glTexture);
        super.dispose();
    }
}
