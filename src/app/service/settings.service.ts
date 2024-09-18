import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { settingsActionGroup, SettingsLoadedAction } from '../action/settings-action-group';
import { selectSettings } from '../selector/settings-selector';
import { AnimationSpeed } from '../state/animation-speed';
import { InitialMoney } from '../state/initial-money';
import { PlayerAiLevel } from '../state/player-ai-level';
import { SettingsState } from '../state/settings-state';
import { LocalStorageService } from './local-storage.service';

interface PlayerSettingsJson {
  readonly ai: PlayerAiLevel;
}

interface NewGameJson {
  readonly numberOfPlayers: number;
  readonly initialMoney: InitialMoney;
  readonly initialBuildings: number;
  readonly players: PlayerSettingsJson[];
}

interface SettingsJson {
  readonly version: 1;
  readonly username: string;
  readonly animationSpeed: AnimationSpeed;
  readonly showStatisticsWithDisaster: boolean;
  readonly newGame: NewGameJson;
}

const KEY = 'settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private lastSettings: SettingsState | undefined;

  constructor(private readonly localStorageService: LocalStorageService, private readonly store: Store) {
    store.select(selectSettings).subscribe({
      next: settings => this.lastSettings = settings
    });
  }

  load() {
    if (this.localStorageService.has(KEY)) {
      const settings = this.localStorageService.load<SettingsJson>(KEY);
      const action: SettingsLoadedAction = {
        username: settings.username,
        animationSpeed: settings.animationSpeed,
        showStatisticsWithDisaster: settings.showStatisticsWithDisaster,
        newGame: {
          initialBuildings: settings.newGame.initialBuildings,
          initialMoney: settings.newGame.initialMoney,
          numberOfPlayers: settings.newGame.numberOfPlayers,
          players: settings.newGame.players.map(it => ({ ai: it.ai }))
        }
      };
      this.store.dispatch(settingsActionGroup.loaded(action));
    }
  }

  save() {
    if (this.lastSettings != undefined) {
      const json: SettingsJson = {
        version: 1,
        username: this.lastSettings.username,
        animationSpeed: this.lastSettings.animationSpeed,
        showStatisticsWithDisaster: this.lastSettings.showStatisticsWithDisaster,
        newGame: {
          initialBuildings: this.lastSettings.newGame.initialBuildings,
          initialMoney: this.lastSettings.newGame.initialMoney,
          numberOfPlayers: this.lastSettings.newGame.numberOfPlayers,
          players: this.lastSettings.newGame.players.map(it => ({ ai: it.ai }))
        }
      };
      this.localStorageService.save(KEY, json);
    }
  }
}
