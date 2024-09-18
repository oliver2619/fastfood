import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { GamePhase } from '../../model/game-phase';
import { selectGamePhase, selectPlayerIndexOnTurn, selectPlayerOnTurn, selectUserOnTurn } from '../../selector/game-selector';
import { selectSelectedBuilding } from '../../selector/selection-selector';
import { SelectedBuildingState } from '../../state/selection-state';
import { MoneyPipe } from '../money.pipe';
import { TranslateDirective } from '../translate.directive';

@Component({
  selector: 'ff-game-building',
  standalone: true,
  imports: [TranslateDirective, MoneyPipe],
  templateUrl: './game-building.component.html',
  styleUrl: './game-building.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.hidden]': '!visible()'
  }
})
export class GameBuildingComponent {

  readonly buyCosts = signal(0);
  readonly sellCosts = signal(0);
  readonly turnover = signal(0);

  readonly visible = signal(false);

  private readonly x = signal(0);
  private readonly y = signal(0);
  private readonly size = signal(0);
  private readonly owner = signal(-1);
  private readonly phase = signal(GamePhase.GAME_OVER);
  private readonly playerIndexOnTurn = signal(-1);
  private readonly userOnTurn = signal(false);
  private readonly userMoney = signal(0);

  readonly canBuy = computed(() => this.size() === 0 && this.userOnTurn() && this.phase() === GamePhase.BUILD && this.userMoney() >= this.buyCosts());
  readonly canUpgrade = computed(() => this.size() === 1 && this.playerIndexOnTurn() === this.owner() && this.userOnTurn() && this.phase() === GamePhase.BUILD && this.userMoney() >= this.buyCosts());
  readonly canSell = computed(() => this.size() > 0 && this.playerIndexOnTurn() === this.owner() && this.userOnTurn() && this.phase() === GamePhase.BUILD);
  readonly canPut = computed(() => (this.size() == 0 || (this.size() === 1 && this.playerIndexOnTurn() === this.owner())) && (this.phase() === GamePhase.SET_FIRST_BUILDING || this.phase() === GamePhase.SET_SECOND_BUILDING) && this.userOnTurn());

  constructor(private readonly store: Store) {
    store.select(selectSelectedBuilding).subscribe({
      next: b => {
        if (b != undefined) {
          this.show(b);
        } else {
          this.visible.set(false);
        }
      }
    });
    store.select(selectGamePhase).subscribe({
      next: p => this.phase.set(p)
    });
    store.select(selectPlayerIndexOnTurn).subscribe({
      next: i => this.playerIndexOnTurn.set(i)
    });
    store.select(selectPlayerOnTurn).subscribe({
      next: p => this.userMoney.set(p.money)
    });
    store.select(selectUserOnTurn).subscribe({
      next: f => this.userOnTurn.set(f)
    });
  }

  buy() {
    this.store.dispatch(gameActionGroup.buyBuilding({ x: this.x(), y: this.y() }));
  }

  cancel() {
    this.store.dispatch(gameActionGroup.deselectBuilding());
  }

  sell() {
    this.store.dispatch(gameActionGroup.sellBuilding({ x: this.x(), y: this.y() }));
  }

  private show(state: SelectedBuildingState) {
    this.x.set(state.x);
    this.y.set(state.y);
    this.size.set(state.size);
    this.owner.set(state.owner == undefined ? -1 : state.owner);
    this.buyCosts.set(state.buyCosts);
    this.sellCosts.set(state.sellCosts);
    this.turnover.set(state.turnoverBonus);
    this.visible.set(true);
  }
}
