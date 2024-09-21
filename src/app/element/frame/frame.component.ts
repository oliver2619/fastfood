import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';

export interface FrameComponentPort {

  close(): Promise<void>;
}

@Component({
  selector: 'ff-frame',
  standalone: true,
  imports: [],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.popup]': 'visible()', '[class.popdown]': '!visible()' }
})
export class FrameComponent implements FrameComponentPort {

  readonly visible = signal(true);

  private resolve: ((value: void) => void) | undefined;
  private readonly closePromise = new Promise<void>((resolve, _) => this.resolve = resolve);

  close(): Promise<void> {
    this.visible.set(false);
    return this.closePromise;
  }

  @HostListener('animationend')
  onEndAnimation() {
    if (!this.visible() && this.resolve != undefined) {
      this.resolve();
    }
  }
}
