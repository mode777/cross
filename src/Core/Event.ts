
export class EventArgs {
    public static Empty = new EventArgs(); 
}
/**
 * Provides an event object. You can bind to events as well as trigger them.
 * 
 * @export
 * @class Event 
 * @template T The type of event arguments to pass.
 */
export class Event<T extends EventArgs> {

    private _handlers: ((args: T) => void)[];
    owner: any;


    /**
     * Creates an instance of Event.
     * 
     * @param {*} owner The object that owns the event.
     */
    constructor(owner: any) {
        this.owner = owner;
        this._handlers =  [];
    }

    /**
     * Lets you subscribe to an event. 
     * The supplied callback will be called whenever the event is
     * triggered. 
     * 
     * @param {(args: T) => void} callback
     */
    bind(callback: (args: T) => void) {
        this._handlers.push(callback);
    }


    /**
     * Unsubscribe from an event. 
     * The supplied callback function will no longer be called.
     * 
     * @param {(args: T) => void} callback
     */
    unbind(callback: (args: T) => void) {
        var idx = this._handlers.indexOf(callback);
        this._handlers.splice(idx, 1);
    }

    
    /**
     * Will trigger the event. 
     * All subcribed event handlers will be called in the order
     * of their subscription.
     * 
     * @param {T} args Event arguements to send to the observers
     */
    trigger(args: T) {
        for (var callback of this._handlers) {
            callback.call(this.owner, args);
        }
    }
}

