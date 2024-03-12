import {Component, ViewChild} from "@angular/core";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {CommunicationService} from "../../services/communication.service";
import {Subscription} from "rxjs";
import {TClinic, TOption, TPatient, TSession, TUserData} from "../../types/types";
import {NgIf} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {RbAutocompleteCustomComponent} from "../../components/rb-autocomplete-custom/rb-autocomplete-custom.component";
import {RbManagePatientComponent} from "../../components/rb-manage-patient-custom/rb-manage-patient.component";
import {MatDivider} from "@angular/material/divider";
import * as _ from 'lodash';


const initialPatientData: TPatient = {
  patientId: 0,
  clinicId: 0,
  names: '',
  surnames: '',
  sessionValue: 0,
  observations: '',
  bornDate: '',
  sessionTime: 0,
  family: [],
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  schooling: {
    turn: '',
    schedule: {
      since: '',
      to: ''
    },
    institutionObs: '',
    institutionName: '',
    institutionContactDetails: {
      emailAddress: '',
      website: '',
      phoneNumber: '',
      mobilePhoneNumber: ''
    },
    address: {
      fullAddress: '',
      additionalInfo: '',
      number: ''
    }
  }

}

@Component({
  standalone: true,
  selector: 'manage-patients',
  templateUrl: './manage-patients.component.html',
  imports: [
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    RbAutocompleteCustomComponent,
    RbManagePatientComponent,
    MatDivider
  ],
  styleUrl: './manage-patients.component.scss'
})

export class ManagePatientsComponent {

  private subscription: Subscription;
  private selectedClinicId: number = 0;
  private currentPatientData: TPatient = initialPatientData;

  protected userData: TUserData | undefined;
  protected clinicsOptionArray: TOption[] = [];
  protected patientsOnClinicOptionArray: TOption[] = [];
  protected submitButtonDisabled: boolean = true;
  protected isUpdateDeleteForm: boolean = false;
  protected isManagePatientsFormView: boolean = true;
  protected _clinicsAutocompleteDisabled: boolean = true;
  protected _patientsAutocompleteDisabled: boolean = true;
  protected _forceClinicAutocompleteValue: string = '';
  protected _forcePatientsAutocompleteValue: string = '';
  protected _showClinicsAutocompleteHint: boolean = false;
  protected newPatientData: TPatient = initialPatientData;

  @ViewChild('clinicsAutocomplete') clinicsAutocomplete: RbAutocompleteCustomComponent | undefined;
  @ViewChild('patientsAutocomplete') patientsAutocomplete: RbAutocompleteCustomComponent | undefined;
  @ViewChild('managePatientComponent') managePatientComponent: RbManagePatientComponent | undefined;
  constructor(
    private appDataService: AppDataService,
    private errorHandlerService: ErrorHandlerService,
    private firestoreQueriesService: FirestoreQueriesService,
    private communicationService: CommunicationService
  ) {
    this.appDataService.currentPageName = 'Administrar pacientes';
    this.subscription = this.communicationService.subscribeUserData$
      .subscribe(data => {
        console.warn('User data has changed at manage-patients.component.ts', data);
        this.userData = data;
        this.clinicsOptionArray = this._getClinicsOptionArray();
        this._clinicsAutocompleteDisabled = !this.clinicsOptionArray.length;
      });
  }


  protected _setIsManagePatientsFormView() {
    this.isManagePatientsFormView = true;
  }

  protected _setIsManagePatientsSessionsView() {
    this.isManagePatientsFormView = false;
  }

  /**
   * Generate clinics option array to show in autocomplete element
   * @private
   */
  private _getClinicsOptionArray(): TOption[] {
    const _options: TOption[] = [];
    this.userData?.clinics.forEach((clinic: TClinic) => {
      _options.push({
        value: clinic.clinicId.toString(),
        viewValue: clinic.clinicName
      });
    });
    return _options;
  }

  /**
   * Generate patients option array to show in autocomplete element based on the selected clinic id
   * @private
   */
  private _getPatientsOnClinicOptionsArray(): TOption[] {
    const _options: TOption[] = [];
    this.userData?.patients.forEach((patient: TPatient) => {
      if (patient.clinicId === this.selectedClinicId) {
        _options.push({
          value: patient.patientId.toString(),
          viewValue: `${patient.names} ${patient.surnames}`
        });
      }
    });
    return _options;
  }

