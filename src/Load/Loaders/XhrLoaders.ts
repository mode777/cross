import {LoaderPromiseBase, LoaderBase} from "./Loader";
import * as Assets from "../AssetsModule";

export class XhrLoaderPromise<T> extends LoaderPromiseBase<T> {

    protected request: XMLHttpRequest;
    
    constructor(protected url: string, protected processor: (request: XMLHttpRequest)=> T) {
        super();                       

        let request = this.request = new XMLHttpRequest();
        request.open("GET", this.url, true);

        request.onreadystatechange = (ev: ProgressEvent) => {
            if (request.readyState == 4) {
                if (this.alwaysCallback)
                    this.alwaysCallback();
            }
        };
        request.onload = (ev: ProgressEvent) => {
            if (this.doneCallback) {
                let res = this.processor(request);
                this.doneCallback(res);
            }
        }
        request.onerror = (ev: ErrorEvent) => {
            if (this.fail) {
                this.fail(ev.error);
            }
        }

        request.send(null);
    }     
    
} 

export class XhrLoader<T> extends LoaderBase {

    constructor(url: string, protected processor: (request: XMLHttpRequest) => T) {
        super(url);
    }

    public load(): XhrLoaderPromise<T> {
        return new XhrLoaderPromise<T>(Assets.baseUrl + this.url, this.processor);
    }

}

export class XmlLoader extends XhrLoader<XMLDocument> {

    constructor(url: string) {
        super(url, (req) => <XMLDocument>req.responseXML);
    }       
}

export class TextLoader extends XhrLoader<string> {

    constructor(url: string) {
        super(url, (req) => req.responseText);
    }

}

export class JsonLoader extends XhrLoader<any> {

    constructor(url: string) {
        super(url, (req) => JSON.parse(req.responseText));
    }

}
