import {LoaderPromiseBase, Loader, LoaderBase} from "./Loaders/Loader";
import {AggregateLoader, AggregateResults} from "./Loaders/AggregateLoader";
/**
 * Lets you specify a base url that is prependend to all paths.
 */
export let baseUrl:string = "";

let _registeredLoaders: { [key: string]: ((url: string) => LoaderBase) } = {
    //"glsl": (url: string) => new TextLoader(url),
};

/**
 * Lets you supply an array of assets to load and a callback.
 * The callback function will get an asset object which contains the loaded assets indexed by filename. 
 * @param {(BaseLoader | string)[]} assets An array containing either a url string (You will need to have a loader registered for the extension)
 * or a loader instance.
 * @param {(assets} callback A function that will be called when all assets are loaded and which will get an object of all the assets
 * indexed by filename.
 */
export function load(assets: (LoaderBase | string)[], callback: (assets: AggregateResults) => void): void {

    let loader = new AggregateLoader(assets).load()
    .done(callback);
}

/**
 * Associate a loader with a certain extension.
 * @param {string} ext The extension to associate
 * @param {typeof BaseLoader} type The type of the loader class (Must be extending BaseLoader)
 */
export function registerLoader(ext: string, type: typeof LoaderBase): void {
    _registeredLoaders[ext] = (url: string) => new type(url);
}

/**
 * Returns a factory which creates a loader instance for given extensions.
 * Returns undefined if no extension was registered.
 * @param {string} ext Extension to get loader factory
 * @returns {(url: string) => LoaderBase} Factory to create appropriate loader with.
 */
export function getLoader(ext: string) : (url: string) => LoaderBase {
    return _registeredLoaders[ext];
}