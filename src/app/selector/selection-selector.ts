import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SelectionState } from "../state/selection-state";

const selectSelection = createFeatureSelector<SelectionState>('selection');

export const selectSelectedBuilding = createSelector(
    selectSelection,
    sel => sel.building
);

export const selectSelectedField = createSelector(
    selectSelection,
    sel => sel.field
);