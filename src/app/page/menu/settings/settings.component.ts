import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { settingsActionGroup } from '../../../action/settings-action-group';
import { TranslateDirective } from '../../../element/translate.directive';
import { selectSettings } from '../../../selector/settings-selector';
import { AnimationSpeed } from '../../../state/animation-speed';
import { FrameComponent } from "../../../element/frame/frame.component";
import { FrameButtonDirective } from '../../../element/frame-button.directive';
import { TranslatePipe } from '../../../pipe/translate.pipe';

interface SettingsComponentValue {
  username: string;
  animationSpeed: AnimationSpeed;
}

@Component({
    selector: 'ff-settings',
    standalone: true,
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, TranslateDirective, FormsModule, ReactiveFormsModule, TranslatePipe, FrameComponent, FrameButtonDirective]
})
export class SettingsComponent implements AfterViewInit {

  @ViewChild('input')
  input: ElementRef<HTMLInputElement> | undefined;

  readonly formGroup: FormGroup;

  get canSave(): boolean {
    return this.formGroup.valid;
  }

  get value(): SettingsComponentValue {
    return this.formGroup.value;
  }

  constructor(private readonly router: Router, private readonly store: Store, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('username', formBuilder.control('', [Validators.required]));
    this.formGroup.addControl('animationSpeed', formBuilder.control('', [Validators.required]));
    store.select(selectSettings).subscribe({
      next: settings => {
        const v = this.value
        v.username = settings.username;
        v.animationSpeed = settings.animationSpeed;
        this.formGroup.setValue(v);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.input != undefined) {
      this.input.nativeElement.focus();
    }
  }

  cancel() {
    this.router.navigateByUrl('/menu');
  }

  save() {
    this.store.dispatch(settingsActionGroup.settingsChanged({
      username: this.value.username,
      animationSpeed: this.value.animationSpeed
    }));
    this.router.navigateByUrl('/menu');
  }
}
