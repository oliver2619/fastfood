import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateService } from '../service/translate/translate.service';

@Directive({
  selector: '[ffTranslate]',
  standalone: true
})
export class TranslateDirective implements OnInit {

  @Input("ffTranslate")
  text: string | undefined;

  constructor(private readonly translateService: TranslateService, private readonly elementRef: ElementRef<HTMLElement>) { }

  ngOnInit() {
    if(this.text != undefined) {
      this.elementRef.nativeElement.innerText = this.translateService.get(this.text);
    }
  }

}
