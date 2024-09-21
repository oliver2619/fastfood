import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { settingsActionGroup } from '../../action/settings-action-group';
import { selectUserStatistics } from '../../selector/game-selector';
import { selectShowSettingsWithDisaster } from '../../selector/settings-selector';
import { TranslateDirective } from '../translate.directive';
import { CheckboxComponent } from "../../atom/checkbox/checkbox.component";
import { FrameComponent } from "../frame/frame.component";
import { FrameButtonDirective } from '../frame-button.directive';
import { AnimatedNumberComponent } from '../animated-number/animated-number.component';
import { MoneyPipe } from '../../pipe/money.pipe';

interface GameStatisticsComponentValue {
  withDisaster: boolean;
}

@Component({
    selector: 'ff-game-statistics',
    standalone: true,
    templateUrl: './game-statistics.component.html',
    styleUrl: './game-statistics.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, FormsModule, ReactiveFormsModule, DecimalPipe, MoneyPipe, TranslateDirective, CheckboxComponent, FrameComponent, FrameButtonDirective, AnimatedNumberComponent]
})
export class GameStatisticsComponent {

  readonly formGroup: FormGroup;

  readonly farm = signal(0);
  readonly field = signal(0);
  readonly plantation = signal(0);
  readonly industry = signal(0);
  readonly customers = signal(0);
  readonly turnover = signal(0);

  private get value(): GameStatisticsComponentValue {
    return this.formGroup.value;
  }

  constructor(private readonly router: Router, formBuilder: FormBuilder, store: Store) {
    this.formGroup = formBuilder.group({});
    const withDisaster = formBuilder.control(true);
    this.formGroup.addControl('withDisaster', withDisaster);
    store.select(selectShowSettingsWithDisaster).subscribe({
      next: flag => {
        const v = this.value;
        v.withDisaster = flag;
        this.formGroup.setValue(v);
      }
    });
    withDisaster.valueChanges.subscribe({
      next: v => store.dispatch(settingsActionGroup.showStatisticsWithDisaster({
        flag: v === true
      }))
    });

    store.select(selectUserStatistics).subscribe({
      next: s => {
        this.farm.set(s.vertility.farm);
        this.field.set(s.vertility.field);
        this.plantation.set(s.vertility.plantation);
        this.industry.set(s.vertility.industry);
        this.customers.set(s.vertility.city);
        this.turnover.set(s.totalTurnover);
      }
    })
  }

  close() {
    this.router.navigateByUrl('/game');
  }
}
