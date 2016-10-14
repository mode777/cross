import {Camera} from "./Camera";
import {vec3, mat4} from "gl-matrix";

export class PerspectiveCamera extends Camera {
    
    private _fov: number;
    private _aspectRatio: number;
    private _nearPlane: number;
    private _farPlane: number;
    private _position: Float32Array;
    private _target: Float32Array;

    constructor(position?: Float32Array, target?: Float32Array, fov?: number, aspectRatio?: number, nearPlane?: number, farPlane?: number) {
        super();
        this._target = target || vec3.create(); // Vector3.Zero
        this._position = position || vec3.fromValues(0,0,3); // new Vector3(0, 0, 3);

        this._fov = fov || 62; //62;
        this._aspectRatio = aspectRatio || 1; //1;
        this._nearPlane = nearPlane || 0.1; //0.1f;
        this._farPlane = farPlane || 100;//100.0f;
    }
    
    get fieldOfView() : number { return this._fov; }
    set fieldOfView(value: number) {
        this._fov = value;
        this.projectionDirty = true;
    }

    get aspectRatio(): number { return this._aspectRatio; }
    set aspectRatio(value: number) {
        this._aspectRatio = value;
        this.projectionDirty = true;
    }

    get position(): Float32Array { return this._position; }
    set position(value: Float32Array) {
        this._position = value;
        this.viewDirty = true;
    }

    get target(): Float32Array { return this._target; }
    set target(value: Float32Array) {
        this._target = value;
        this.viewDirty = true;
    }

    get nearPlane(): number { return this._nearPlane; }
    set nearPlane(value: number) {
        this._nearPlane = value;
        this.projectionDirty = true;
    }

    get farPlane(): number { return this._farPlane; }
    set farPlane(value: number) {
        this._farPlane = value;
        this.projectionDirty = true;
    }

    protected buildProjection(matrix: Float32Array): Float32Array {
        mat4.perspective(<mat4>matrix, this._fov, this._aspectRatio, this._nearPlane, this._farPlane);
        return matrix;
    }

    protected buildView(matrix: Float32Array): Float32Array {
        mat4.lookAt(<mat4>matrix, <vec3>this._position, <vec3>this._target, vec3.fromValues(0, 1, 0));
        return matrix;
    }      

}


