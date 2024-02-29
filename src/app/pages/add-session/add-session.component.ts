import {Component, OnDestroy} from "@angular/core";
import {RbHeaderCustomComponent} from "../../components/rb-header-custom/rb-header-custom.component";
import {RbInputCustomComponent} from "../../components/rb-input-custom/rb-input-custom.component";
import {RbSelectCustomComponent} from "../../components/rb-select-custom/rb-select-custom.component";
import {RbDatepickerCustomComponent} from "../../components/rb-datepicker-custom/rb-datepicker-custom.component";
import {RbTextareaCustomComponent} from "../../components/rb-textarea-custom/rb-textarea-custom.component";
import {MatButton} from "@angular/material/button";
import {FirestoreSubscribeService} from "../../services/firestore-subscribe.service";
import {TClinic, TOption, TPatient, TSession, TUserData} from "../../types/types";
import {AppDataService} from "../../services/app-data.service";
import {CommunicationService} from "../../services/communication.service";
import {Subscription} from "rxjs";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";

const initialSessionData: TSession = {
  sessionId: 0,
  clinicId: 0,
  patientId: 0,
  sessionDate: '',
  sessionObs: '',
  sessionValue: 0
}

@Component({
  selector: 'add-session',
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.scss',
  standalone: true,
  providers: [
    FirestoreSubscribeService
  ],
  imports: [
    RbHeaderCustomComponent,
    RbInputCustomComponent,
    RbSelectCustomComponent,
    RbDatepickerCustomComponent,
    RbTextareaCustomComponent,
    MatButton
  ]
})
export  class AddSessionComponent implements OnDestroy {
  private userDataSubscription: Subscription;

  private userData: TUserData | undefined;
  private newSessionData: TSession = initialSessionData;

  protected clinicsOptionsArr: TOption[] = [];
  protected patientsOptionsArr: TOption[] = [];
  constructor(
    private appData: AppDataService,
    private communicationService: CommunicationService,
    private firestoreQueries: FirestoreQueriesService
  ) {
    this.userDataSubscription = this.communicationService.subscribeUserData$
      .subscribe((data: TUserData) => {
        console.warn('User data has changed at add-session.component.ts');
        this.userData = data;

        if (this.userData?.clinics && this.userData.patients) {
          this.clinicsOptionsArr = this._generateClinicsOptionsArray(this.userData?.clinics);
          this.patientsOptionsArr = this._generatePatientsOptionsArray(this.userData?.patients);
        }
      });
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

  /**
   * Handles clinic selection change
   * @param clinicId {String}
   * @protected
   */
  protected _onSelectedClinicChange(clinicId: string) {
    this.newSessionData = {
      ...this.newSessionData,
      clinicId: Number(clinicId)
    }
  }

  /**
   * Handle patient selection change
   * @param patientId
   * @protected
   */
  protected _onSelectedPatientChange(patientId: string) {
    this.newSessionData = {
      ...this.newSessionData,
      patientId: Number(patientId),
      sessionValue: this.userData?.patients.find((patient: TPatient) => patient.patientId === Number(patientId))?.sessionValue || 0
    }
  }

  /**
   * Handle date selection change
   * @param date
   * @protected
   */
  protected _onSelectedDateChanged(date: Date) {
    const _date = new Date(date);
    this.newSessionData = {
      ...this.newSessionData,
      sessionDate: `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`
    }
  }

  /**
   * Handle session obs change
   * @param obs
   * @protected
   */
  protected _onSessionObsChanged(obs: string) {
    this.newSessionData = {
      ...this.newSessionData,
      sessionObs: obs
    }
  }

  /**
   * Method to generate clinics array to show in the select component
   * @param clinics
   * @private
   */
  private _generateClinicsOptionsArray(clinics: TClinic[]):TOption[] {
    const _parsedOptions: TOption[] = [];

    clinics.forEach((clinic: TClinic) => {
      _parsedOptions.push({
        value: clinic.clinicId.toString(),
        viewValue: clinic.clinicName
      });
    });

    return _parsedOptions;
  }

  /**
   * Method to generate patients array to show in the select component
   * @param patients
   * @private
   */
  private _generatePatientsOptionsArray(patients: TPatient[]):TOption[] {
    const _parsedOptions: TOption[] = [];

    patients.forEach((patient: TPatient) => {
      _parsedOptions.push({
        value: patient.patientId.toString(),
        viewValue: `${patient.names} ${patient.surnames}`
      });
    });

    return _parsedOptions;
  }

  /**
   * Method to check if submit button should be disabled
   * @protected
   */
  protected _checkButtonDisabled(): Boolean {
    if (
      this.newSessionData.sessionDate === '' ||
      this.newSessionData.clinicId === 0 ||
      this.newSessionData.patientId === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  private _createUserDataObject(): TUserData | undefined {
    if (this.userData) {
      return {
        ...this.userData,
        sessions: [
          ...this.userData?.sessions || [],
          {
            ...this.newSessionData,
            sessionId: this._getNewSessionId()
          }
        ]
      }
    }

    return undefined;
  }
  protected _onSubmitButtonClick(): void {
    const _newUserData = this._createUserDataObject();
    console.warn('User data to be submitted:', _newUserData);
    if (_newUserData) {
      this.firestoreQueries.saveData(this.appData.uid, _newUserData)
        .then(() => {
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: 'Sesión agregada con éxito!',
            clearTimeMs: 3000
          })
        })
        .catch(() => {
          this.communicationService.emitAlertData({
            id: '',
            type: 'error',
            message: 'Error al agregar la sesión',
            clearTimeMs: 3000
          })
        })
        .finally(() => this._reset());
    }
  }

  private _reset() {

  }
  private _getNewSessionId(): number {
    if (this.userData?.sessions.length) {
      return Math.max(...this.userData.sessions.map(o => o.sessionId)) + 1;
    } else {
      return 1;
    }
  }


}
