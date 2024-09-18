import { BuildingState } from "../state/game-state";
import { BuildingCoords } from "./building-coords";
import { FieldCoords } from "./field-coords";
import { FieldType } from "./field-type";
import { BuildingJson } from "./game-json";
import { Harvests } from "./harvests";
import { Player } from "./player";
import { ReadonlyBuilding } from "./readonly-building";
import { ReadonlyField } from "./readonly-field";
import { ReadonlyWorldMap } from "./readonly-world-map";

export class Building implements ReadonlyBuilding {

    private static readonly buyPricePerVertility = 5;
    private static readonly buyPriceBasis = 45;
    private static readonly sellPricePerVertility = 4;
    private static readonly sellPriceBasis = 36;
    private static readonly runningCostsPerSize = 1;
    private static readonly runningCostsBasis = 0;

    private readonly coords: BuildingCoords;

    get canUpgrade(): boolean {
        return this._size < 2;
    }

    get costs(): number {
        return this._size * Building.runningCostsPerSize + Building.runningCostsBasis;
    }

    get productivity(): number {
        return this._size;
    }

    get score(): number {
        return this._size;
    }

    get size(): number {
        return this._size;
    }

    get x(): number {
        return this.coords.x;
    }

    get y(): number {
        return this.coords.y;
    }

    private constructor(readonly owner: Player, x: number, y: number, private _size: number, readonly fields: readonly ReadonlyField[]) {
        this.coords = new BuildingCoords(x, y);
    }

    static getBuyCosts(fieldsProductivity: number): number {
        return Building.buyPricePerVertility * fieldsProductivity + Building.buyPriceBasis;
    }

    static load(json: BuildingJson, player: Player, map: ReadonlyWorldMap): Building {
        return new Building(player, json.x, json.y, json.size, map.getAllFieldsForBuilding(new BuildingCoords(json.x, json.y)));
    }

    static newBuilding(x: number, y: number, player: Player, fields: readonly ReadonlyField[]): Building {
        return new Building(player, x, y, 1, fields);
    }

    clone(): Building {
        return new Building(this.owner, this.x, this.y, this._size, this.fields.slice(0));
    }

    cloneWithUpgrade(): Building {
        if (!this.canUpgrade) {
            throw new Error('Building is already upgraded');
        }
        return new Building(this.owner, this.x, this.y, this._size + 1, this.fields.slice(0));
    }

    getFieldsProductivity(): number {
        return this.fields.reduce((prev, cur) => prev + cur.productivity, 0);
    }

    getSellCosts(): number {
        const fieldsProductivity = this.fields.reduce((prev, cur) => prev + cur.productivity, 0);
        return this._size * (Building.sellPricePerVertility * fieldsProductivity + Building.sellPriceBasis);
    }

    getRelativeHarvests(harvests: Harvests, excludePestilence: FieldCoords | undefined) {
        this.fields
            .filter(f => excludePestilence == undefined || excludePestilence.x !== f.x || excludePestilence.y !== f.y)
            .forEach(f => harvests.add(f.type, (f.type === FieldType.CITY ? 2 : 1) * this.productivity * f.relativeProductivity));
    }

    getState(): BuildingState {
        return {
            player: this.owner.index,
            size: this._size,
            x: this.x,
            y: this.y
        };
    }

    harvest(map: ReadonlyWorldMap, harvests: Harvests) {
        this.fields.forEach(f => {
            if (!map.hasDisaster(f)) {
                f.harvest(this.productivity, harvests);
            }
        });
    }

    save(): BuildingJson {
        return {
            size: this._size,
            x: this.x,
            y: this.y
        };
    }

    upgrade() {
        if (!this.canUpgrade) {
            throw new Error('Building is already upgraded');
        }
        ++this._size;
    }
}