import {Camera} from "./Camera";
import {mat4, vec3} from "gl-matrix";

export class OrthograficCamera extends Camera {

    private static IDENTITY: Float32Array = mat4.identity(mat4.create());

    private _position: Float32Array;
    private _nearPlane: number;
    private _farPlane: number;
    private _screenWidth: number;
    private _screenHeight: number;
    
    constructor(screenWidth: number, screenHeight: number) {
        super();
        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;
        this._farPlane = 10;
        this._nearPlane = -10;  
        this._position = vec3.fromValues(0,0,0);        
    }
        

    get position(): Float32Array { return this._position; }
    set position(value: Float32Array) {
        this._position = value;
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
        mat4.ortho(<mat4>matrix, 0, this._screenWidth, this._screenHeight, 0, this._nearPlane, this._farPlane); 
        return matrix;
    }

    protected buildView(matrix: Float32Array): Float32Array {
        mat4.translate(<mat4>matrix, <mat4>OrthograficCamera.IDENTITY, <vec3>this._position);
        return matrix;
    }

}


