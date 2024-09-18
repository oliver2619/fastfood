import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";
import { settingsActionGroup } from "../action/settings-action-group";
import { SettingsService } from "../service/settings.service";

export const applicationStartedEffect = createEffect(
    () => {
        const settingsService = inject(SettingsService);
        return inject(Actions).pipe(
            ofType(settingsActionGroup.settingsChanged, settingsActionGroup.gameSettingsChanged, settingsActionGroup.showStatisticsWithDisaster),
            tap(() => settingsService.save())
        );
    },
    { functional: true, dispatch: false }
);
