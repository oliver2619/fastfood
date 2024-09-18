import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { FieldType } from '../../model/field-type';
import { selectUserOnTurn } from '../../selector/game-selector';
import { selectSelectedField } from '../../selector/selection-selector';
import { TranslateService } from '../../service/translate/translate.service';
import { SelectedFieldState } from '../../state/selection-state';
import { TranslateDirective } from '../translate.directive';

@Component({
  selector: 'ff-game-field-options',
  standalone: true,
  imports: [TranslateDirective],
  templateUrl: './game-field-options.component.html',
  styleUrl: './game-field-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.hidden]': '!visible()'
  }
})
export class GameFieldOptionsComponent {

  readonly visible = signal(false);
  readonly canRemoveDisaster = signal(false);
  readonly hasDisaster = signal(false);
  readonly title = signal('');

  private readonly x = signal(0);
  private readonly y = signal(0);
  private readonly type = signal(FieldType.CITY);
  private readonly userOnTurn = signal(false);
  private readonly putDisasterEnabled = signal(false);

  readonly canPutDisaster = computed(() => this.putDisasterEnabled() && this.userOnTurn());

  constructor(private readonly store: Store, private readonly translationService: TranslateService) {
    store.select(selectSelectedField).subscribe({
      next: f => {
        if (f != undefined) {
          this.show(f);
        } else {
          this.visible.set(false);
        }
      }
    });
    store.select(selectUserOnTurn).subscribe({
      next: f => {
        this.userOnTurn.set(f);
      }
    });
  }

  cancel() {
    this.store.dispatch(gameActionGroup.deselectField());
  }

  putDisaster() {
    this.store.dispatch(gameActionGroup.putDisaster({ x: this.x(), y: this.y() }));
  }

  removeDisaster() {
  }

  private show(s: SelectedFieldState) {
    this.x.set(s.x);
    this.y.set(s.y);
    this.type.set(s.fieldType);
    this.title.set(this.translationService.get(`game.field.title.${FieldType[s.fieldType].toLocaleLowerCase()}`));
    this.putDisasterEnabled.set(s.canPutDisaster);
    this.hasDisaster.set(s.hasDisaster);
    this.visible.set(true);
  }
}