  /**
   * Handle clinic selected - search form
   * @param value
   * @protected
   */
  protected _onSelectedClinicAutocompleteChange(value: string) {
    if (value) {
      this.selectedClinicId = Number(value);
      this._clinicsAutocompleteDisabled = true;
      this._forceClinicAutocompleteValue = this.userData?.clinics.find((clinic: TClinic) => clinic.clinicId === Number(value))?.clinicName || '';
      this.patientsOnClinicOptionArray = this._getPatientsOnClinicOptionsArray();
      this._patientsAutocompleteDisabled = !this.patientsOnClinicOptionArray.length;
      this._showClinicsAutocompleteHint = !this.patientsOnClinicOptionArray.length;
    }
  }

  /**
   * Handle selected patient change - search form
   * Set is update or delete form
   * @param value
   * @protected
   */
  protected _onSelectedPatientAutocompleteChange(value: string) {
    if (value) {
      const foundPatient = this.userData?.patients.find((patient: TPatient) => patient.patientId === Number(value)) || initialPatientData;
      console.log('foundPatinet', foundPatient);
      this.currentPatientData = foundPatient;
      this.newPatientData = foundPatient;
      this._forcePatientsAutocompleteValue = `${this.currentPatientData.names} ${this.currentPatientData.surnames}`;
      this._patientsAutocompleteDisabled = true;
      this._validateIsUpdateDeleteForm();
    }
  }

  /**
   * Handle clinics autocomplete input clear
   * @protected
   */
  protected _onClearSelectedClinicAutocomplete() {
    this.patientsAutocomplete?.clear();
    this.managePatientComponent?.clearFields();
    this.selectedClinicId = 0;
    this.currentPatientData = initialPatientData;
    this.newPatientData = initialPatientData;
    this._clinicsAutocompleteDisabled = false;
    this._patientsAutocompleteDisabled = true;
    this._showClinicsAutocompleteHint = false;
    this._validateIsUpdateDeleteForm();
  }

  /**
   * Handle patients autocomplete input clear
   * @protected
   */
  protected _onClearSelectedPatientAutocomplete() {
    this.managePatientComponent?.clearFields();
    this.currentPatientData = initialPatientData;
    this.newPatientData = initialPatientData;
    this._patientsAutocompleteDisabled = false;
    console.log(this._patientsAutocompleteDisabled);
    this._validateIsUpdateDeleteForm();
  }

  /**
   * Validate if update/delete form should be shown based on the patientId and clinicId from the search form
   * @private
   */
  private _validateIsUpdateDeleteForm() {
    this.isUpdateDeleteForm = !!this.newPatientData.patientId && !!this.selectedClinicId;
  }


  /**
   * Handle patient data changed event
   * @param data
   * @protected
   */
  protected onPatientDataChanged(data: Omit<TPatient, 'patientId'>) {
    console.log('patientDataChanged', data);
    this.newPatientData = {
      patientId: 0,
      ...data,
    };
    this._validateSubmitButtonDisabled();
  }

  /**
   * Method to handle all the validations of the submit/update button disabled
   * @private
   */
  private _validateSubmitButtonDisabled() {
    const basicInfoDisabled = !this.newPatientData.names || !this.newPatientData.surnames || !this.newPatientData.bornDate || !this.newPatientData.sessionValue || !this.newPatientData.sessionTime;
    console.log('compare', this._validateIfPatientDataHasChanged());
    this.submitButtonDisabled = basicInfoDisabled || (this.isUpdateDeleteForm ? this._validateIfPatientDataHasChanged() : false);
  }

  /**
   * Compare old data with newer data
   * @private
   */
  private _validateIfPatientDataHasChanged() {
    return _.isEqual(this.currentPatientData, this.newPatientData);
  }

