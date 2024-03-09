import {afterNextRender, Injectable} from "@angular/core";
import {TGeneralConfig, TUserData} from "../types/types";
import {FirestoreSubscribeService} from "./firestore-subscribe.service";


@Injectable({
  providedIn: 'root'
})

export class AppDataService {
  private uid: string;
  private userName: string;
  public generalConfig: any;
  public userData: TUserData | undefined;
  public currentPageName: string;


  constructor() {
    this.uid = '';
    this.userName = '';
    this.generalConfig = {};
    this.currentPageName = '';
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
