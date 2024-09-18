import { FieldType } from "../model/field-type";
import { CoordsState } from "./coords-state";

export interface SelectedBuildingState extends CoordsState {
    readonly owner: number | undefined;
    readonly size: number;
    readonly buyCosts: number;
    readonly sellCosts: number;
    readonly turnoverBonus: number;
}

export interface SelectedFieldState extends CoordsState {
    readonly fieldType: FieldType;
    readonly canPutDisaster: boolean;
    readonly hasDisaster: boolean;
}

export interface SelectionState {

    readonly field: SelectedFieldState | undefined;
    readonly building: SelectedBuildingState | undefined;
}