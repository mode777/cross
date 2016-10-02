import {mat4} from "gl-matrix";

export abstract class Camera {

    private _projection: Float32Array;
    private _view: Float32Array;
    protected projectionDirty: boolean;
    protected viewDirty: boolean;

    constructor() {
        this.projectionDirty = true;
        this.viewDirty = true;

        this._projection = mat4.create();
        this._view = mat4.create();
    }
    
    public get projectionMatrix(): Float32Array
    {
        if (this.projectionDirty) {
            this._projection = this.buildProjection(this._projection);
            this.projectionDirty = false;
        }
        return this._projection;
    }

    public get viewMatrix(): Float32Array
    {
        if (this.viewDirty) {
            this._view = this.buildView(this._view);
            this.viewDirty = false;
        }
        return this._view;
    }

    protected abstract buildProjection(matrix: Float32Array): Float32Array;
    protected abstract buildView(matrix: Float32Array): Float32Array;    
                

}

