import { FieldType } from "./field-type";
import { Harvests } from "./harvests";

export interface ReadonlyField {
    readonly x: number;
    readonly y: number;
    readonly type: FieldType;
    readonly productivity: number;
    readonly relativeProductivity: number;

    harvest(buildingProductivity: number, harvests: Harvests): void;
}