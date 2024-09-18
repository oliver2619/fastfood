import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GameSetupState } from "../state/game-setup-state";

export const selectGameSetup = createFeatureSelector<GameSetupState>('game-setup');

export const selectUserColor = createSelector(
    selectGameSetup,
    setup => setup.players[setup.user].color
);

export const selectPlayerColors = createSelector(
    selectGameSetup,
    game => game.players.map(it => it.color)
);

export const selectFields = createSelector(
    selectGameSetup,
    game => game.fields
);

