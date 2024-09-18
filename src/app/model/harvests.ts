import { FieldType } from "./field-type";
import { HarvestsJson } from "./game-json";

export class Harvests {

    private constructor(private readonly harvestsByType: Map<FieldType, number>) { }

    static load(json: HarvestsJson): Harvests {
        const map = new Map<FieldType, number>();
        Object.entries(json).forEach(it => {
            map.set((FieldType as any)[it[0]], it[1]);
        });
        return new Harvests(map);
    }

    static newHarvests(): Harvests {
        return new Harvests(new Map<FieldType, number>());
    }

    add(type: FieldType, amount: number) {
        const old = this.harvestsByType.get(type);
        const n = old == undefined ? amount : old + amount;
        if (n < 0) {
            throw new RangeError(`Amount of soil type ${FieldType[type]} must not get negative`);
        }
        if (n > 0) {
            this.harvestsByType.set(type, n);
        } else {
            this.harvestsByType.delete(type);
        }
    }

    clone(): Harvests {
        return new Harvests(new Map(this.harvestsByType));
    }

    get(type: FieldType): number {
        const ret = this.harvestsByType.get(type);
        return ret == undefined ? 0 : ret;
    }

    save(): HarvestsJson {
        const ret: HarvestsJson = {};
        Array.from(this.harvestsByType.entries()).forEach(it => ret[FieldType[it[0]]] = it[1])
        return ret;
    }

    set(type: FieldType, amount: number) {
        if(amount > 0) {
            this.harvestsByType.set(type, amount);
        }else {
            this.harvestsByType.delete(type);
        }
    }
}