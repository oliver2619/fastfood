import { Observable, Subject } from "rxjs";
import { FieldType } from "../../model/field-type";

export class TileImages {

    private _onLoaded = new Subject<boolean>();
    private images = new Map<string, HTMLImageElement>();
    private loading = 0;
    private loaded = 0;
    private imageByFieldType: HTMLImageElement[] = [];

    get isLoaded(): boolean {
        return this.loading === this.loaded;
    }

    get onLoaded(): Observable<boolean> {
        return this._onLoaded;
    }

    constructor() {
        this.loadImage('farm');
        this.loadImage('field');
        this.loadImage('plantation');
        this.loadImage('industry');
        this.loadImage('city');
        this.loadImage('biohazard');
    }

    get(name: string): HTMLImageElement {
        const ret = this.images.get(name);
        if (ret == undefined) {
            throw new RangeError(`Image ${name} not found / loaded`);
        }
        return ret;
    }

    getField(type: FieldType): HTMLImageElement {
        return this.imageByFieldType[type];
    }
    
    private loadImage(image: string) {
        ++this.loading;
        const img = new Image();
        img.src = `images/${image}.png`;
        img.onload = () => {
            this.images.set(image, img);
            ++this.loaded;
            this.checkComplete();
        };
        img.onerror = () => { throw new Error(`Failed to load image ${image}.png`) };
    }

    private checkComplete() {
        if (this.isLoaded) {
            this.imageByFieldType = [];
            this.imageByFieldType[FieldType.FARM] = this.get('farm');
            this.imageByFieldType[FieldType.FIELD] = this.get('field');
            this.imageByFieldType[FieldType.PLANTATION] = this.get('plantation');
            this.imageByFieldType[FieldType.INDUSTRY] = this.get('industry');
            this.imageByFieldType[FieldType.CITY] = this.get('city');
            this._onLoaded.next(true);
        }
    }
}