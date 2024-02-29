import {Injectable} from "@angular/core";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {TUserData} from "../types/types";


@Injectable({
  providedIn: 'root'
})

export class CommunicationService {
  /**
   * Subject to handle login subscription
   * Notifies when user has logged into
   * @private
   */
  private loginSubject: Subject<void> = new Subject<void>();

  /**
   * Replay Subject to handle user data changed
   * Notifies when user data has changed with previous value
   * @private
   */
  private userDataSubject: ReplaySubject<TUserData> = new ReplaySubject<TUserData>();

  public subscribeLoginSubject$ = this.loginSubject.asObservable();
  public subscribeUserData$ = this.userDataSubject.asObservable();


  /**
   * Emit login success
   * @public
   */
  public emitLoginSuccess() {
    this.loginSubject.next();
  }

  /**
   * Emit new user data when changes
   * @param userData
   */
  public emitNewUserData(userData: TUserData) {
    this.userDataSubject.next(userData);
  }

}
