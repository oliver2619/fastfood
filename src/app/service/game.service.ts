import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../action/game-action-group';
import { Building } from '../model/building';
import { BuildingCoords } from '../model/building-coords';
import { FieldCoords } from '../model/field-coords';
import { Game, NewGameData } from '../model/game';
import { GameJson } from '../model/game-json';
import { ProductType } from '../model/product-type';
import { ReadonlyField } from '../model/readonly-field';
import { SoilType } from '../model/soil-type';
import { LocalStorageService } from './local-storage.service';

const LOCAL_STORAGE_KEY = 'game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private game: Game | undefined;

  get canContinue(): boolean {
    return this.localStorageService.has(LOCAL_STORAGE_KEY);
  }

  get hasGame(): boolean {
    return this.game != undefined;
  }

  constructor(private readonly localStorageService: LocalStorageService, private readonly store: Store) { }

  buyBuilding(x: number, y: number) {
    if (this.game != undefined) {
      this.game.buyBuilding(new BuildingCoords(x, y));
      this.save();
      this.pushState();
      this.store.dispatch(gameActionGroup.deselectBuilding());
    }
  }

  exit() {
    if (this.game != undefined && this.game.isOver) {
      this.localStorageService.remove(LOCAL_STORAGE_KEY);
      this.game = undefined;
    }
  }

  continueGame() {
    const json = this.localStorageService.load<GameJson>(LOCAL_STORAGE_KEY);
    this.game = Game.load(json);
    this.pushSetupState();
    this.pushState();
  }

  harvest(type: SoilType) {
    if (this.game != undefined) {
      this.game.harvest(type, this.game.userIndex);
      this.save();
      this.pushState();
    }
  }

  nextPlayer() {
    if (this.game != undefined) {
      this.game.nextPlayer();
      this.save();
      this.pushState();
    }
  }

  putDisaster(x: number, y: number) {
    if (this.game != undefined) {
      this.game.putDisaster(new FieldCoords(x, y));
      this.save();
      this.pushState();
      this.store.dispatch(gameActionGroup.deselectField());
    }
  }

  selectPointOnMap(x: number, y: number) {
    if (this.game == undefined) {
      return;
    }
    const f = this.getFieldByCoordinates(x, y);
    if (f != undefined) {
      const canPutDisaster = this.game.canPutDisaster(f);
      const hasDisaster = this.game.hasDisaster(f);
      this.store.dispatch(gameActionGroup.selectField({ x: f.x, y: f.y, fieldType: f.type, canPutDisaster, hasDisaster }));
      return;
    }
    const bcs = this.getBuildingByCoordinates(x, y);
    if (bcs != undefined) {
      const b = this.game.getBuilding(bcs.x, bcs.y);
      const productivity = this.game.getAllFieldsProductivityForBuilding(bcs);
      const buyCosts = Building.getBuyCosts(productivity);
      const sellCosts = b?.getSellCosts(productivity) ?? 0;
      const turnover = this.game.getEstimatedTurnover(false, this.game.userIndex);
      const turnoverBonus = (b == undefined || b.canUpgrade) ? this.game.cloneWithBuilding(this.game.userIndex, bcs).getEstimatedTurnover(false, this.game.userIndex) - turnover : 0;
      this.store.dispatch(gameActionGroup.selectBuilding({ x: bcs.x, y: bcs.y, buyCosts, owner: b?.owner.index, sellCosts, size: b?.size ?? 0, turnoverBonus }));
      return;
    }
  }

  sell(type: ProductType) {
    if (this.game != undefined) {
      this.game.sellProduct(type, this.game.userIndex);
      this.save();
      this.pushState();
    }
  }

  sellBuilding(x: number, y: number) {
    if (this.game != undefined) {
      this.game.sellBuilding(new BuildingCoords(x, y));
      this.save();
      this.pushState();
      this.store.dispatch(gameActionGroup.deselectBuilding());
    }
  }

  start(data: NewGameData) {
    this.game = Game.newGame(data);
    this.save();
    this.pushSetupState();
    this.pushState();
  }

  private getBuildingByCoordinates(x: number, y: number): BuildingCoords | undefined {
    if (((y + 1) % 3) === 0) {
      return undefined;
    }
    if ((x & 1) === 1) {
      const my = y % 6;
      if (my === 0) {
        return new BuildingCoords(x, (y / 3) | 0);
      } else if (my === 4) {
        return new BuildingCoords(x, ((y - 1) / 3) | 0);
      } else {
        return undefined;
      }
    } else {
      const my = (y + 5) % 6;
      if (my === 0) {
        return new BuildingCoords(x, ((y - 1) / 3) | 0);
      } else if (my === 2) {
        return new BuildingCoords(x, (y / 3) | 0);
      } else {
        return undefined;
      }
    }
  }

  private getFieldByCoordinates(x: number, y: number): ReadonlyField | undefined {
    if (this.game == undefined) {
      return undefined;
    }
    if ((x & 1) === 1) {
      if ((y + 5) % 6 < 3) {
        return this.game.getField(((x - 1) / 2) | 0, (y - 1) / 3 | 0);
      }
    } else {
      if ((y + 5) % 6 >= 3 && y > 0 && y < 16 && x > 0 && x < 12) {
        return this.game.getField((x / 2 - 1) | 0, (y - 1) / 3 | 0);
      }
    }
    return undefined;
  }

  private save() {
    if (this.game != undefined) {
      this.localStorageService.save(LOCAL_STORAGE_KEY, this.game.save());
    }
  }

  private pushState() {
    if (this.game != undefined) {
      this.store.dispatch(gameActionGroup.update(this.game.getState()));
    }
  }

  private pushSetupState() {
    if (this.game != undefined) {
      this.store.dispatch(gameActionGroup.updateSetup(this.game.getSetupState()));
    }
  }
}
