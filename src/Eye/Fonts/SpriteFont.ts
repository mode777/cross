import {ISpriteChar} from "./Interfaces";

export class SpriteFont {

    private _image: HTMLImageElement;
    private _chars: ISpriteChar[];
    private _name: string;
    private _style: string;
    private _size: number;
    private _charMap: { [key: string]: ISpriteChar };

    constructor(image: HTMLImageElement, chars: ISpriteChar[], name?: string, size?: number, style?: string) {
        this._image = image;
        this._chars = chars;
        this._name = name;
        this._size = size;
        this._style = style;

        this._buildCharMap();
    }

    get image(): HTMLImageElement { return this._image; }
    get characters(): ISpriteChar[] { return this._chars; }
    get name(): string { return this._name; }
    get style(): string { return this._style; }
    get size(): number { return this._size; }

    public glyphByChar(code: string): ISpriteChar {
        return this._charMap[code];
    }

    private _buildCharMap() {
        this._charMap = {};
        for (var c of this._chars) {
            this._charMap[c.code] = c;
        }
    }

    
}