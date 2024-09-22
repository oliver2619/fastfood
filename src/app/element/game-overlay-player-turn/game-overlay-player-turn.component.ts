import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GamePhase } from '../../model/game-phase';
import { selectGamePhase, selectPlayerOnTurn, selectUser, selectUserOnTurn } from '../../selector/game-selector';
import { TranslateDirective } from '../translate.directive';
import { PlayernamePipe } from "../../pipe/playername.pipe";

@Component({
  selector: 'ff-game-overlay-player-turn',
  standalone: true,
  templateUrl: './game-overlay-player-turn.component.html',
  styleUrl: './game-overlay-player-turn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateDirective, PlayernamePipe]
})
export class GameOverlayPlayerTurnComponent {

  private readonly outOfMoney = signal(false);
  private readonly gamePhaseBuild = signal(false);
  private readonly userOnTurn = signal(false);

  readonly colorOnTurn = signal('red');
  readonly flipIn = signal(true);
  readonly hasUnplacedBuilding = signal(true);
  readonly hasDisaster = signal(false);
  readonly isOver = signal(false);
  readonly needsToSell = computed(() => this.outOfMoney() && this.gamePhaseBuild() && this.userOnTurn());

  private nextPlayerOnTurn = '';

  constructor(store: Store) {
    store.select(selectUserOnTurn).subscribe({
      next: f => this.userOnTurn.set(f)
    })
    store.select(selectPlayerOnTurn).subscribe({
      next: player => {
        this.nextPlayerOnTurn = player.color;
        if (this.colorOnTurn() !== this.nextPlayerOnTurn && this.flipIn()) {
          this.flipIn.set(false);
        }
      }
    });
    store.select(selectGamePhase).subscribe({
      next: phase => {
        this.hasUnplacedBuilding.set(phase === GamePhase.SET_FIRST_BUILDING || phase === GamePhase.SET_SECOND_BUILDING);
        this.hasDisaster.set(phase === GamePhase.PUT_DISASTER);
        this.isOver.set(phase === GamePhase.GAME_OVER);
        this.gamePhaseBuild.set(phase === GamePhase.BUILD);
      }
    });
    store.select(selectUser).subscribe({
      next: player => this.outOfMoney.set(player.money < player.costsPerRound)
    });
  }

  onEndAnimation() {
    if (!this.flipIn()) {
      this.colorOnTurn.set(this.nextPlayerOnTurn);
      this.flipIn.set(true);
    }
  }
}
