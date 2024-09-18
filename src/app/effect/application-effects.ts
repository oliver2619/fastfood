import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";
import { applicationActionGroup } from "../action/application-action-group";
import { SettingsService } from "../service/settings.service";

export const applicationStartedEffect = createEffect(
    () => {
        const settingsService = inject(SettingsService);
        return inject(Actions).pipe(
            ofType(applicationActionGroup.started),
            tap(() => settingsService.load())
        );
    },
    { functional: true, dispatch: false }
);