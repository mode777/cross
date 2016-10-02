declare module Tiled {
    interface Map {
        width: number;
        height: number;
        tilewidth: number;
        tileheight: number;
        orientation: "orthogonal" | "isometric" | "staggered";
        layers: Tiled.Layer[];
        tilesets: Tiled.Tileset[];
        backgroundcolor: string;
        renderorder: string;
        properties: any;
        nextobjectid: number;
    }

    interface Layer {
        width: number;
        height: number;
        name: string;
        type: "tilelayer" | "objectgroup" | "imagelayer";
        visible: boolean;
        x: number;
        y: number;
        properties: any;
        opacity: number;
    }

    interface TileLayer extends Tiled.Layer {
        data: string | number[] | Int32Array;
        encoding?: "base64" | "csv";
        compression?: "gzip" | "zlib"
    }

    interface ObjectLayer {
        objects: Tiled.Object[];
        draworder: "topdown" | "index"
    }

    interface Object {
        id: number;
        width: number;
        height: number;
        name: string;
        type: string;
        properties: any;
        visible: boolean;
        x: number;
        y: number;
        rotation: number;
        gid: number;
    }

    interface Tileset {
        firstgid: number;
        image: string | HTMLImageElement;
        name: string;
        tilewidth: number;
        tileheight: number;
        properties: any;
        margin: number;
        spacing: number;
        tileproperties: any;
        terrains?: Tiled.Terrain[];
        tiles?: any; 
    }

    interface Terrain {
        name: string;
        tile: number;
    }
}

