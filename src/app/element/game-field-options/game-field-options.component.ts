import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { gameActionGroup } from '../../action/game-action-group';
import { FieldType } from '../../model/field-type';
import { selectUserOnTurn } from '../../selector/game-selector';
import { TranslateService } from '../../service/translate/translate.service';
import { SelectedFieldState } from '../../state/selection-state';
import { TranslateDirective } from '../translate.directive';
import { FrameComponent } from "../frame/frame.component";
import { FrameButtonDirective } from '../frame-button.directive';

@Component({
    selector: 'ff-game-field-options',
    standalone: true,
    templateUrl: './game-field-options.component.html',
    styleUrl: './game-field-options.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslateDirective, FrameComponent, FrameButtonDirective]
})
export class GameFieldOptionsComponent {

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

  show(s: SelectedFieldState) {
    this.x.set(s.x);
    this.y.set(s.y);
    this.type.set(s.fieldType);
    this.title.set(this.translationService.get(`game.field.title.${FieldType[s.fieldType].toLocaleLowerCase()}`));
    this.putDisasterEnabled.set(s.canPutDisaster);
    this.hasDisaster.set(s.hasDisaster);
  }
}
