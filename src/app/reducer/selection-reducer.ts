import { createReducer, on } from "@ngrx/store";
import { gameActionGroup } from "../action/game-action-group";
import { SelectedBuildingState, SelectedFieldState, SelectionState } from "../state/selection-state";

const initialState: SelectionState = {
    building: undefined,
    field: undefined
};

function onGameSelectBuilding(state: SelectionState, action: SelectedBuildingState): SelectionState {
    return { ...state, building: action };
}

function onGameDeselectBuilding(state: SelectionState): SelectionState {
    return { ...state, building: undefined };
}

function onGameSelectField(state: SelectionState, action: SelectedFieldState): SelectionState {
    return { ...state, field: action };
}

function onGameDeselectField(state: SelectionState): SelectionState {
    return { ...state, field: undefined };
}

export const selectionReducer = createReducer(initialState,
    on(gameActionGroup.selectBuilding, onGameSelectBuilding),
    on(gameActionGroup.deselectBuilding, onGameDeselectBuilding),
    on(gameActionGroup.selectField, onGameSelectField),
    on(gameActionGroup.deselectField, onGameDeselectField),
);

