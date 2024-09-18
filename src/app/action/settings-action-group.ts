import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AnimationSpeed } from "../state/animation-speed";
import { InitialMoney } from "../state/initial-money";
import { PlayerAiLevel } from "../state/player-ai-level";

export interface SettingsLoadedAction {
    username: string;
    animationSpeed: AnimationSpeed;
    showStatisticsWithDisaster: boolean;
    newGame: {
        numberOfPlayers: number;
        initialMoney: InitialMoney;
        initialBuildings: number;
        players: Array<{
            ai: PlayerAiLevel;
        }>;
    };
}

export interface SettingsChangedAction {
    username: string;
    animationSpeed: AnimationSpeed;
}

export interface GameSettingsChangedAction {
    animationSpeed: AnimationSpeed;
}

export const settingsActionGroup = createActionGroup({
    source: 'Settings',
    events: {
        'settings changed': props<SettingsChangedAction>(),
        'game settings changed': props<GameSettingsChangedAction>(),
        'loaded': props<SettingsLoadedAction>(),
        'notFound': emptyProps(),
        'show statistics with disaster': props<{flag: boolean}>()
    }
});