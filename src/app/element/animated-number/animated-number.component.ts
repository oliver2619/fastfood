import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, signal, SimpleChanges } from '@angular/core';
import { MoneyPipe } from '../../pipe/money.pipe';

const DURATION = 1200;

@Component({
  selector: 'ff-animated-number',
  standalone: true,
  imports: [MoneyPipe, DecimalPipe],
  templateUrl: './animated-number.component.html',
  styleUrl: './animated-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedNumberComponent implements OnChanges, OnDestroy {

  @Input()
  value = 0;

  @Input()
  money = false;

  @Input()
  digits = 0;

  readonly current = signal(0);

  private animation: number | undefined;
  private timeout: number | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] != undefined) {
      if (this.current() !== this.value) {
        this.startTimer();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer() {
    if (this.animation == undefined) {
      this.animation = window.setInterval(() => this.onTimer(), 10);
    }
    if(this.timeout != undefined) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      this.timeout = undefined;
      this.current.set(this.value);
      this.stopTimer();
    }, DURATION);
  }

  private stopTimer() {
    if (this.animation != undefined) {
      window.clearInterval(this.animation);
      this.animation = undefined;
    }
    if(this.timeout != undefined) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }

  private onTimer() {
    const distance = (this.value - this.current()) * 0.1;
    this.current.set(this.current() + distance);
  }
}
