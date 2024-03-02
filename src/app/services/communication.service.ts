import {Injectable} from "@angular/core";
import {ReplaySubject, Subject} from "rxjs";
import {TAlert, TDialog, TUserData} from "../types/types";


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
  public subscribeLoginSubject$ = this.loginSubject.asObservable();
  public emitLoginSuccess() {
    this.loginSubject.next();
  }

  /**
   * Replay Subject to handle user data changed
   * Notifies when user data has changed with previous value
   * @private
   */
  private userDataSubject: ReplaySubject<TUserData> = new ReplaySubject<TUserData>();
  public subscribeUserData$ = this.userDataSubject.asObservable();
  public emitNewUserData(userData: TUserData) {
    this.userDataSubject.next(userData);
  }

  /**
   * Logic to open alert with close event response
   * @private
   */
  private alertSubject: Subject<TAlert> = new Subject<TAlert>();
  private alertCloseSubject: Subject<TAlert> = new Subject<TAlert>();

  public subscribeAlertData$ = this.alertSubject.asObservable();
  public subscribeAlertClosed$ = this.alertCloseSubject.asObservable();
  public emitAlertData(alert: TAlert) {
    this.alertSubject.next(alert);
  }

  public emitAlertCloseEvent(alert: TAlert) {
    this.alertCloseSubject.next(alert);
  }

  /**
   * Handle dialog modal behavior
   * @private
   */

  private dialogModalSubject: Subject<TDialog> = new Subject<TDialog>();
  private dialogModalCallbackEvent: Subject<string> = new Subject<string>();

  public subscribeDialogData$ = this.dialogModalSubject.asObservable();
  public subscribeDialogCallbackEvent$ = this.dialogModalCallbackEvent.asObservable();

  public emitDialogData(data: TDialog) {
    this.dialogModalSubject.next(data);
  }

  public emitDialogCallbackEvent(event: string) {
    this.dialogModalCallbackEvent.next(event);
  }


  private spinnerSubject: Subject<'open' | 'close'> = new Subject<'open' | 'close'>();
  public subscribeOpenSpinner$ = this.spinnerSubject.asObservable();

  public openSpinner() {
    this.spinnerSubject.next('open');
  }

  public closeSpinner() {
    this.spinnerSubject.next('close');
  }






}
