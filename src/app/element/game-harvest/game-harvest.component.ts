import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { GamePhase } from '../../model/game-phase';
import { SoilType } from '../../model/soil-type';
import { selectGamePhase, selectUserSoils } from '../../selector/game-selector';
import { TranslateDirective } from '../translate.directive';

@Component({
  selector: 'ff-game-harvest',
  standalone: true,
  imports: [TranslateDirective],
  templateUrl: './game-harvest.component.html',
  styleUrl: './game-harvest.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.hidden]': '!visible()'
  }
})
export class GameHarvestComponent {

  readonly visible = signal(false);
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
    store.select(selectGamePhase).subscribe({
      next: phase => this.visible.set(phase === GamePhase.HARVEST)
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
}
