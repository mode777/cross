import {LoaderPromiseBase, Loader, LoaderBase} from "./Loader";
import * as Url from "../UrlModule";
import * as Assets from "../AssetsModule";

export interface AggregateError extends Error {
    errors: Error[];
}

export interface AggregateResults{
    [key: string]: any;
}

export class AggregateLoaderPromise extends LoaderPromiseBase<AggregateResults> {
    protected remain: number;
    public aggregates: AggregateResults = {}
    public errors: Error[] = [];

    constructor(protected loaders: Loader[]){
        super();

        this.remain = loaders.length;

        this._load();
    }

    private _load(){

        for(let loader of this.loaders){
            loader.load()
            .always(() => {
                this.remain--;
                if(this.remain == 0){
                    setTimeout(() => {
                        this._loadingDone();
                    }, 1);
                }
            })
            .done((res) => {
                this.aggregates[Url.getFilename(loader.url)] = res;
            })
            .fail((error) => {
                this.errors.push(error);
            });
        }            
    }

    private _loadingDone(){
        if(this.errors.length == 0 && this.doneCallback){
            this.doneCallback(this.aggregates);
        }

        if(this.errors.length > 0 && this.failCallback){
            let e: AggregateError = {
                message: "See errors field for more details.",
                name: "AggregateError",
                errors: this.errors
            }
            this.failCallback(e);
        }

        if(this.alwaysCallback){
            this.alwaysCallback();
        }
    }
}

export class AggregateLoader implements Loader {

    url = "";
    protected loaders: Loader[] = [];

    constructor(args: (Loader | string)[]){
        let loader: LoaderBase;

        for (let arg of args) {
            if (typeof(arg) == "string") {
                let url = <string>arg;
                let ext = Url.getExtension(url);
                loader =  Assets.getLoader(ext)(url);
            }
            else if (arg instanceof LoaderBase){
                loader = arg;
            }                

            this.loaders.push(loader);                
        }
    }

    load() : AggregateLoaderPromise {
        return new AggregateLoaderPromise(this.loaders);

    }

}
