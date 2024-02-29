import {afterNextRender, Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class AppDataService {
  uid: string;
  userName: string;
  generalConfig: any;

  constructor() {
    this.uid = '';
    this.userName = '';
    this.generalConfig = {};
  }

  getUserId() {
    return window.localStorage?.getItem('uid') || '';
  }

  setUserId(uid: string) {
    window.localStorage?.setItem('uid', uid);
  }

  getUserName() {
    return window.localStorage?.getItem('userName') || '';
  }

  setUserName(userName: string) {
    window.localStorage?.setItem('userName', userName);
  }

  clearLocalStorage() {
    window.localStorage.clear();
  }
}
