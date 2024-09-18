import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { GamePhase } from '../../model/game-phase';
import { Product } from '../../model/product';
import { ProductType } from '../../model/product-type';
import { SoilType } from '../../model/soil-type';
import { Soils } from '../../model/soils';
import { selectGamePhase, selectUserSoils } from '../../selector/game-selector';
import { MoneyPipe } from '../money.pipe';
import { TranslateDirective } from '../translate.directive';

interface Element {
  readonly type: ProductType;
  readonly soils: string[];
  readonly price: number;
}

@Component({
  selector: 'ff-game-sell',
  standalone: true,
  imports: [TranslateDirective, MoneyPipe],
  templateUrl: './game-sell.component.html',
  styleUrl: './game-sell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.hidden]': '!visible()'
  }
})
export class GameSellComponent {

  readonly visible = signal(false);
  
  readonly products: Element[] = Product.ALL.map(it => ({
    price: it.sellCosts,
    soils: it.soilsArray.map(s => `images/${SoilType[s].toLocaleLowerCase()}.png`),
    type: it.type
  }));

  readonly available = signal<number[]>([]);
  readonly customers = signal(0);
  readonly canSell = computed(() => this.available().map(it => it > 0 && this.customers() > 0));

  constructor(private readonly store: Store) {
    store.select(selectUserSoils).subscribe({
      next: soils => {
        this.customers.set(soils.harvests.city)
        const s = Soils.fromState(soils.soils);
        this.available.set(Product.ALL.map(it => Math.min(it.getSellAmount(s), soils.harvests.city)));
      }
    });
    store.select(selectGamePhase).subscribe({
      next: phase => this.visible.set(phase === GamePhase.SELL)
    });
  }

  sell(productType: ProductType) {
    this.store.dispatch(gameActionGroup.sell({productType}));
  }
}
