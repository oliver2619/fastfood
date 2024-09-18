import { Injectable } from '@angular/core';
import { TextDictionary } from './text-dictionary';
import { translationsDe } from './translations-de';
import { translationsEn } from './translations-en';

import { DecimalPipe, registerLocaleData } from '@angular/common';

import de from '@angular/common/locales/de';
import en from '@angular/common/locales/en';

registerLocaleData(de);
registerLocaleData(en);

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private readonly translations: TextDictionary;

  constructor() {
    this.translations = TranslateService.getDictionary();
  }

  get(text: string): string {
    const found = this.translations[text];
    if (found == undefined) {
      console.warn(`Text ${text} is not translated`);
      return text;
    }
    return found;
  }

  getColor(color: string): string {
    return this.get(`color.${color}`);
  }
  
  getDecimalPipe(): DecimalPipe {
    return new DecimalPipe(TranslateService.getLanguage());
  }

  private static getDictionary(): TextDictionary {
    switch (this.getLanguage()) {
      case 'de':
        return translationsDe;
      case 'en':
        return translationsEn;
    }
  }

  private static getLanguage(): 'de' | 'en' {
    const result = /^([A-Z]+)/i.exec(navigator.language);
    if (result == null) {
      return 'en';
    }
    switch (result[1].toLocaleLowerCase()) {
      case 'de':
        return 'de';
      default:
        return 'en';
    }
  }
}
