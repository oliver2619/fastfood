import { ApplicationConfig, APP_INITIALIZER, ErrorHandler, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore, Store } from '@ngrx/store';
import { applicationActionGroup } from './action/application-action-group';
import { settingsReducer } from './reducer/settings-reducer';
import { provideEffects } from '@ngrx/effects';
import * as applicationEffects from './effect/application-effects';
import * as settingsEffects from './effect/settings-effects';
import * as gameEffects from './effect/game-effects';
import { fastfoodErrorHandler } from './error-handler';
import { messagesReducer } from './reducer/messages-reducer';
import { gameReducer } from './reducer/game-reducer';
import { gameSetupReducer } from './reducer/game-setup-reducer';
import { selectionReducer } from './reducer/selection-reducer';
import { provideServiceWorker } from '@angular/service-worker';

function initApp(store: Store): () => Promise<void> {
  return () => {
    store.dispatch(applicationActionGroup.started());
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideStore(),
    provideState({ name: 'game', reducer: gameReducer }),
    provideState({ name: 'game-setup', reducer: gameSetupReducer }),
    provideState({ name: 'messages', reducer: messagesReducer }),
    provideState({ name: 'selection', reducer: selectionReducer }),
    provideState({ name: 'settings', reducer: settingsReducer }),
    provideEffects(applicationEffects, settingsEffects, gameEffects),
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [Store], multi: true },
    { provide: ErrorHandler, useFactory: fastfoodErrorHandler, deps: [Store] }, 
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:50000'
    })
  ]
};
