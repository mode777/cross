import {LoaderPromiseBase, LoaderBase} from "./Loader";
import {JsonLoader} from "./XhrLoaders";
import {AggregateError} from "./AggregateLoader";
import {ImageLoader} from "./ImageLoader"
import * as Url from "../UrlModule";
import * as Assets from "../AssetsModule";
import * as pako from "pako";

export class TiledLoaderPromise extends LoaderPromiseBase<Tiled.Map>
{
    map: Tiled.Map;
    errors: Error[] = [];

    private _imgCount: number;

    constructor(loader: JsonLoader){
        super();
        loader.load()
        .fail((e)=>{
            this.errors.push(e);
            if(this.failCallback)
                this.failCallback(e);
        })
        .done((json) => {
            this.map = <Tiled.Map>json;
            this._mapLoaded();
        });
    }

    private _mapLoaded(){
        for(let layer of this.map.layers){
            this._decodeLayer(layer);
        }

        this._imgCount = this.map.tilesets.length;
        
        if(this._imgCount == 0){
            this._triggerDone();
            return;
        }

        for(let ts of this.map.tilesets){
            this._loadTileset(ts);
        }
    }

    private _triggerDone(){
        if(this.errors.length == 0 && this.doneCallback)
            this.doneCallback(this.map);

        if(this.errors.length > 0 && this.failCallback){
            let err: AggregateError = {
                message: "See errors field for details",
                name: "AggregateError",
                errors: this.errors
            };
            this.failCallback(err);
        }
            
        if(this.alwaysCallback)
            this.alwaysCallback();
    }

    private _decodeLayer(layer: Tiled.Layer){
        if(layer.type == "tilelayer"){
            let tLayer = <Tiled.TileLayer>layer;
            let dataInt = new Uint32Array(tLayer.width * tLayer.height);

            if(tLayer.data instanceof Array){
                let aData = <number[]>tLayer.data;
                aData.forEach((v,i) => {
                    dataInt[i] = v;
                });
                tLayer.data = dataInt;
                return;
            }
            else if(typeof(tLayer.data) == "string") {
                let sData = <string>tLayer.data;

                if(tLayer.compression){
                    dataInt = new Uint32Array(pako.ungzip(atob(sData)).buffer);
                }
                else {
                    sData.split(",").forEach((v,i) => {
                        dataInt[i] = parseInt(v);
                    });
                }
                tLayer.data = dataInt;
                return;
            }
            delete tLayer.compression;
            delete tLayer.encoding;
        }
    }

    private _loadTileset(tileset: Tiled.Tileset){
        let imgUrl = <string>tileset.image;

        new ImageLoader(imgUrl).load()
        .always(()=>{
            this._imgCount--;
            if(this._imgCount == 0){
                setTimeout(() => {
                    this._triggerDone();
                }, 1);
            }
        })
        .done((image)=>{
            tileset.image = image;
        })
        .fail((e)=>{
            this.errors.push(e);
        });
    }
}

export class TiledLoader extends LoaderBase {

    constructor(url: string) {
        super(url);
    }

    load(): TiledLoaderPromise{
        return new TiledLoaderPromise(new JsonLoader(this.url));
    }

}
