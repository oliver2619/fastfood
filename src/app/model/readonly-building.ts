import { ReadonlyField } from "./readonly-field";
import { ReadonlyPlayer } from "./readonly-player";

export interface ReadonlyBuilding {
    readonly x: number;
    readonly y: number;
    readonly owner: ReadonlyPlayer;
    readonly size: number;
    readonly canUpgrade: boolean;
    readonly fields: readonly ReadonlyField[];

    getFieldsProductivity(): number;
    
    getSellCosts(fieldsProductivity: number): number;
}