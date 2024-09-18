import { Routes } from "@angular/router";
import { GameBuildingComponent } from "../../element/game-building/game-building.component";
import { GameFieldOptionsComponent } from "../../element/game-field-options/game-field-options.component";
import { GameHarvestComponent } from "../../element/game-harvest/game-harvest.component";
import { GameMenuBarComponent } from "../../element/game-menu-bar/game-menu-bar.component";
import { GameMenuComponent } from "../../element/game-menu/game-menu.component";
import { GameScoreComponent } from "../../element/game-score/game-score.component";
import { GameSellComponent } from "../../element/game-sell/game-sell.component";
import { GameSettingsComponent } from "../../element/game-settings/game-settings.component";
import { GameStatisticsComponent } from "../../element/game-statistics/game-statistics.component";
import { MainComponent } from "./main/main.component";

export const gameRoutes: Routes = [{
    path: '',
    component: MainComponent,
    children: [{
        path: '',
        pathMatch: 'full',
        component: GameMenuBarComponent
    }, {
        path: 'menu',
        component: GameMenuComponent
    }, {
        path: 'score',
        component: GameScoreComponent
    }, {
        path: 'settings',
        component: GameSettingsComponent
    }, {
        path: 'statistics',
        component: GameStatisticsComponent
    }]
}];