import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FrameComponentPort } from './frame/frame.component';

@Directive({
  selector: '[ffFrameButton]',
  standalone: true
})
export class FrameButtonDirective {

  @Input('ffFrameButton')
  frame: FrameComponentPort | undefined;

  @Output('after-click')
  readonly afterClick = new EventEmitter<void>();

  @HostListener('click')
  onClick() {
    if(this.frame != undefined) {
      this.frame.close().then(() => this.afterClick.emit());
    }
  }
}
