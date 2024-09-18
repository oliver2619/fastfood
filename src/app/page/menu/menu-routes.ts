import { Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { NewGameComponent } from "./new-game/new-game.component";
import { SettingsComponent } from "./settings/settings.component";

export const menuRoutes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: MainComponent
}, {
    path: 'settings',
    component: SettingsComponent
}, {
    path: 'newGame',
    component: NewGameComponent
}];