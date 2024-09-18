import { CoordsState } from "../state/coords-state";
import { FieldState } from "../state/game-setup-state";
import { BuildingCoords } from "./building-coords";
import { Field } from "./field";
import { FieldCoords } from "./field-coords";
import { FieldType } from "./field-type";
import { WorldMapJson } from "./game-json";
import { ReadonlyField } from "./readonly-field";
import { ReadonlyWorldMap } from "./readonly-world-map";

export class WorldMap implements ReadonlyWorldMap {

    get pestilence(): FieldCoords | undefined {
        return this._pestilence;
    }

    private constructor(private fields: Field[][], private _pestilence: FieldCoords | undefined) { }

    static load(json: WorldMapJson): WorldMap {
        return new WorldMap(json.fields.map((fs, y) => fs.map((it, x) => Field.load(it, x, y))), json.pestilence == undefined ? undefined : FieldCoords.load(json.pestilence));
    }

    static newWorldMap(): WorldMap {
        return new WorldMap(this.initFields(), undefined);
    }

    canPutDisaster(field: ReadonlyField): boolean {
        return this._pestilence == undefined || this._pestilence.x !== field.x || this._pestilence.y !== field.y;
    }

    clone(): WorldMap {
        return new WorldMap(this.fields.map(fs => fs.map(it => it.clone())), this._pestilence);
    }

    getAllFieldsForBuilding(coords: BuildingCoords): ReadonlyField[] {
        const ret: ReadonlyField[] = [];
        coords.getFieldCoords((x, y) => {
            const f = this.getField(x, y);
            if (f != undefined) {
                ret.push(f);
            }
        });
        return ret;
    }

    getAllFieldsProductivityForBuilding(coords: BuildingCoords): number {
        let ret = 0;
        coords.getFieldCoords((fx, fy) => {
            const f = this.getField(fx, fy);
            if (f != undefined) {
                ret += f.productivity;
            }
        });
        return ret;
    }

    getAllFields(): ReadonlyField[] {
        return this.fields.flatMap(it => it);
    }

    getField(x: number, y: number): ReadonlyField | undefined {
        if (x < 0 || y < 0 || y >= this.fields.length) {
            return undefined;
        }
        const fs = this.fields[y];
        return x < fs.length ? fs[x] : undefined;
    }

    getFieldsState(): FieldState[][] {
        return this.fields.map(fs => fs.map(it => it.getState()));
    }

    getPestilenceState(): CoordsState | undefined {
        return this._pestilence == undefined ? undefined : this._pestilence.getState();
    }

    hasDisaster(field: ReadonlyField): boolean {
        return this._pestilence != undefined && this._pestilence.x === field.x && this._pestilence.y === field.y;
    }

    putDisaster(coords: FieldCoords) {
        this._pestilence = coords;
    }

    save(): WorldMapJson {
        return {
            fields: this.fields.map(fs => fs.map(it => it.save())),
            pestilence: this._pestilence == undefined ? undefined : this._pestilence.save()
        };
    }

    private static initFields(): Field[][] {
        const fields = this.placeFields();
        let cnt = 0;
        while (cnt < 500 && this.balanceFields(fields)) {
            ++cnt;
        }
        return fields;
    }

    private static balanceFields(fields: Field[][]): boolean {
        let maxProductivity = 0;
        let minProductivity = 16;
        let maxFields: Field[] = [];
        let minFields: Field[] = [];
        for (let bx = 2; bx < 11; ++bx) {
            for (let by = 1; by < 5; ++by) {
                let sum = 0;
                let fs: Field[] = [];
                new BuildingCoords(bx, by).getFieldCoords((fx, fy) => {
                    if (fy >= 0 && fx >= 0 && fy < fields.length && fx < fields[fy].length) {
                        const field = fields[fy][fx];
                        const prod = field.productivity;
                        sum += prod;
                        if (field.type !== FieldType.CITY) {
                            fs.push(field);
                        }
                    }
                });
                if (maxProductivity < sum) {
                    maxProductivity = sum;
                    maxFields = [...fs];
                } else if (maxProductivity === sum) {
                    maxFields = [...maxFields, ...fs];
                }
                if (minProductivity > sum) {
                    minProductivity = sum;
                    minFields = [...fs];
                } else if (minProductivity === sum) {
                    minFields = [...minFields, ...fs];
                }
            }
        }
        if (maxProductivity - minProductivity > 4) {
            const f1 = maxFields[Math.floor(Math.random() * maxFields.length) | 0];
            const f2 = minFields[Math.floor(Math.random() * minFields.length) | 0];
            fields[f2.y][f2.x] = f1.cloneAt(f2.x, f2.y);
            fields[f1.y][f1.x] = f2.cloneAt(f1.x, f1.y);
            return true;
        } else {
            return false;
        }
    }

    private static placeFields(): Field[][] {
        const fields: Field[][] = [[], [], [], [], []];
        const avail = this.createAvailableFields();
        const cities = this.createAvailableCities();
        for (let y = 0; y < 5; ++y) {
            for (let x = 0; x < 6; ++x) {
                if ((y & 1) === 0 || x < 5) {
                    if ((y === 1 || y === 3) && (x === 1 || x === 3)) {
                        fields[y].push(cities.pop()!.cloneAt(x, y));
                    } else {
                        fields[y].push(avail.pop()!.cloneAt(x, y));
                    }
                }
            }
        }
        return fields;
    }

    private static createAvailableCities(): Field[] {
        const avail: Field[] = [];
        avail.push(Field.newField(0, 0, FieldType.CITY, 2));
        avail.push(Field.newField(0, 0, FieldType.CITY, 3));
        avail.push(Field.newField(0, 0, FieldType.CITY, 4));
        avail.push(Field.newField(0, 0, FieldType.CITY, 5));
        this.shuffleFields(avail);
        return avail;
    }

    private static createAvailableFields(): Field[] {
        const avail: Field[] = [];
        avail.push(Field.newField(0, 0, FieldType.FARM, 1));
        avail.push(Field.newField(0, 0, FieldType.FARM, 2));
        avail.push(Field.newField(0, 0, FieldType.FARM, 2));
        avail.push(Field.newField(0, 0, FieldType.FARM, 3));
        avail.push(Field.newField(0, 0, FieldType.FARM, 4));
        avail.push(Field.newField(0, 0, FieldType.FARM, 4));
        avail.push(Field.newField(0, 0, FieldType.FARM, 5));
        avail.push(Field.newField(0, 0, FieldType.PLANTATION, 1));
        avail.push(Field.newField(0, 0, FieldType.PLANTATION, 2));
        avail.push(Field.newField(0, 0, FieldType.PLANTATION, 3));
        avail.push(Field.newField(0, 0, FieldType.PLANTATION, 4));
        avail.push(Field.newField(0, 0, FieldType.PLANTATION, 5));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 1));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 2));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 2));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 3));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 3));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 4));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 4));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 5));
        avail.push(Field.newField(0, 0, FieldType.FIELD, 5));
        avail.push(Field.newField(0, 0, FieldType.INDUSTRY, 2));
        avail.push(Field.newField(0, 0, FieldType.INDUSTRY, 3));
        avail.push(Field.newField(0, 0, FieldType.INDUSTRY, 4));
        this.shuffleFields(avail);
        return avail;
    }

    private static shuffleFields(fields: Field[]) {
        let i = fields.length;
        while (i > 0) {
            let ri = Math.floor(Math.random() * i);
            --i;
            const f = fields[i];
            fields[i] = fields[ri];
            fields[ri] = f;
        }
    }
}