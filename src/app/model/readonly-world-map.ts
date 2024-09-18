import { BuildingCoords } from "./building-coords";
import { FieldCoords } from "./field-coords";
import { ReadonlyField } from "./readonly-field";

export interface ReadonlyWorldMap {
    
    readonly pestilence: FieldCoords | undefined;
    
    getField(x: number, y: number): ReadonlyField | undefined;

    getAllFieldsForBuilding(coords: BuildingCoords): ReadonlyField[];

    hasDisaster(field: ReadonlyField): boolean;
}