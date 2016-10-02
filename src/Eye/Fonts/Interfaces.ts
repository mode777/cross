import {IRectangle, IPoint} from "../Geometry";

export interface ISpriteTextGlyph {
    source: IRectangle,
    target: IRectangle
};

export interface ISpriteChar{      
    width: number;
    offset: IPoint;
    rect: IRectangle;
    code: string;
    kernings: IKerning[];
}

export interface IKerning {
    code: string;
    offsetX: number;
}
