import { BuildingCoords } from "./building-coords";
import { FieldType } from "./field-type";
import { Player } from "./player";
import { ProductType } from "./product-type";
import { ReadonlyBuilding } from "./readonly-building";
import { ReadonlyWorldMap } from "./readonly-world-map";

export interface ReadonlyPlayer {
    readonly isHuman: boolean;
    readonly color: string;
    readonly index: number;
    readonly money: number;
    readonly buildings: readonly ReadonlyBuilding[];

    canHarvest(type: FieldType): boolean;

    canSellProduct(productType: ProductType): boolean;

    cloneWithBuilding(coords: BuildingCoords, map: ReadonlyWorldMap): Player;

    getCostsPerRound(): number;

    getEstimatedTurnover(inclDisaster: boolean, map: ReadonlyWorldMap): number;

    hasHarvests(): boolean;

    hasSells(): boolean;
}