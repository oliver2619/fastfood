import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { settingsActionGroup } from '../../action/settings-action-group';
import { selectSettings } from '../../selector/settings-selector';
import { AnimationSpeed } from '../../state/animation-speed';
import { TranslateDirective } from '../translate.directive';
import { FrameComponent } from "../frame/frame.component";
import { FrameButtonDirective } from '../frame-button.directive';

interface GameSettingsComponentValue {
  animationSpeed: AnimationSpeed;
}

@Component({
    selector: 'ff-game-settings',
    standalone: true,
    templateUrl: './game-settings.component.html',
    styleUrl: './game-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, FormsModule, ReactiveFormsModule, TranslateDirective, FrameComponent, FrameButtonDirective]
})
export class GameSettingsComponent {

  readonly formGroup: FormGroup;

  private get value(): GameSettingsComponentValue {
    return this.formGroup.value;
  }

  constructor(private readonly router: Router, private readonly store: Store, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('animationSpeed', formBuilder.control('slow'));
    store.select(selectSettings).subscribe({
      next: settings => {
        const v = this.value;
        v.animationSpeed = settings.animationSpeed;
        this.formGroup.setValue(v);
      }
    });
  }

  cancel() {
    this.router.navigateByUrl('/game');
  }
  
  save() {
    const v = this.value;
    this.store.dispatch(settingsActionGroup.gameSettingsChanged({ animationSpeed: v.animationSpeed }));
    this.router.navigateByUrl('/game');
  }
}
