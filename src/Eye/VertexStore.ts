import {Attribute, AttributeConfiguration} from "./Attributes";
import {DataType} from './GlEnums';

export class VertexStore {

    static MAX_INT: number = 4294967295;
    static MAX_SHORT: number = 65535;
    static MAX_BYTE: number = 255;

    private _size: number;
    private _dataView: DataView;
    private _vertices: number;
    private _attribConfig: AttributeConfiguration;

    _dirty: boolean; // pseudo private

    constructor(vertices: number, attributes: AttributeConfiguration) {
        this._vertices = vertices;
        this._attribConfig = attributes;

        this._size = vertices * attributes.vertexSize;
        this._dataView = new DataView(new ArrayBuffer(this._size));
    }             

    get size(): number { return this._size; }
    get vertexCount(): number { return this._vertices }     
    get dataView(): DataView { return this._dataView }
    get buffer(): ArrayBuffer { return this._dataView.buffer }
    get attributeConfig(): AttributeConfiguration { return this._attribConfig; }

    getAttribute(attribute: Attribute, index: number, offset?: number): ArrayBufferView | number[] {
        offset = offset || this._attribConfig.getOffset(attribute);
        var offsetTotal = index * this._attribConfig.vertexSize + offset; 

        var result: ArrayBufferView;

        switch (attribute.dataType) {
            case DataType.Byte:
                var tData = new Int8Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getInt8(offsetTotal)
                    offsetTotal += 1;
                }
                result = tData;
                break;
            case DataType.Float:
                var tData = new Float32Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getFloat32(offsetTotal, true);
                    offsetTotal += 4;
                }
                result = tData;
                break;
            case DataType.Int:
                var tData = new Int32Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getInt32(offsetTotal, true);
                    offsetTotal += 4;
                }
                result = tData;
                break;
            case DataType.Short:
                var tData = new Int16Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getInt16(offsetTotal, true);
                    offsetTotal += 2;
                }
                result = tData;
                break;
            case DataType.UnsignedByte:
                var tData = new Uint8Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getUint8(offsetTotal);
                    offsetTotal += 1;
                }
                result = tData;
                break;
            case DataType.UnsignedInt:
                var tData = new Uint32Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getUint32(offsetTotal, true);
                    offsetTotal += 4;
                }
                result = tData;
                break;
            case DataType.UnsignedShort:
                var tData = new Uint16Array(attribute.components);
                for (var i = 0; i < attribute.components; i++) {
                    tData[i] = this._dataView.getUint16(offsetTotal, true);
                    offsetTotal += 2;
                }
                result = tData;
                break;
        }

        if (attribute.normalizeValues) {
            return this._denormalizeArray(attribute, result);
        }
        else {
            return result;
        }
    }
            
    setAttribute(attribute: Attribute, index: number, data: ArrayBufferView | number[], offset?: number, dataOffset?: number): void {
        if (!ArrayBuffer.isView(data)) {
            if (attribute.normalizeValues)
                data = this._normalizeArray(attribute, <number[]>data);
            data = this._toTypedArray(attribute, <number[]>data);
        }

        let buffer = <ArrayBufferView>data;

        offset = offset || this._attribConfig.getOffset(attribute);
        dataOffset = dataOffset || 0;

        var offsetTotal = (index * this._attribConfig.vertexSize) + offset; 

        switch (attribute.dataType) {
            case DataType.Byte:
                var tData = <Int8Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setInt8(offsetTotal,tData[i + dataOffset]);
                    offsetTotal += 1;
                }
                break;
            case DataType.Float:
                var tData = <Float32Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setFloat32(offsetTotal, tData[i + dataOffset], true);
                    offsetTotal += 4;
                }
                break;
            case DataType.Int:
                var tData = <Int32Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setInt32(offsetTotal, tData[i + dataOffset], true);
                    offsetTotal += 4;
                }
                break;
            case DataType.Short:
                var tData = <Int16Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setInt16(offsetTotal, tData[i + dataOffset], true);
                    offsetTotal += 2;
                }
                break;
            case DataType.UnsignedByte:
                var tData = <Uint8Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setUint8(offsetTotal, tData[i + dataOffset]);
                    offsetTotal += 1;
                }
                break;
            case DataType.UnsignedInt:
                var tData = <Uint32Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setUint32(offsetTotal, tData[i + dataOffset], true);
                    offsetTotal += 4;
                }
                break;
            case DataType.UnsignedShort:
                var tData = <Uint16Array>buffer;
                for (var i = 0; i < attribute.components; i++) {
                    this._dataView.setUint16(offsetTotal, tData[i + dataOffset], true);
                    offsetTotal += 2;
                }
                break;
        }

    }

    setAttributes(attribute: Attribute, data: ArrayBufferView | number[], vertexOffset: number = 0) {
        if (!ArrayBuffer.isView(data)) {
            if (attribute.normalizeValues)
                data = this._normalizeArray(attribute, <number[]>data);
            data = this._toTypedArray(attribute, <number[]>data);
        }

        let buffer = <ArrayBufferView>data;
        var attrSize = attribute.size;
        var attributes = buffer.byteLength / attrSize;
        var arrayOffset = 0;

        for (var index = 0; index < attributes; index++) {
            this.setAttribute(attribute, index + vertexOffset, buffer, null, arrayOffset);
            arrayOffset += attribute.components;
        }
    }

    createQuadIndex() : (Uint16Array | Uint8Array) {
        let index: Uint16Array | Uint8Array;
        let quads: number = Math.floor(this._vertices / 4);
        let indices: number = quads * 6;

        if(this._vertices <= VertexStore.MAX_BYTE ){
            index = new Uint8Array(indices);
        } 
        else if(this._vertices <= VertexStore.MAX_SHORT){
            index = new Uint16Array(indices);
        }
        else {
            throw "WebGl IndexBuffers cannot address more then " + VertexStore.MAX_SHORT;
        }

        let quadCount = 0;
        for(let i=0; i < this._vertices; i+=4){
            index[quadCount+0] = i+0
            index[quadCount+1] = i+2
            index[quadCount+2] = i+1
            index[quadCount+3] = i+0
            index[quadCount+4] = i+3
            index[quadCount+5] = i+2
            quadCount += 6;
        }

        return index;
    }

    private _toTypedArray(attribute: Attribute, value: number[]): ArrayBufferView {
        switch (attribute.dataType) {
            case DataType.Byte:
                return new Int8Array(value);
            case DataType.Float:
                return new Float32Array(value);                    
            case DataType.Int:
                return new Int32Array(value);
            case DataType.Short:
                return new Int16Array(value);
            case DataType.UnsignedByte:
                return new Uint8Array(value);
            case DataType.UnsignedInt:
                return new Uint32Array(value);
            case DataType.UnsignedShort:
                return new Uint16Array(value);
        }
    }

        private _normalizeArray(attribute: Attribute, arr: number[]): number[] {
            var res: number[] = [];
            for (let i = 0; i < arr.length; i++) {
                switch (attribute.dataType) {
                    case DataType.UnsignedByte:
                        res[i] = Math.floor((arr[i] > 1 ? arr[i] % 1 : arr[i]) * VertexStore.MAX_BYTE);
                        break;
                    case DataType.UnsignedInt:
                        res[i] = Math.floor((arr[i] > 1 ? arr[i] % 1 : arr[i]) * VertexStore.MAX_INT);
                        break;
                    case DataType.UnsignedShort:
                        res[i] = Math.floor((arr[i] > 1 ? arr[i] % 1 : arr[i]) * VertexStore.MAX_SHORT);
                        break;
                    default:
                        throw "Only unsigned types can be normalized."
                }
            }
            return res;
    }

        private _denormalizeArray(attribute: Attribute, arr: ArrayBufferView): number[] {
            let res: number[] = [];
            let data = <any>arr;

            for (let i = 0; i < data.length; i++) {
                switch (attribute.dataType) {
                    case DataType.UnsignedByte:
                        res[i] = data[i] / VertexStore.MAX_BYTE;
                        break;
                    case DataType.UnsignedInt:
                        res[i] = data[i] / VertexStore.MAX_INT;
                        break;
                    case DataType.UnsignedShort:
                        res[i] = data[i] / VertexStore.MAX_SHORT;
                        break;
                    default:
                        throw "Only unsigned types can be normalized."
                }
            }
            return res;
        }



}
