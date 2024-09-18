import { FieldType } from "../model/field-type";

export interface PlayerSetupState {
    readonly color: string;
}

export interface FieldState {
    readonly productivity: number;
    readonly fieldType: FieldType;
}

export interface GameSetupState {
    readonly user: number;
    readonly players: PlayerSetupState[];
    readonly fields: FieldState[][];

}