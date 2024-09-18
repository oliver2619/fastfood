import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ProductType } from "../model/product-type";
import { SoilType } from "../model/soil-type";
import { CoordsState } from "../state/coords-state";
import { GameSetupState } from "../state/game-setup-state";
import { GameState } from "../state/game-state";
import { InitialMoney } from "../state/initial-money";
import { PlayerAiLevel } from "../state/player-ai-level";
import { SelectedBuildingState, SelectedFieldState } from "../state/selection-state";

export interface GameCreatedAction {
    numberOfPlayer: number;
    initialMoney: InitialMoney;
    initialBuildings: number;
    players: Array<{
        ai: PlayerAiLevel;
    }>;
};

export const gameActionGroup = createActionGroup({
    source: 'Game',
    events: {
        'created': props<GameCreatedAction>(),
        'next player': emptyProps(),
        'harvest': props<{ soilType: SoilType }>(),
        'sell': props<{ productType: ProductType }>(),
        'select point on map': props<CoordsState>(),
        'select field': props<SelectedFieldState>(),
        'deselect field': emptyProps(),
        'select building': props<SelectedBuildingState>(),
        'deselect building': emptyProps(),
        'sell building': props<CoordsState>(),
        'buy building': props<CoordsState>(),
        'put disaster': props<CoordsState>(),
        'update setup': props<GameSetupState>(),
        'update': props<GameState>()
    }
});