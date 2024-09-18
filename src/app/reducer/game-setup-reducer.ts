import { createReducer, on } from "@ngrx/store";
import { gameActionGroup } from "../action/game-action-group";
import { GameSetupState } from "../state/game-setup-state";

const initialState: GameSetupState = {
    fields: [],
    players: [],
    user: -1
};

export const gameSetupReducer = createReducer(
    initialState,
    on(gameActionGroup.updateSetup, (_, action) => action)
);