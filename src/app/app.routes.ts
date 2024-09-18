import { Routes } from '@angular/router';
import { gameGuard } from './guard/game.guard';
import { gameRoutes } from './page/game/game-routes';
import { menuRoutes } from './page/menu/menu-routes';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: '/menu'
}, {
    path: 'menu',
    loadChildren: () => menuRoutes
}, {
    path: 'game',
    canActivate: [gameGuard],
    loadChildren: () => gameRoutes
}];
