import {afterNextRender, Injectable} from "@angular/core";
import {TGeneralConfig} from "../types/types";


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
    return localStorage.getItem('uid') || '';
  }

  setUserId(uid: string) {
    localStorage?.setItem('uid', uid);
  }

  getUserName() {
    return localStorage?.getItem('userName') || '';
  }

  setUserName(userName: string) {
    localStorage?.setItem('userName', userName);
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
