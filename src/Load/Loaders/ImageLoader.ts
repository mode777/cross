import {LoaderPromiseBase, LoaderBase} from "./Loader";
import * as Assets from "../AssetsModule";

/** Will be returned by image loader. */
export class ImageLoaderPromise extends LoaderPromiseBase<HTMLImageElement> {

    private _image: HTMLImageElement;

    constructor(protected url: string) {
        super();
        let image = this._image = new Image();
        image.src = url;

        let always = () => {
            if(this.alwaysCallback)
                this.alwaysCallback();
        }

        image.onload = (ev) => {
            if(this.doneCallback)
                this.doneCallback(image);

            always();
        }   

        image.onerror = (event: ErrorEvent) => {
            if(this.failCallback)
                this.failCallback(event.error);

            always();
        }            
    }     

}

export class ImageLoader extends LoaderBase {
    
    constructor(url: string){
        super(url);            
    }

    load(): ImageLoaderPromise {
        return new ImageLoaderPromise(Assets.baseUrl + this.url);
    }

}

