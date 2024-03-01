import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router, RouterOutlet} from "@angular/router";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {FirestoreSubscribeService} from "./services/firestore-subscribe.service";
import {TUserData} from "./types/types";
import {Subscription} from "rxjs";
import {FirestoreBackupService} from "./services/firestore-backup.service";
import {AppDataService} from "./services/app-data.service";
import {FirestoreQueriesService} from "./services/firestore-queries.service";
import {CommunicationService} from "./services/communication.service";
import {RbAlertCustomComponent} from "./components/rb-alert-custom/rb-alert-custom.component";
import {RbDialogModalCustomComponent} from "./components/rb-dialog-modal-custom/rb-dialog-modal-custom.component";
import {ErrorHandlerService} from "./services/error-handler.service";
import {RbSpinnerCustomComponent} from "./components/rb-spinner-custom/rb-spinner-custom.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AngularFirestoreModule,
    RbAlertCustomComponent,
    RbDialogModalCustomComponent,
    RbSpinnerCustomComponent
  ],
  providers: [
    FirestoreSubscribeService,
    FirestoreBackupService,
    AppDataService,
    FirestoreQueriesService,
    ErrorHandlerService
  ],
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  userData: TUserData | undefined;
  userDataSubscription: Subscription | undefined;
  loginSubscription: Subscription | undefined;
  private _backupServerInitialized: boolean;
  constructor(
    private firestoreSubscribe: FirestoreSubscribeService,
    private backupService: FirestoreBackupService,
    private appDataService: AppDataService,
    private firestoreQueries: FirestoreQueriesService,
    private communicationService: CommunicationService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
    this._backupServerInitialized = false;
  }

  private async _handleGetGeneralConfig() {
    const res = await this.firestoreQueries.getAppConfig();

    if (!res) {
      return  false;
    } else {
      return res;
    }
  }

  /**
   * Method to add subscribers to firestore
   * If userData & appConfig are fetched navigate to add-session screen
   * @private
   */
  private async _addSubscribers() {
    try {

      if (!Object.values(this.appDataService.generalConfig).length) {
        const generalConfigRes = await this._handleGetGeneralConfig();
        if (generalConfigRes) {
          this.appDataService.generalConfig = generalConfigRes;
        } else {
          this.errorHandlerService.handleError('close-session');
        }
      }

      this.userDataSubscription = this.firestoreSubscribe.subscribeStore(this.appDataService.getUserId())
        .subscribe({
          next: data => {
            this.userData = data;


            if (this.appDataService.generalConfig && this.userData) {
              this.communicationService.emitNewUserData(this.userData);

              if (!this._backupServerInitialized) {
                this._backupServerInitialized = true;
                this.backupService.initBackupService(this.appDataService.getUserId(), this.appDataService.generalConfig, this.userData);
                console.warn('Add subscribers process done... navigating');
                this.router.navigate(['add-session']);
                this.communicationService.closeSpinner();
              }

            }
          },
          error: err => this._handleSubscriptionErrors(err)
        });

    } catch (err) {
      console.error('Error adding subscribers', err);
      this.errorHandlerService.handleError('close-session');
    }
  }

  private _handleSubscriptionErrors(err: string) {
    if (err = 'missing-data') {
      this._handleIsNewUser();
    }
  }

  private _createEmptyUserDataObject(): TUserData {
    return {
      name: this.appDataService.userName,
      surname: '',
      sessions: [],
      patients: [],
      clinics: [],
      admConfig: {
        isActive: false
      }
    }
  }

  /**
   * Create new user information when user is new and firestore subscription throws "missing-data"
   * @private
   */
  private _handleIsNewUser() {
    console.warn('User is new, saving empty data.');
    this.firestoreQueries.saveData(this.appDataService.uid, this._createEmptyUserDataObject())
      .then(() => {
        this._addSubscribers();
      })
      .catch(() => {
        this.errorHandlerService.handleError('close-session');
      })
  }

  /**
   * If user id exists on appDataService we automatically add subscribers to app
   * If user id does not exist on appDataService we add login subscriber
   */
  ngOnInit() {
    console.log(this.appDataService.getUserId(), this.appDataService.generalConfig, this.appDataService.getUserName(), this.userData);
    this.communicationService.openSpinner();

    if (this.appDataService.getUserId()) {
      console.warn('User is already logged, adding subscribers');
      this._addSubscribers();
    } else {
      if (!(this.router.url === '')) {
        this.router.navigate(['']);
      }
      this.loginSubscription = this.communicationService.subscribeLoginSubject$
        .subscribe(() => {
          console.warn('Login success', this.appDataService.getUserId(), this.appDataService.getUserName());
          this._addSubscribers();
        })
    }
  }

  ngOnDestroy() {
    console.log('destruyo');
    this.userDataSubscription?.unsubscribe();
    this.loginSubscription?.unsubscribe();
    console.log(this.loginSubscription);
  }
}

