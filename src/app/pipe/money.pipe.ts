import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '../service/translate/translate.service';

@Pipe({
  name: 'money',
  standalone: true
})
export class MoneyPipe implements PipeTransform {

  private readonly decimalPipe: DecimalPipe;

  constructor(translateService: TranslateService) {
    this.decimalPipe = translateService.getDecimalPipe();
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'number') {
      const digit = args.length > 0 && typeof args[0] === 'number' ? args[0].toString() : '0';
      return `${this.decimalPipe.transform(value, `1.${digit}-${digit}`)} kC`;
    } else {
      return value;
    }
  }
}
