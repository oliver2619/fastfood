import { createReducer, on } from "@ngrx/store";
import { gameActionGroup } from "../action/game-action-group";
import { GamePhase } from "../model/game-phase";
import { PlayerSoilsState, PlayerStatisticsState, GameState } from "../state/game-state";

const initialStatistics: PlayerStatisticsState = {
    vertility: {
        farm: 0,
        field: 0,
        industry: 0,
        plantation: 0,
        city: 0
    },
    totalTurnover: 0
};

const initalSoils: PlayerSoilsState = {
    harvests: {
        farm: 0,
        field: 0,
        plantation: 0,
        industry: 0,
        city: 0
    },
    soils: {
        bread: 0,
        coffee: 0,
        cola: 0,
        nugget: 0,
        potato: 0,
        steak: 0
    }
};

const initialState: GameState = {
    phase: GamePhase.GAME_OVER,
    players: [],
    playerOnTurn: -1,
    userSoils: initalSoils,
    userStatistics: {
        exclDisaster: initialStatistics,
        inclDisaster: initialStatistics
    },
    remainingScore: 0,
    buildings: [],
    pestilence: undefined
};

export const gameReducer = createReducer(
    initialState,
    on(gameActionGroup.update, (_, action) => action)
);