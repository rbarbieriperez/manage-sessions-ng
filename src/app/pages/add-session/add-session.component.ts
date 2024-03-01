import {Component, inject, OnDestroy, ViewChild} from "@angular/core";
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
import {NgForOf, NgIf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";

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
    MatButton,
    NgForOf,
    NgIf,
  ]
})
export  class AddSessionComponent implements OnDestroy {
  protected modalService = inject(NgbModal);
  private userDataSubscription: Subscription;

  private userData: TUserData | undefined;
  private newSessionData: TSession = initialSessionData;

  protected clinicsOptionsArr: TOption[] = [];
  protected patientsOptionsArr: TOption[] = [];

  protected buttonDisabled: boolean = true;

  protected patientsWithSessionsRegisteredToday: string[] = [];


  @ViewChild('datepickerCustomComponent') datepickerElement: RbDatepickerCustomComponent | undefined;
  @ViewChild('textareaCustomComponent') textareaElement: RbTextareaCustomComponent | undefined;
  @ViewChild('selectClinicsCustomComponent') selectClinicsElement: RbSelectCustomComponent | undefined;
  @ViewChild('selectPatientsCustomComponent') selectPatientsElement: RbSelectCustomComponent | undefined;
  @ViewChild('registeredPatientsModal', { static: true }) registeredPatientsModalElement: NgbModal | undefined = undefined;


  constructor(
    private appData: AppDataService,
    private communicationService: CommunicationService,
    private firestoreQueries: FirestoreQueriesService
  ) {
    this.userDataSubscription = this.communicationService.subscribeUserData$
      .subscribe((data: TUserData) => {
        console.warn('User data has changed at add-session.component.ts', data);
        this.userData = data;
        if (this.userData?.clinics && this.userData.patients) {
          this.clinicsOptionsArr = this._generateClinicsOptionsArray(this.userData?.clinics);
          this.patientsOptionsArr = this._generatePatientsOptionsArray(this.userData?.patients);
          this.newSessionData = initialSessionData;
          this._checkButtonDisabled();
          this.patientsWithSessionsRegisteredToday = this._getPatientsWithSessionsRegisteredToday();
        }
      });
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

  private _getPatientsWithSessionsRegisteredToday(): string[] {
    const today = dayjs();
    const todayString = today.format('YYYY-M-D');

    const patientsIdWithSessions = new Set(this.userData?.sessions.reduce((acc: number[], curr: TSession) => {
      if (curr.sessionDate === todayString) {
        acc.push(curr.patientId);
      }
      return acc;
    }, []));

    return Array.from(patientsIdWithSessions).map((id: number) => {
      const patient = this.userData?.patients.find((patient: TPatient) => patient.patientId === id);
      const clinic = this.userData?.clinics.find((clinic: TClinic) => clinic.clinicId === patient?.clinicId);

      return `${patient?.names} de ${clinic?.clinicName}`;
    });


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
    this._checkButtonDisabled();
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
    this._checkButtonDisabled();
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
    this._checkButtonDisabled();
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
    this._checkButtonDisabled();
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
  protected _checkButtonDisabled(): void {
    if (
      this.newSessionData.sessionDate === '' ||
      this.newSessionData.clinicId === 0 ||
      this.newSessionData.patientId === 0
    ) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }
  }

  /**
   * Updates user data object with new session
   * @private
   */
  private _updateUserDataObject(): TUserData | undefined {
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

  /**
   * Handles submit button click by update user data with new session
   * and push to the store
   * @protected
   */
  protected _onSubmitButtonClick(): void {
    const _newUserData = this._updateUserDataObject();
    console.warn('User data to be submitted:', _newUserData);
    if (_newUserData) {
      this.firestoreQueries.saveData(this.appData.getUserId(), _newUserData)
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
            type: 'danger',
            message: 'Error al agregar la sesión',
            clearTimeMs: 3000
          })
        })
        .finally(() => this._clearElements());
    }
  }

  /**
   * Clear all form elements
   * @private
   */
  private _clearElements() {
    if (this.datepickerElement && this.selectClinicsElement && this.selectPatientsElement && this.textareaElement) {
      this.datepickerElement.clear();
      this.selectPatientsElement.clear();
      this.selectClinicsElement.clear();
      this.textareaElement.clear();
    }
  }

  /**
   * Method to generate new session id
   * @private
   */
  private _getNewSessionId(): number {
    if (this.userData?.sessions.length) {
      return Math.max(...this.userData.sessions.map(o => o.sessionId)) + 1;
    } else {
      return 1;
    }
  }

  protected _handleOpenPatientsWithSessionsRegisteredTodayModal() {
    if (this.registeredPatientsModalElement && this.modalService) {
      this.modalService.open(this.registeredPatientsModalElement, { size: 'lg', centered: true });
    }
  }

}
