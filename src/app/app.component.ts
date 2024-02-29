import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
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

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AngularFirestoreModule,
    RbAlertCustomComponent,
    RbDialogModalCustomComponent
  ],
  providers: [
    FirestoreSubscribeService,
    FirestoreBackupService,
    AppDataService,
    FirestoreQueriesService,
  ],
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  userData: TUserData | undefined;
  userDataSubscription: Subscription | undefined;
  loginSubscription: Subscription | undefined;
  constructor(
    private firestoreSubscribe: FirestoreSubscribeService,
    private backupService: FirestoreBackupService,
    private appDataService: AppDataService,
    private firestoreQueries: FirestoreQueriesService,
    private communicationService: CommunicationService,
    private router: Router
  ) {
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
      const generalConfigRes = await this._handleGetGeneralConfig();

      if (generalConfigRes) {
        this.appDataService.generalConfig = generalConfigRes;
      } else {
        return;
      }

      this.userDataSubscription = this.firestoreSubscribe.subscribeStore(this.appDataService.uid)
        .subscribe(data => {
          this.userData = data;


          if (this.appDataService.generalConfig && this.userData) {
            this.backupService.initBackupService(this.appDataService.uid, this.appDataService.generalConfig, this.userData);
            this.communicationService.emitNewUserData(this.userData);
            console.warn('Add subscribers process done... navigating');
            this.router.navigate(['add-session']);
          }
        });

    } catch (err) {
      console.error('Error adding subscribers', err);
    }
  }

  /**
   * If user id exists on appDataService we automatically add subscribers to app
   * If user id does not exist on appDataService we add login subscriber
   */
  ngOnInit() {
    console.log(this.appDataService.uid, this.appDataService.generalConfig, this.appDataService.userName, this.userData);

    if (this.appDataService.uid) {
      console.warn('User is already logged, adding subscribers');
      this._addSubscribers();
    } else {
      this.loginSubscription = this.communicationService.subscribeLoginSubject$
        .subscribe(() => {
          console.warn('Login success', this.appDataService.uid, this.appDataService.userName);
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

