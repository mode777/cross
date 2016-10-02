import * as Url from "../UrlModule";

export interface Loader {
    load() : LoaderPromise;
    url: string;
}

/**
 * Base class for assets loading.
 * Cannot be abstract for accessability issues. Do not instantiate directly.
 */
export class LoaderBase implements Loader  {
    /**
     * Creates a new instance of BaseLoader
     * @param {string} url Url of the ressource to load.
     */
    constructor(public url: string) {
    }

    /** Will return a promise of the asset to be loaded.*/
    public load(): LoaderPromise {
        throw "Not implemented";
    }

    /** @returns The filename of the ressource to load. */
    get filename(): string {
        return Url.getFilename(this.url);
    }

    /** @returns Name of the ressouce to load without extension. */
    get name(): string {
        return Url.getName(this.url);
    }
    get extension(): string {
        return Url.getExtension(this.url);
    }
}

export interface LoaderPromise {
    
    done(callback: ((result: any) => void)): LoaderPromise; 
    fail(callback: ((error: Error) => void)) : LoaderPromise;
    always(callback: (() => void)) : LoaderPromise;
    
} 

export class LoaderPromiseBase<TResult> implements LoaderPromise {

    protected failCallback: (error: Error) => void;        
    protected alwaysCallback: () => void;
    protected doneCallback: (result: TResult) => void; 

    fail(callback: (error: Error) => void): LoaderPromise {
        this.failCallback = callback;            
        return this;
    }

    always(callback: () => void): LoaderPromise {
        this.alwaysCallback = callback;
        return this;
    }

    done(callback: (result: TResult) => void): LoaderPromise{
        this.doneCallback = callback;
        return this;
    }

}