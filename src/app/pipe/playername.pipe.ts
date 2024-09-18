import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserColor } from '../selector/game-setup-selector';
import { selectUsername } from '../selector/settings-selector';
import { TranslateService } from '../service/translate/translate.service';

@Pipe({
  name: 'playername',
  standalone: true
})
export class PlayernamePipe implements PipeTransform {

  private userColor = '';
  private username = '';

  constructor(private readonly translateService: TranslateService, store: Store) {
    store.select(selectUserColor).subscribe({
      next: c => this.userColor = c
    });
    store.select(selectUsername).subscribe({
      next: n => this.username = n
    });
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    if(typeof value !== 'string') {
      return value;
    }
    if(value === this.userColor) {
      return this.username;
    }else {
      return this.translateService.getColor(value);
    }
  }

}
