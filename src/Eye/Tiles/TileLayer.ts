import {TileInfo, TileSet} from "./TileSet";

export class TileLayer {
    
    private _data: Int32Array;

    constructor(private _width: number, private _height: number, data?: Int32Array){
        data = data || new Int32Array(_width * _height);
        this.data = data;
    }
    
    get height(): number {
        return this._height;
    }
    get width(): number {
        return this._width;
    }
    get data(): Int32Array {
        return this._data;
    }
    set data(value: Int32Array) {
        if(value.length != this.width * this.height)
            throw "Data length mismatch!";
        this._data = value;
    }

    getTile(x: number, y: number): number{
        return this.data[y * this.width + x];
    }
    
    setTile(x: number, y: number, tile: TileInfo | number){
        if(typeof(tile) == "number"){
            this.data[y * this.width + x] = <number>tile;
        }
        else {
            let info = <TileInfo>tile;
            let value = info.id;
            value = info.flipD ? (value | TileSet.FLIPPED_DIAGONALLY_FLAG) : value;
            value = info.flipH ? (value | TileSet.FLIPPED_HORIZONTALLY_FLAG) : value;
            value = info.flipV ? (value | TileSet.FLIPPED_VERTICALLY_FLAG) : value;
            this.data[y * this.width + x] = value;
        }
    }

    getArea(offsetX: number, offsetY: number, width: number, height: number) : TileLayer {
        let newData= new Int32Array(width * height);
        let i = 0;

        for(let y = offsetY; y < offsetY + height; y++){
            for(let x = offsetX; x < offsetX + width; x++){
                newData[i] = this.getTile(x,y);
                i++;
            }
        }

        return new TileLayer(width, height, newData);
    }

    createQuads(set: TileSet): number[] {
        let res: number[] = [];
        let th = set.tileHeight, tw = set.tileWidth;
        let w = this.width, h = this.height;
        let ci = 0;

        this.data.forEach((tileId,i) => {
            if(tileId == 0)
                return;

            let y = Math.floor(i / w) * th;
            let x = Math.floor(i % w) * tw;
            
            let bi = ci*8; 
            // left top
            res[bi+0] = x;
            res[bi+1] = y;
            // right top 
            res[bi+2] = x + tw;     
            res[bi+3] = y;
            // right down
            res[bi+4] = x + tw;     
            res[bi+5] = y + th;
            // left down
            res[bi+6] = x;
            res[bi+7] = y + th;
            ci++;
        });

        return res;
    }

    createUVs(set: TileSet, normalize: boolean): number[] {
        let res: number[] = [];
        let ci = 0;

        this.data.forEach((tileId,i) => {
            if(tileId == 0)
                return null;

            let uvs = set.getTileUVs(this.data[i], normalize);

            let bi = ci*8; 
            // right down
            res[bi+0] = uvs[0];     
            res[bi+1] = uvs[1];
            // left down
            res[bi+2] = uvs[2];
            res[bi+3] = uvs[3];
            // right top 
            res[bi+4] = uvs[4];     
            res[bi+5] = uvs[5];
            // left top
            res[bi+6] = uvs[6];
            res[bi+7] = uvs[7];
            ci++;
        });

        return res;
    }


}
