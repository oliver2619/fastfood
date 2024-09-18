import { SoilsState } from "../state/game-state";
import { SoilsJson } from "./game-json";
import { SoilType } from "./soil-type";

export class Soils {

    get size(): number {
        return this._size;
    }

    private constructor(private readonly soilsByType: Map<SoilType, number>, private _size: number) { }

    static fromState(state: SoilsState): Soils {
        const map = new Map<SoilType, number>();
        let size = 0;
        Object.entries(state).forEach(it => {
            map.set((SoilType as any)[it[0].toUpperCase()], it[1]);
            size += it[1];
        });
        return new Soils(map, size);
    }

    static load(json: SoilsJson): Soils {
        const map = new Map<SoilType, number>();
        let size = 0;
        Object.entries(json).forEach(it => {
            map.set((SoilType as any)[it[0]], it[1]);
            size += it[1];
        });
        return new Soils(map, size);
    }

    static newSoils(): Soils {
        return new Soils(new Map<SoilType, number>(), 0);
    }

    add(type: SoilType, amount: number) {
        const old = this.soilsByType.get(type);
        const n = old == undefined ? amount : old + amount;
        if (n < 0) {
            throw new RangeError(`Amount of soil type ${SoilType[type]} must not get negative`);
        }
        if (n > 0) {
            this.soilsByType.set(type, n);
        } else {
            this.soilsByType.delete(type);
        }
        this._size += amount;
    }

    clone(): Soils {
        return new Soils(new Map(this.soilsByType), this._size);
    }

    get(type: SoilType): number {
        const ret = this.soilsByType.get(type);
        return ret == undefined ? 0 : ret;
    }

    save(): SoilsJson {
        const ret: SoilsJson = {};
        Array.from(this.soilsByType.entries()).forEach(it => ret[SoilType[it[0]]] = it[1])
        return ret;
    }
}