import { createReducer, on } from "@ngrx/store";
import { gameActionGroup, GameCreatedAction } from "../action/game-action-group";
import { GameSettingsChangedAction, settingsActionGroup, SettingsChangedAction, SettingsLoadedAction } from "../action/settings-action-group";
import { SettingsState } from "../state/settings-state";

const initialState: SettingsState = {
    username: 'You',
    animationSpeed: 'slow',
    showStatisticsWithDisaster: false,
    newGame: {
        numberOfPlayers: 2,
        initialBuildings: 2,
        initialMoney: 'normal',
        players: [{ ai: 'human' }, { ai: 'aiBeginner' }, { ai: 'aiAmateur' }, { ai: 'aiProfessional' }]
    }
};

function onSettingsLoaded(_: SettingsState, props: SettingsLoadedAction): SettingsState {
    return ({
        username: props.username,
        animationSpeed: props.animationSpeed,
        showStatisticsWithDisaster: props.showStatisticsWithDisaster,
        newGame: {
            numberOfPlayers: props.newGame.numberOfPlayers,
            initialBuildings: props.newGame.initialBuildings,
            initialMoney: props.newGame.initialMoney,
            players: props.newGame.players.map(it => ({ ai: it.ai }))
        }
    });
}

function onGameSettingsChanged(state: SettingsState, props: GameSettingsChangedAction): SettingsState {
    return ({ ...state, animationSpeed: props.animationSpeed });
}

function onSettingsChanged(state: SettingsState, props: SettingsChangedAction): SettingsState {
    return ({ ...state, username: props.username, animationSpeed: props.animationSpeed });
}

function onSettingsShowStatisticsWithDisaster(state: SettingsState, props: {flag: boolean}): SettingsState {
    return ({...state, showStatisticsWithDisaster: props.flag});
}

function onGameStarted(state: SettingsState, action: GameCreatedAction): SettingsState {
    return ({
        ...state,
        newGame: {
            initialBuildings: action.initialBuildings,
            initialMoney: action.initialMoney,
            numberOfPlayers: action.numberOfPlayer,
            players: action.players.map(it => ({ ai: it.ai }))
        }
    });
}

export const settingsReducer = createReducer(
    initialState,
    on(settingsActionGroup.gameSettingsChanged, onGameSettingsChanged),
    on(settingsActionGroup.settingsChanged, onSettingsChanged),
    on(settingsActionGroup.loaded, onSettingsLoaded),
    on(gameActionGroup.created, onGameStarted),
    on(settingsActionGroup.showStatisticsWithDisaster, onSettingsShowStatisticsWithDisaster)
);