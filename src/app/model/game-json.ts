export type SoilsJson = { [key: string]: number };
export type HarvestsJson = { [key: string]: number };

export interface CoordsJson {
    readonly x: number;
    readonly y: number;
}

export interface BuildingJson extends CoordsJson{
    readonly size: number;
}

export interface FieldJson {
    readonly type: string;
    readonly productivity: number;
}

export interface WorldMapJson {
    readonly fields: FieldJson[][];
    readonly pestilence: CoordsJson | undefined;
}

export interface PlayerJson {
    readonly aiLevel: number | undefined;
    readonly money: number;
    readonly color: string;
    readonly soils: SoilsJson;
    readonly harvests: HarvestsJson;
    readonly buildings: BuildingJson[];
}

export interface GameJson {
    readonly version: 1;
    readonly phase: string;
    readonly playerOnTurn: number;
    readonly players: PlayerJson[];
    readonly map: WorldMapJson;
}