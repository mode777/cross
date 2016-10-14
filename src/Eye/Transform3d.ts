import {mat4, vec3, quat, mat3 } from "gl-matrix";

export class Transform3d {

    private static ONE: vec3 = vec3.fromValues(1,1,1);
    private static ZERO: vec3 = vec3.create();

    private _rotationQuat = quat.create(); 
    private _rotation: vec3;
    private _translation: vec3;
    private _scale: vec3;
    private _origin: vec3;
    private _matrix = mat4.create();    
    
    private _rotationDirty = true;   
    private _dirty = true;
    
    constructor(translation?: vec3, rotation?: vec3, scale?: vec3, origin?: vec3){
        this._translation = (translation || Transform3d.ZERO);
        this._rotation = (rotation || Transform3d.ZERO);
        this._scale = (scale || Transform3d.ONE);
        this._origin = (origin || Transform3d.ZERO);        
    }

    get rotation(): vec3 {
        return this._rotation;
    }
    set rotation(value: vec3) {
        this._rotationDirty = true;
        this._rotation = value;
    }

   get translation(): vec3 {
       return this._translation;
   }
   set translation(value: vec3) {
       this._dirty = true;
       this._translation = value;
   }

   get scale(): vec3 {
       return this._scale;
   }
   set scale(value: vec3) {
       this._dirty = true;
       this._scale = value;
   }

   get origin(): vec3 {
       return this._origin;
   }
   set origin(value: vec3) {
       this._dirty = true;
       this._origin = value;
   }

    get rotationQuat(): quat {
        if(this._rotationDirty){            
            this._rotationQuat = quat.create();
            quat.rotateX(this._rotationQuat, this._rotationQuat, this._rotation[0]);
            quat.rotateY(this._rotationQuat, this._rotationQuat, this._rotation[1]);
            quat.rotateZ(this._rotationQuat, this._rotationQuat, this._rotation[2]);            
            this._rotationDirty = false;
        }
        return this._rotationQuat;
    }

    get matrix(): mat4 {
        if(this._rotationDirty || this._dirty){
            mat4.fromRotationTranslationScaleOrigin(this._matrix, this.rotationQuat, this._translation, this._scale, this._origin);
            this._dirty = false;
        }
        return this._matrix;
    }

}
