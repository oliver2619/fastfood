import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../service/translate/translate.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  constructor(private readonly translateService: TranslateService) {}

  transform(value: unknown, ..._: unknown[]): string {
    return this.translateService.get(String(value));
  }

}
