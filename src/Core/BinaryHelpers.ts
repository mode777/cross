
export module BinaryHelpers {
    export function Base64ToByteArray(base64: string){
        let raw = atob(base64);
        let res = new Uint8Array(raw.length);
        for(let i = 0; i < raw.length; i++){
            res[i] = raw.charCodeAt(i);
        }
        return res;
    }
}