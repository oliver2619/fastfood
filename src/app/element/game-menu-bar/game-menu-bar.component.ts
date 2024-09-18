import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { selectNextPlayerEnabled } from '../../selector/game-selector';
import { TranslateDirective } from '../translate.directive';

@Component({
  selector: 'ff-game-menu-bar',
  standalone: true,
  imports: [TranslateDirective, RouterModule],
  templateUrl: './game-menu-bar.component.html',
  styleUrl: './game-menu-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameMenuBarComponent {

  readonly canNext = signal(true);

  constructor(private readonly store: Store) {
    store.select(selectNextPlayerEnabled).subscribe({
      next: flag => this.canNext.set(flag)
    });
  }

  next() {
    this.store.dispatch(gameActionGroup.nextPlayer());
  }
}
