import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettingsState } from "../state/settings-state";

export const selectSettings = createFeatureSelector<SettingsState>('settings');

export const selectAnimationSpeed = createSelector(selectSettings, settings => settings.animationSpeed);

export const selectUsername = createSelector(selectSettings, settings => settings.username);

export const selectNewGameSettings = createSelector(selectSettings, settings => settings.newGame);

export const selectShowSettingsWithDisaster = createSelector(selectSettings, settings => settings.showStatisticsWithDisaster);
