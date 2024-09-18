import { Injectable } from '@angular/core';

const PREFIX = 'fastfood2:';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  has(key: string): boolean {
    return localStorage.getItem(`${PREFIX}${key}`) != null;
  }

  load<V>(key: string): V {
    const fullKey = `${PREFIX}${key}`;
    const found = localStorage.getItem(fullKey);
    if (found == null) {
      throw new RangeError(`No entry for key ${fullKey} found in local storage`);
    }
    return JSON.parse(found);
  }

  remove(key: string) {
    localStorage.removeItem(`${PREFIX}${key}`);
  }

  save(key: string, value: any) {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  }
}
