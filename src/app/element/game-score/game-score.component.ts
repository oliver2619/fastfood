import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { GamePhase } from '../../model/game-phase';
import { PlayernamePipe } from '../../pipe/playername.pipe';
import { selectGamePhase, selectPlayersSorted, selectRemainingScore } from '../../selector/game-selector';
import { MoneyPipe } from '../money.pipe';
import { TranslateDirective } from '../translate.directive';
import { FrameComponent } from "../frame/frame.component";
import { FrameButtonDirective } from '../frame-button.directive';

interface Element {
  readonly color: string;
  readonly score: number;
  readonly money: number;
}

@Component({
    selector: 'ff-game-score',
    standalone: true,
    templateUrl: './game-score.component.html',
    styleUrl: './game-score.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, TranslateDirective, MoneyPipe, PlayernamePipe, FrameComponent, FrameButtonDirective]
})
export class GameScoreComponent {

  readonly isGameOver = signal(false);
  readonly remainingScore = signal(0);
  readonly players = signal<Element[]>([]);

  constructor(private readonly router: Router, store: Store) {
    store.select(selectGamePhase).subscribe({
      next: phase => this.isGameOver.set(phase === GamePhase.GAME_OVER)
    });
    store.select(selectRemainingScore).subscribe({
      next: s => this.remainingScore.set(s)
    });
    store.select(selectPlayersSorted).subscribe({
      next: players => this.players.set(players.map(p => ({
        color: p.color,
        money: p.money,
        score: p.score
      })))
    });
  }

  close() {
    this.router.navigateByUrl('/game');
  }
}
