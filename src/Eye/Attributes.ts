import { DataType } from "./GlEnums";

export class AttributeConfiguration {

    private _attributes: Attribute[];
    private _offsets: { [key: string]: number };
    private _vertexSize: number;

    constructor(...attributes: Attribute[]) {
        this._attributes = attributes;

        this._offsets = {};
        this._calculateOffsets();
    }

    get attributes(): Attribute[] { return this._attributes }
    get vertexSize(): number { return this._vertexSize; }   

    public getOffset(attribute: Attribute): number {
        return this._offsets[attribute.name];
    }

    public getAttributePosition(attrib: Attribute): number {
        return this._attributes.indexOf(attrib);
    }

    private _calculateOffsets() {
        var offset = 0;
        for (var attr of this._attributes) {
            this._offsets[attr.name] = offset;
            offset += attr.size;
        }
        this._vertexSize = offset;
    }

}

export class Attribute {

    private static _genSizes = () => {
        var s: { [id: number]: number } = {};
        s[(<number>DataType.Byte)] = 1;
        s[(<number>DataType.Float)] = 4;
        s[(<number>DataType.Int)] = 4;
        s[(<number>DataType.Short)] = 2;
        s[(<number>DataType.UnsignedByte)] = 1;
        s[(<number>DataType.UnsignedInt)] = 4;
        s[(<number>DataType.UnsignedShort)] = 2;
        return s;
    };
    private static _sizes: { [id: number]: number };
            

    private _name: string;
    private _dataType: DataType;
    private _components: number;
    private _normalize: boolean;
    private _normalizeValues: boolean;

    constructor(name: string, components: number, dataType: DataType = DataType.Float, normalize: boolean = false, normalizeValues: boolean = false) {
        if (!Attribute._sizes)
            Attribute._sizes = Attribute._genSizes();

        this._name = name;
        this._dataType = dataType;
        this._components = components;
        this._normalize = normalize;
        this._normalizeValues = normalizeValues;
    }

    get name(): string {  return this._name; }
    get dataType(): number { return this._dataType; }
    get size(): number { return Attribute._sizes[<number>this._dataType] * this._components; }
    get componentSize(): number { return Attribute._sizes[<number>this._dataType]; }
    get components(): number { return this._components; }
    get normalize(): boolean { return this._normalize; }
    get normalizeValues(): boolean { return this._normalizeValues; }
}