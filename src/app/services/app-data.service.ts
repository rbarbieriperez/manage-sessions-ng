import {afterNextRender, Injectable} from "@angular/core";
import {TGeneralConfig, TUserData} from "../types/types";
import {FirestoreSubscribeService} from "./firestore-subscribe.service";


@Injectable({
  providedIn: 'root'
})

export class AppDataService {
  uid: string;
  userName: string;
  generalConfig: any;
  userData: TUserData | undefined;

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
