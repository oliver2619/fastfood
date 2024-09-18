import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../selector/game-selector';
import { MoneyPipe } from "../money.pipe";

@Component({
    selector: 'ff-game-overlay-soils',
    standalone: true,
    templateUrl: './game-overlay-soils.component.html',
    styleUrl: './game-overlay-soils.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MoneyPipe]
})
export class GameOverlaySoilsComponent {

    readonly money = signal(0);
    readonly turnover = signal(0);

    constructor(store: Store) {
        store.select(selectUser).subscribe({
            next: user => {
                this.money.set(user.money);
                this.turnover.set(-user.costsPerRound);
            }
        });
    }
}
