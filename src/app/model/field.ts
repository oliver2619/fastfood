import { FieldState } from "../state/game-setup-state";
import { FieldCoords } from "./field-coords";
import { FieldType } from "./field-type";
import { FieldJson } from "./game-json";
import { Harvests } from "./harvests";
import { ReadonlyField } from "./readonly-field";

export class Field implements ReadonlyField {

    readonly relativeProductivity: number;

    private readonly coords: FieldCoords;

    get x(): number {
        return this.coords.x;
    }

    get y(): number {
        return this.coords.y;
    }

    private constructor(x: number, y: number, readonly type: FieldType, readonly productivity: number) {
        this.relativeProductivity = productivity / 30;
        this.coords = new FieldCoords(x, y);
    }

    static load(json: FieldJson, x: number, y: number): Field {
        return new Field(x, y, (FieldType as any)[json.type], json.productivity);
    }

    static newField(x: number, y: number, type: FieldType, productivity: number): Field {
        return new Field(x, y, type, productivity);
    }

    clone(): Field {
        return new Field(this.x, this.y, this.type, this.productivity);
    }

    cloneAt(x: number, y: number): Field {
        return new Field(x, y, this.type, this.productivity);
    }

    getState(): FieldState {
        return {
            fieldType: this.type,
            productivity: this.productivity
        };
    }

    harvest(buildingProductivity: number, harvests: Harvests): void {
        const cnt = this.type === FieldType.CITY ? buildingProductivity * 2 : buildingProductivity;
        for (let i = 0; i < cnt; ++i) {
            if (Math.random() < this.relativeProductivity) {
                harvests.add(this.type, 1);
            }
        }
    }

    save(): FieldJson {
        return {
            productivity: this.productivity,
            type: FieldType[this.type]
        };
    }
}