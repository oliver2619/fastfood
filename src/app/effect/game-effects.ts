import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";
import { gameActionGroup } from "../action/game-action-group";
import { GameService } from "../service/game.service";
import { SettingsService } from "../service/settings.service";

export const gameCreatedEffect = createEffect(
    () => {
        const settingsService = inject(SettingsService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.created),
            tap(() => settingsService.save())
        );
    },
    { functional: true, dispatch: false }
);

export const gameSelectPointOnMapEffect = createEffect(
    () => {
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.selectPointOnMap),
            tap(a => gameService.selectPointOnMap(a.x, a.y))
        );
    },
    { functional: true, dispatch: false }
);

export const gameBuyBuildingEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.buyBuilding),
            tap(a => gameService.buyBuilding(a.x, a.y))
        );
    },
    { functional: true, dispatch: false }
);

export const gameSellBuildingEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.sellBuilding),
            tap(a => gameService.sellBuilding(a.x, a.y))
        );
    },
    { functional: true, dispatch: false }
);

export const gameHarvestEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.harvest),
            tap(s => gameService.harvest(s.soilType))
        );
    },
    { functional: true, dispatch: false }
);


export const gamePutDisasterEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.putDisaster),
            tap(c => gameService.putDisaster(c.x, c.y))
        );
    },
    { functional: true, dispatch: false }
);


export const gameSellEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.sell),
            tap(a => gameService.sell(a.productType))
        );
    },
    { functional: true, dispatch: false }
);

export const gameNextPlayerEffect = createEffect(
    () => { 
        const gameService = inject(GameService);
        return inject(Actions).pipe(
            ofType(gameActionGroup.nextPlayer),
            tap(_ => gameService.nextPlayer())
        );
    },
    { functional: true, dispatch: false }
);