import {IRectangle} from "../Geometry";

export interface TileInfo {
    id: number;
    flipH?: boolean;
    flipV?: boolean;
    flipD?: boolean;
    rectangle?: IRectangle;
}

export class TileSet {

    static FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    static FLIPPED_VERTICALLY_FLAG   = 0x40000000;
    static FLIPPED_DIAGONALLY_FLAG   = 0x20000000;

    static MARGIN = 0.6;

    private _image: HTMLImageElement;
    private _tilewidth: number;
    private _tileheight: number;
    private _margin: number;
    private _spacing: number;
    private _columns: number;
    private _uFac: number;
    private _vFac: number;

    constructor(img: HTMLImageElement, tilewidth: number, tileheight: number, margin: number = 0, spacing: number = 0){
        this._image = img;
        this._tilewidth = tilewidth;
        this._tileheight = tileheight;
        this._margin = margin;
        this._spacing = spacing;

        this._columns = Math.floor(img.width / (tilewidth + margin * 2 + spacing) );
        this._uFac = 1 / img.width;
        this._vFac = 1 / img.height;
    }
    
    get image(): HTMLImageElement {
        return this._image;
    }
    
    get tileWidth(): number {
        return this._tilewidth;
    }
    
    get tileHeight(): number {
        return this._tileheight;
    }
    
    get margin(): number {
        return this._margin;
    }
    
    get spacing(): number {
        return this._spacing;
    }

    public getTileUVs(id: number, normalize: boolean) : number[] {

        let info = this.getTileInfo(id);
        if(!info){
            return null
        }
        
        let u = this._uFac, v = this._vFac;
        let x1: number, x2: number, y1: number, y2: number;

        if(normalize){
            x1 = (info.rectangle.x + TileSet.MARGIN) * u; 
            x2 = (info.rectangle.x + info.rectangle.width - TileSet.MARGIN) * u;
            y1 = (info.rectangle.y + TileSet.MARGIN) * v;
            y2 = (info.rectangle.y + info.rectangle.height - TileSet.MARGIN) * v;
        }
        else {
            x1 = info.rectangle.x; 
            x2 = info.rectangle.x + info.rectangle.width;
            y1 = info.rectangle.y;
            y2 = info.rectangle.y + info.rectangle.height;
        }

        return [
            x1, y1,
            x2, y1,
            x2, y2,
            x1, y2,
        ];
    };

    getTileInfo(id: number) : TileInfo {
        let flipH = (id & TileSet.FLIPPED_HORIZONTALLY_FLAG) > 0
        let flipV = (id & TileSet.FLIPPED_VERTICALLY_FLAG) > 0
        let flipD = (id & TileSet.FLIPPED_DIAGONALLY_FLAG) > 0
        let cleanId = (id << 3) >> 3;

        if(cleanId == 0)
            return null;

        let row = Math.floor((cleanId-1) / this._columns);
        let column = Math.floor((cleanId-1) % this._columns);

        return {
            flipD: flipD,
            flipH: flipH,
            flipV: flipV,
            id: cleanId,
            rectangle: {
                height: this._tileheight,
                width: this._tilewidth,
                x: column * this._tilewidth,
                y: row * this._tileheight
            }
        }
    }
    
}