import { GamePhase } from "../model/game-phase";
import { CoordsState } from "./coords-state";

export interface PlayerState {
    readonly color: string;
    readonly money: number;
    readonly score: number;
    readonly numberOfSoils: number;
    readonly costsPerRound: number;
}

export interface PlayerStatisticsState {
    readonly totalTurnover: number;
    readonly vertility: HarvestsState;
}

export interface SoilsState {
    readonly steak: number;
    readonly nugget: number;
    readonly bread: number;
    readonly potato: number;
    readonly cola: number;
    readonly coffee: number;
}

export interface HarvestsState {
    readonly farm: number;
    readonly field: number;
    readonly plantation: number;
    readonly industry: number;
    readonly city: number;
}

export interface PlayerSoilsState {
    readonly soils: SoilsState;
    readonly harvests: HarvestsState;
}

export interface StatisticsState {
    readonly exclDisaster: PlayerStatisticsState;
    readonly inclDisaster: PlayerStatisticsState;
}

export interface BuildingState extends CoordsState {
    readonly player: number;
    readonly size: number;
}

export interface GameState {

    readonly players: PlayerState[];
    readonly userStatistics: StatisticsState;
    readonly userSoils: PlayerSoilsState;
    readonly playerOnTurn: number;
    readonly phase: GamePhase;
    readonly remainingScore: number;
    readonly buildings: BuildingState[];
    readonly pestilence: CoordsState | undefined;
}