  /**
   * Submit new patient
   * @protected
   */
  protected onSubmitNewPatient() {
    const newUserData = this._updateUserDataObject();
    console.log(newUserData)
    this.communicationService.openSpinner();
    if (newUserData) {
      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), newUserData)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: 'Paciente registrado con éxito',
            clearTimeMs: 3000
          })
        })
        .catch(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'danger',
            message: 'Ha ocurrido un error al registrar el paciente',
            clearTimeMs: 3000
          });
          this.errorHandlerService.validateError();
        })
        .finally(() => this._clearFields())
    }
  }

  /**
   * Method to handle update patient button click
   * Opens confirm dialog
   * @protected
   */
  protected handleUpdatePatientBtnClick() {
    this.communicationService.emitDialogData({
      title: 'Confirmar modificación',
      content: 'Podrás volver a modificar los datos nuevamente.',
      size: 'sm',
      primaryButtonLabel: 'Confirmar',
      secondaryButtonLabel: 'Cancelar',
      primaryButtonEvent: 'confirm-update',
      secondaryButtonEvent: 'reject-update'
    });

    this.communicationService.subscribeDialogCallbackEvent$.subscribe(val => {
      if (val === 'confirm-update') {
        this._onConfirmUpdate();
      }
    });
  }

  /**
   * Handle patient update
   * @private
   */
  private _onConfirmUpdate() {
    this.communicationService.openSpinner();
    const updatedUserDataObject = this._updateUserDataObject();
    if (updatedUserDataObject) {
      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), updatedUserDataObject)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: 'Clínica modificada con éxito',
            clearTimeMs: 3000
          });
        })
        .catch(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'danger',
            message: 'Ha ocurrido un error al modificar la clínica',
            clearTimeMs: 3000
          });
          this.errorHandlerService.validateError();
        })
        .finally(() => this._clearFields());
    }
  }

  /**
   * Handle delete button click
   * Opens confirm dialog
   * @protected
   */
  protected handleDeletePatientBtnClick() {
    this.communicationService.emitDialogData({
      title: 'Confirmar eliminación',
      content: 'Al eliminar este paciente también estarás eliminando las sesiones que tuviera registradas.',
      size: 'sm',
      primaryButtonLabel: 'Confirmar',
      primaryButtonEvent: 'confirm-deletion',
      secondaryButtonLabel: 'Cancelar',
      secondaryButtonEvent: 'cancel'
    });

    this.communicationService.subscribeDialogCallbackEvent$.subscribe(ev => {
      if (ev === 'confirm-deletion') {
        this._handlePatientDeletion();
      }
    })
  }

  /**
   * Method to handle patient deletion
   * @private
   */
  private _handlePatientDeletion() {
    if (this.userData) {
      this.communicationService.openSpinner();
      this.userData = {
        ...this.userData,
        patients: this.userData.patients.filter((patient: TPatient) => patient.patientId !== this.newPatientData.patientId),
        sessions: this.userData.sessions.filter((session: TSession) => session.patientId !== this.newPatientData.patientId)
      };

      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), this.userData)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: 'Paciente eliminado con éxito',
            clearTimeMs: 3000
          });
        })
        .catch(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'danger',
            message: 'Ha ocurrido un error al eliminar el paciente',
            clearTimeMs: 3000
          });
          this.errorHandlerService.validateError();
        })
        .finally(() => this._clearFields());
    }
  }

  /**
   * Clear all the fields of the manage patient component
   * @private
   */
  private _clearFields() {
    this.managePatientComponent?.clearFields();
    this._onClearSelectedClinicAutocomplete();
    this._onClearSelectedPatientAutocomplete();
    this.clinicsAutocomplete?.clear();
  }

  /**
   * Method to update userData remote object with new patient data
   * @private
   */
  private _updateUserDataObject(): TUserData | undefined {
    if (this.userData) {

      if (this.isUpdateDeleteForm) {
        const patientIndex = this.userData.patients.findIndex((patient: TPatient) => patient.patientId === this.newPatientData.patientId);
        return {
          ...this.userData,
          patients: [
            ...this.userData.patients.slice(0, patientIndex),
            { ...this.userData.patients[patientIndex], ...this.newPatientData },
            ...this.userData.patients.slice(patientIndex + 1)
          ]
        }
      }

      if (!this.isUpdateDeleteForm) {
        return {
          ...this.userData,
          patients: [
            ...this.userData?.patients,
            {
              ...this.newPatientData,
              patientId: this._generateNewPatientId()
            }
          ]
        }
      }
    }
    return undefined;
  }

  /**
   * Generate new patient id based on the remote patient's array, if there are no patients registered
   * index will start at 1.
   * @private
   */
  private _generateNewPatientId(): number {
    if (!this.userData?.patients.length) {
      return  1;
    } else {
      return Math.max(...this.userData.patients.map(o => o.patientId)) + 1;
    }
  }
}
