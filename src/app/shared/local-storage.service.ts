import { Injectable } from '@angular/core';
import { AppConstant } from './app.constant';
import { environment } from './../../environments/environment'; 
@Injectable()
export class LocalStorageService {

  prefix: string = AppConstant.LOCALSTORAGE.EMP_IMG_DTL;

  constructor() { }

  addItem(key: string, item: any) {
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  getItem(key: string) {
    var item = localStorage.getItem(this.prefix + key);
    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  clearAllItem() {
    localStorage.clear();
  }

}
