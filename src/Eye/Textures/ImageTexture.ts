import {GlObject} from "../GlObject";
import {TextureFilterMode,TextureWrapMode} from "../GlEnums";
import {Context} from "../Context";
import {Texture} from "./Texture";

export class ImageTexture extends Texture {

    private _imageElement: HTMLImageElement;

    constructor(context: Context, image: HTMLImageElement, createMipmaps: boolean = true){
        super(context, createMipmaps);
        this._imageElement = image;
        this.init();
    }

    init() {
        super._init();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
        //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this._imageElement);
        
        if(this.hasMipmaps) {
            this.shrinkFilter = TextureFilterMode.LinearMipmapLinear; 
            this.enlargedFilter = TextureFilterMode.Linear;
            this.createMipmaps();
        }
        else {
            this.filter = TextureFilterMode.Linear; 
        }
    }

    get width(): number { return this._imageElement.width; }
    get height(): number { return this._imageElement.height; }

}