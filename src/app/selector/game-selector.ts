import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GamePhase } from "../model/game-phase";
import { GameState } from "../state/game-state";
import { selectGameSetup } from "./game-setup-selector";
import { selectShowSettingsWithDisaster } from "./settings-selector";

export const selectGame = createFeatureSelector<GameState>('game');

export const selectUserOnTurn = createSelector(
    selectGame,
    selectGameSetup,
    (game, setup) => game.playerOnTurn === setup.user && game.phase !== GamePhase.GAME_OVER
);

export const selectUser = createSelector(
    selectGame,
    selectGameSetup,
    (game, setup) => game.players[setup.user]
);

export const selectUserSoils = createSelector(
    selectGame,
    game => game.userSoils
);

export const selectPlayerIndexOnTurn = createSelector(
    selectGame,
    game => game.playerOnTurn
);

export const selectPlayerOnTurn = createSelector(
    selectGame,
    game => game.players[game.playerOnTurn]
);

export const selectGamePhase = createSelector(
    selectGame,
    game => game.phase
);

export const selectNextPlayerEnabled = createSelector(
    selectGame,
    selectGameSetup,
    (game, setup) => game.phase === GamePhase.BUILD && game.playerOnTurn === setup.user
);

export const selectRemainingScore = createSelector(
    selectGame,
    game => game.remainingScore
);

export const selectPlayersSorted = createSelector(
    selectGame,
    game => game.players.slice(0).sort((p1, p2) => {
        if (p1.score != p2.score) {
            return p2.score - p1.score;
        }
        return p2.money - p1.money;
    })
);

export const selectUserStatistics = createSelector(
    selectGame,
    selectShowSettingsWithDisaster,
    (game, flag) => flag ? game.userStatistics.inclDisaster : game.userStatistics.exclDisaster
);

export const selectPestilence = createSelector(
    selectGame,
    game => game.pestilence
);

export const selectBuildings = createSelector(
    selectGame,
    game => game.buildings
);

