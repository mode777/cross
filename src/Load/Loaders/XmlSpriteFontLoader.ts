import {LoaderPromiseBase, LoaderBase, LoaderPromise} from "./Loader";
import {XmlLoader} from "./XhrLoaders";
import {ImageLoader} from "./ImageLoader";
import {AggregateLoaderPromise} from "./AggregateLoader";
import {SpriteFont, ISpriteChar, IPoint, IKerning, IRectangle} from "../../Eye";
import * as Url from "../UrlModule";

export class XmlSpriteFontLoaderPromise extends LoaderPromiseBase<SpriteFont> {       

    private _xmlDoc: XMLDocument;
    private _image: HTMLImageElement;

    private _fontChars: ISpriteChar[];
    private _fontName: string;
    private _fontStyle: string;
    private _fontSize: number;

    constructor(xmlLoader: XmlLoader, imgLoader: ImageLoader) {
        super();
        new AggregateLoaderPromise([xmlLoader, imgLoader])
        .always(() => {
            if(this.alwaysCallback)
                this.alwaysCallback();
        })
        .done((results)=> {
            if(this.doneCallback){
                this._xmlDoc = results[Url.getFilename(xmlLoader.url)];
                this._image = results[Url.getFilename(imgLoader.url)];
                this._parseXml();
                let font = new SpriteFont(this._image, this._fontChars, this._fontName, this._fontSize, this._fontStyle);
                this.doneCallback(font);
            }
            
        })
        .fail((error)=>{
            if(this.failCallback)
                this.failCallback(error);
        })
    }     

    private _parseXml() {
        let xmlDoc = this._xmlDoc;
        var font = xmlDoc.getElementsByTagName("Font")[0];

        this._fontName = font.getAttribute("family");
        this._fontSize = parseInt(font.getAttribute("size"), 10);
        this._fontStyle = font.getAttribute("style");


        let chars: ISpriteChar[] = this._fontChars = [];
        for (let i = 0; i < font.childNodes.length; i++) {
            if (!(font.childNodes[i] instanceof Element))
                continue;

            let xmlChar = <Element>font.childNodes[i];

            let offsetFrags = xmlChar.getAttribute("offset").split(" ");
            let rectFrags = xmlChar.getAttribute("rect").split(" ");

            let offset: IPoint = {
                x: parseInt(offsetFrags[0], 10),
                y: parseInt(offsetFrags[1], 10),
            };

            let rect: IRectangle = {
                x: parseInt(rectFrags[0], 10),
                y: parseInt(rectFrags[1], 10),
                width: parseInt(rectFrags[2], 10),
                height: parseInt(rectFrags[3], 10),
            }

            let kernings: IKerning[] = [];
            for (let i = 0; i < xmlChar.childNodes.length; i++) {
                if (!(xmlChar.childNodes[i] instanceof Element))
                    continue;

                let xmlKern = <Element>xmlChar.childNodes[i];

                let kern: IKerning = {
                    code: xmlKern.getAttribute("id"),
                    offsetX: parseInt(xmlKern.getAttribute("advance"),10)
                }

                kernings.push(kern);
            }
            
            let char: ISpriteChar = {
                width: parseInt(xmlChar.getAttribute("width"), 10),
                code: xmlChar.getAttribute("code"),
                offset: offset,
                rect: rect,
                kernings: kernings
            } 

            chars.push(char);
        }
    }
}

export class XmlSpriteFontLoader extends LoaderBase{

    constructor(protected xmlUrl: string, protected imageUrl: string) {
        super(xmlUrl);
    }

    public load(): LoaderPromise {
        return new XmlSpriteFontLoaderPromise(new XmlLoader(this.xmlUrl), new ImageLoader(this.imageUrl));
    }

}