import {TileSet} from "./TileSet"
import {TileLayer} from "./TileLayer"

export class TileMap {

    static fromTiled(map: Tiled.Map) : TileMap{
        let tts = map.tilesets[0]
        let set = new TileSet(<HTMLImageElement>tts.image, tts.tilewidth, tts.tileheight);
        let layers: TileLayer[] = [];

        map.layers.forEach((v, i)=> {
            if(v.type == "tilelayer"){
                let l = <Tiled.TileLayer>v;
                layers.push(new TileLayer(v.width, v.height, <Int32Array>l.data));
            }
        });

        return new TileMap(set, layers);
    }

    constructor(public tileSet?: TileSet, public layers?: TileLayer[]){

    }
}
