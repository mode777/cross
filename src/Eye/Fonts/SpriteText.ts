import {SpriteFont} from "./SpriteFont";
import {ISpriteTextGlyph, ISpriteChar} from "./Interfaces";
import {Event,EventArgs} from "../../Core";
import {Attribute, AttributeConfiguration} from "../Attributes";
import {DataType} from "../GlEnums";
import {VertexStore} from "../VertexStore";
import {IRectangle} from "../Geometry";
import {vec3} from "gl-matrix";

export class SpriteText {

    private _data: ISpriteTextGlyph[];
    private _spriteFont: SpriteFont;
    private _isDirty: boolean;
    private _text: string;
    private _width: number;

    constructor(text: string, font: SpriteFont, width: number){
        this._width = width;
        this._spriteFont = font;
        this._text = text;
        
        this._isDirty = true;
    }

    public textChanged: Event<EventArgs>;

    public generateGeometry(positionAttribute?: Attribute, uvAttribute?: Attribute, transformMatrix?: Float32Array): VertexStore {
        positionAttribute = positionAttribute || new Attribute("position", 3);
        uvAttribute = uvAttribute || new Attribute("uv", 2, DataType.UnsignedShort, true, true);
        //uvAttribute = uvAttribute || new Attribute("uv", 2);

        let data = this.getData();
        let vertices = data.length * 4;

        let store = new VertexStore(vertices, new AttributeConfiguration(positionAttribute, uvAttribute));
        
        let vertexCount = 0;
        for(let i = 0; i < data.length; i++){
            let s =  data[i].source;
            let t =  data[i].target;
            let tw = this._spriteFont.image.width;
            let th = this._spriteFont.image.height;

            // top left               
            store.setAttribute(positionAttribute, vertexCount+0, vec3.fromValues(t.x, t.y, 0));
            store.setAttribute(uvAttribute, vertexCount+0, [s.x/tw, s.y/th]);
            // top right
            store.setAttribute(positionAttribute, vertexCount+1, vec3.fromValues(t.x + t.width, t.y, 0));
            store.setAttribute(uvAttribute, vertexCount+1, [(s.x + s.width)/tw, s.y/th]);
            // bottom right
            store.setAttribute(positionAttribute, vertexCount+2, vec3.fromValues(t.x + t.width, t.y + t.height, 0));
            store.setAttribute(uvAttribute, vertexCount+2, [(s.x + s.width)/tw, (s.y + s.height)/th]);
            // bottom left
            store.setAttribute(positionAttribute, vertexCount+3, vec3.fromValues(t.x, t.y + t.height, 0));
            store.setAttribute(uvAttribute, vertexCount+3, [s.x/tw, (s.y + s.height)/th]);

            vertexCount += 4;
        }
        return store;
    }
    
    public getData(): ISpriteTextGlyph[] {
    //protected getData(): ISpriteTextGlyph[] {
        if (this._isDirty){
            this._putText();
            this._isDirty = false;
        }

        return this._data;
    }
    

    private _putText() {
        let d: ISpriteTextGlyph[] = this._data = [];
        let text = this._text;
        let sf = this._spriteFont;

        let x: number = 0;
        let y: number = 0;

        let wordLength: number = 0;
        let fileBuffer: ISpriteChar[] = [];
        
        let whiteSpace: number = sf.glyphByChar(" ").width;

        for(let i = 0; i < text.length; i++){
            let setWord: boolean = false;
            let c = text.charAt(i);

            if(c == "\n"){
                x = 0;
                y += sf.size;
                continue;
            }

            let g = sf.glyphByChar(c) || sf.glyphByChar("?") || null;
            
            let target: IRectangle = {
                x: x + g.offset.x,
                y: y + g.offset.y,
                width: g.rect.width,
                height: g.rect.height
            };

            let sg: ISpriteTextGlyph = {
                source: g.rect,
                target: target
            }
            
            d.push(sg);

            if(x+g.width > this._width){
                x = 0;
                y += sf.size;
            }
            x = x+g.width;
        } 
    }

}