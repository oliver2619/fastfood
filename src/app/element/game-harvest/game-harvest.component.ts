import { ChangeDetectionStrategy, Component, computed, signal, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { SoilType } from '../../model/soil-type';
import { selectUserSoils } from '../../selector/game-selector';
import { TranslateDirective } from '../translate.directive';
import { FrameComponent } from "../frame/frame.component";

@Component({
    selector: 'ff-game-harvest',
    standalone: true,
    templateUrl: './game-harvest.component.html',
    styleUrl: './game-harvest.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslateDirective, FrameComponent]
})
export class GameHarvestComponent {

  @ViewChild(FrameComponent)
  frame: FrameComponent | undefined;

  readonly farm = signal(0);
  readonly field = signal(0);
  readonly plantation = signal(0);

  readonly steak = signal(0);
  readonly nugget = signal(0);
  readonly bread = signal(0);
  readonly potato = signal(0);
  readonly cola = signal(0);
  readonly coffee = signal(0);
  readonly customers = signal(0);

  readonly farmEnabled = computed(() => this.farm() > 0);
  readonly fieldEnabled = computed(() => this.field() > 0);
  readonly plantationEnabled = computed(() => this.plantation() > 0);

  constructor(private readonly store: Store) {
    store.select(selectUserSoils).subscribe({
      next: s => {
        this.steak.set(s.soils.steak);
        this.nugget.set(s.soils.nugget);
        this.bread.set(s.soils.bread);
        this.potato.set(s.soils.potato);
        this.cola.set(s.soils.cola);
        this.coffee.set(s.soils.coffee);
        this.customers.set(s.harvests.city);
        this.farm.set(s.harvests.farm);
        this.field.set(s.harvests.field);
        this.plantation.set(s.harvests.plantation);
      }
    });
  }

  harvestSteak() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.STEAK }));
  }

  harvestNugget() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.NUGGET }));
  }

  harvestBread() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.BREAD }));
  }

  harvestPotato() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.POTATO }));
  }

  harvestCola() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.COLA }));
  }

  harvestCoffee() {
    this.store.dispatch(gameActionGroup.harvest({ soilType: SoilType.COFFEE }));
  }

  fadeout(): Promise<void> {
    return this.frame?.close() ?? Promise.resolve();
  }
}
