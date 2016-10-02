import {Context} from "./Context";
import {Event, EventArgs} from "../Core";

/**
 * Abstract base class for all classes that wrap WebGl types.
 * This class is also responsible for detecting and handling WebGlContextLost/Restored events
 * 
 */
export abstract class GlObject {

    protected gl: WebGLRenderingContext;

    private _context: Context;
    private _restoreHandler: ((e: EventArgs) => void)

    
    /**
     * Creates an instance of GlObject.
     * 
     * @param {Context} context
     * Current CrossEye.Context
     */
    constructor(context: Context) {
        this.gl = context.glContext;
        this._context = context;

        this._restoreHandler = (e: EventArgs) => {
            this._init();
        };
        this._context.contextRestored.bind(this._restoreHandler);
    }


    /**
     * Get the CrossEye.Context.
     * 
     * @readonly
     * @type {Context}
     */
    get context(): Context { return this._context; }
            

    /**
     * Will unsubscribe from contextRestored event. 
     * Implementations should delete the WebGl Ressource they are wrapping.
     */
    dispose() {
        this._context.contextRestored.unbind(this._restoreHandler);
    }

    protected abstract _init(): void


}
