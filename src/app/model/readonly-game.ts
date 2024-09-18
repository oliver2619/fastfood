import { BuildingCoords } from "./building-coords";
import { ReadonlyField } from "./readonly-field";
import { ReadonlyWorldMap } from "./readonly-world-map";

export interface ReadonlyGame {

    readonly numberOfPlayers: number;
    readonly map: ReadonlyWorldMap;
    readonly isOver: boolean;

    canBuyBuilding(coords: BuildingCoords): boolean;

    canPutDisaster(field: ReadonlyField): boolean;

    cloneWithBuilding(player: number, building: BuildingCoords): ReadonlyGame;

    getAllAvailableBuildings(): BuildingCoords[];

    getAllFieldsForBuilding(coords: BuildingCoords): ReadonlyField[];

    getAllFieldsProductivityForBuilding(coords: BuildingCoords): number;

    getAllFieldsToPutPestilence(): ReadonlyField[];

    getBuildingBuyCosts(coords: BuildingCoords): number;

    getEstimatedTurnover(inclDisaster: boolean, player: number): number;
}