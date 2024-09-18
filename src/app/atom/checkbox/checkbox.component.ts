import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ff-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.active]': 'active()' }
})
export class CheckboxComponent implements OnChanges, AfterViewInit {

  @Input('checkbox-id')
  checkboxId = '';

  @Input()
  control: AbstractControl<boolean> | undefined;

  @ViewChild('input')
  input: ElementRef<HTMLInputElement> | undefined;

  readonly value = signal(false);
  readonly active = signal(false);

  private locked = false;
  private subscription: Subscription | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] != undefined) {
      if (this.subscription != undefined) {
        this.subscription.unsubscribe();
        this.subscription = undefined;
      }
      if (this.control != undefined) {
        this.value.set(this.control.value);
        this.subscription = this.control.valueChanges.subscribe({
          next: value => {
            if (!this.locked) {
              this.value.set(value);
            }
          }
        });
      }
    }
  }

  ngAfterViewInit(): void {
    if(this.input != undefined) {
      this.active.set(this.input.nativeElement === document.activeElement);
    }
  }

  @HostListener('click')
  onClick() {
    this.value.set(!this.value());
    if (this.control != undefined) {
      this.doLocked(() => this.control!.setValue(this.value()));
    }
    if(this.input != undefined) {
      this.input.nativeElement.focus();
    }
  }

  onBlur() {
    this.active.set(false);
  }

  onFocus() {
    this.active.set(true);
  }

  private doLocked(callback: () => void) {
    this.locked = true;
    try {
      callback();
    } finally {
      this.locked = false;
    }
  }

}
