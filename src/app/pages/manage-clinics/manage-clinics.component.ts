import {ChangeDetectorRef, Component, OnDestroy, ViewChild} from "@angular/core";
import {RbAutocompleteCustomComponent} from "../../components/rb-autocomplete-custom/rb-autocomplete-custom.component";
import {AppDataService} from "../../services/app-data.service";
import {TClinic, TOption, TPatient, TSession, TUserData} from "../../types/types";
import {FirestoreSubscribeService} from "../../services/firestore-subscribe.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {RbAddClinicCustomComponent} from "../../components/rb-add-clinic-custom/rb-add-clinic-custom.component";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {CommunicationService} from "../../services/communication.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {RbSelectCustomComponent} from "../../components/rb-select-custom/rb-select-custom.component";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {
  RbPatientsClinicListCustomComponent
} from "../../components/rb-patients-clinic-list-custom/rb-patients-clinic-list-custom.component";

type TClinicNoId = Omit<TClinic, 'clinicId' | 'clinicName'>;
const initialClinicData: TClinic = {
  clinicName: '',
  clinicId: 0,
  contactDetails: {
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

@Component({
  standalone: true,
  templateUrl: './manage-clinics.component.html',
  styleUrl: './manage-clinics.component.scss',
  imports: [
    RbAutocompleteCustomComponent,
    NgIf,
    RbAddClinicCustomComponent,
    RbSelectCustomComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    MatDivider,
    RbPatientsClinicListCustomComponent
  ],
  selector: 'manage-clinics'
})

export class ManageClinicsComponent implements OnDestroy {

  /**
   * TOption array with all the registered clinics
   * @protected
   */
  protected registeredClinicsOptions: TOption[] = [];

  /**
   * Disables autocomplete input
   * @protected
   */
  protected _clinicInputDisabled: boolean = false;

  /**
   * New clinic data or update clinic data
   * @protected
   */
  protected newClinicData: TClinic = initialClinicData;

  /**
   * Store user data subscription
   * @private
   */
  private subscription: Subscription;

  /**
   * Full user data
   * @private
   */
  private userData: TUserData | undefined;

  /**
   * Flag to indicate if is update/delete form or add
   * @protected
   */
  protected _isUpdateDeleteForm: boolean = false;

  /**
   * Stores clinic data after search to compare with updated data
   * @private
   */
  private _lastClinicData: TClinic | undefined;

  /**
   * Flag to indicate if is add/update/delete form or patient's list form
   * @protected
   */
  protected _isUpdateDeleteView: boolean = true;

  protected _forceAutocompleteValue: string = '';

  @ViewChild('autocompleteCustomComponent') autocompleteCustomComponent: RbAutocompleteCustomComponent | undefined;

  /**
   * ----- ADD NEW CLINIC PROPERTIES -----
   */

  protected submitNewClinicBtnDisabled: boolean = true;
  @ViewChild('addClinicCustomComponent') addClinicCustomComponent: RbAddClinicCustomComponent | undefined;
  /**
   * ---- END OF ADD NEW CLINIC PROPERTIES -----
   */

  constructor(
    private appDataService: AppDataService,
    private firestoreSubscribeService: FirestoreSubscribeService,
    private firestoreQueriesService: FirestoreQueriesService,
    private communicationService: CommunicationService,
    private errorHandlerService: ErrorHandlerService,
    private cdRef:ChangeDetectorRef
  ) {
    this.subscription = this.firestoreSubscribeService.subscribeStore(this.appDataService.getUserId())
      .subscribe((data) => {
        if (data) {
          console.warn('User data has changed at manage-clinics', data);
          this.newClinicData = initialClinicData;
          this.userData = data;
          this.registeredClinicsOptions = this._computeRegisteredClinicsOptions();
          this._validateSubmitClinicButtonDisabled();
        }
      });

  }

  /**
   * Show the add/update/delete view with initial state
   * @protected
   */
  protected _toggleAddUpdateDeleteView() {
    this._isUpdateDeleteView = true;

    if (this.newClinicData.clinicName) {
      this._forceAutocompleteValue = this.newClinicData.clinicName;
    }

    /*this._isUpdateDeleteForm = false;
    this._clinicInputDisabled = false;
    this.cdRef.detectChanges();
    this._clearClinicElements();*/
  }

  /**
   * Show patients registered on clinic view
   * @protected
   */
  protected _togglePatientListView() {
    this._isUpdateDeleteView = false;
  }

  /**
   * Generate registered clinics options array
   * @protected
   */
  protected _computeRegisteredClinicsOptions(): TOption[] {
    const _options: TOption[] = [];

    this.userData?.clinics.forEach((clinic: TClinic) => {
      _options.push({
        value: clinic.clinicId.toString(),
        viewValue: clinic.clinicName
      });
    });

    return  _options;
  }

  /**
   * Returns all the patient associated to a clinic
   * @protected
   */
  protected _getPatientsOnClinic(): TPatient[] {
    if (this.newClinicData.clinicId) {
      return this.userData?.patients.filter((patient: TPatient) => patient.clinicId === this.newClinicData.clinicId)
        .sort((a, b) => a.names.localeCompare(b.names))|| [];
    }

    return  [];
  }

  /**
   * Handle clinic selected to enable update/delete clinic form
   * @param clinicId
   * @protected
   */
  protected _onClinicSelected(clinicId: string) {
    const clinic = this.userData?.clinics.find((clinic: TClinic) => clinic.clinicId === Number(clinicId));
    if (clinic) {
      this._clinicInputDisabled = true;
      this._isUpdateDeleteForm = true;
      this.newClinicData = clinic;
      this._lastClinicData = clinic;
    }
  }

  /**
   * Handle input clear selection to enable add clinic form
   * @protected
   */
  protected _onInputClearSelection() {
    this._clinicInputDisabled = false;
    this._isUpdateDeleteForm = false;
    this.addClinicCustomComponent?.clearValues();
  }

  /**
   * Update clinic name
   * @param value
   * @protected
   */
  protected _onClinicNameChange(value: string) {
    this.newClinicData = {
      ...this.newClinicData,
      clinicName: value
    };
    this._validateSubmitClinicButtonDisabled();
  }

  /**
   * --- ADD NEW CLINIC METHODS ----
   */

  /**
   * Update clinic data object
   * @param clinicData
   * @protected
   */
  protected _onNewClinicDataChange(clinicData: TClinicNoId) {
    this.newClinicData = {
      ...this.newClinicData,
      ...clinicData
    };
    this._validateSubmitClinicButtonDisabled();
  }

  /**
   * Check if button should be disabled or not
   * @protected
   */
  protected _validateSubmitClinicButtonDisabled() {
    this.submitNewClinicBtnDisabled = !this.newClinicData.clinicName || (this._isUpdateDeleteForm ? this._validateIfDataHasNotChanged() : false);
  }



  /**
   * Method to handle submit clinic
   * @protected
   */
  protected _onSubmitNewClinic() {
    const updateUserData: TUserData | undefined = this._updateUserDataObject();
    console.log(updateUserData);
    if (updateUserData) {
      this.communicationService.openSpinner();
      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), updateUserData)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: '¡Clínica agregada con éxito!',
            clearTimeMs: 3000
          });
        })
        .catch(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'danger',
            message: 'Ha ocurrido un error al agregar la clínica',
            clearTimeMs: 3000
          });
          this.errorHandlerService.validateError();
        })
        .finally(() => this._clearClinicElements());
    }
  }

  /**
   * Clear all add clinic elements
   * @private
   */
  private _clearClinicElements() {
    this.addClinicCustomComponent?.clearValues();
    this.autocompleteCustomComponent?.clear();
    this._validateSubmitClinicButtonDisabled();
  }

  /**
   * --- END OF ADD NEW CLINIC METHODS ----
   */

  /**
   * --- UPDATE CLINIC METHODS -----
   */

  /**
   * Open dialog with information and add subscriber to confirm operation
   * @protected
   */
  protected _onUpdateClinic() {
    this.communicationService.emitDialogData({
      title: 'Confirmar operación',
      content: 'Modificar clínica',
      size: 'sm',
      primaryButtonLabel: 'Confirmar',
      secondaryButtonLabel: 'Cancelar',
      primaryButtonEvent: 'confirm-operation',
      secondaryButtonEvent: 'reject-operation'
    });

    this.communicationService.subscribeDialogCallbackEvent$.subscribe(value => {
      if (value === 'confirm-operation') {
        this._confirmUpdateClinic();
      }
    });
  }

  /**
   * Save data to store with updated clinic
   * @private
   */
  private _confirmUpdateClinic() {
    this.communicationService.openSpinner();
    const updateUserData = this._updateUserDataObject();

    if (updateUserData) {
      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), updateUserData)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: '¡Clínica modificada con éxito!',
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
        })
        .finally(() => this._clearClinicElements());
    }
  }

  /**
   * Compare old data with new data to determinate if submit button should be disabled
   * @private
   */
  private _validateIfDataHasNotChanged() {
    return JSON.stringify(this._lastClinicData) === JSON.stringify(this.newClinicData);
  }

  /**
   * --- END OF UPDATE CLINIC METHODS -----
   */

  /**
   * ----- DELETE CLINIC METHOD -----
   */

  /**
   * Opens dialog and add subscriber to handle confirm operation
   * @protected
   */
  protected _onDeleteClinic() {
    this.communicationService.emitDialogData({
      title: 'Confirmar eliminación',
      content: 'Si eliminas la clínica también se eliminaran los pacientes registrados con sus respectivas sesiones.',
      size: 'sm',
      primaryButtonLabel: 'Confirmar',
      secondaryButtonLabel: 'Cancelar',
      primaryButtonEvent: 'confirm-deletion',
      secondaryButtonEvent: 'reject-deletion'
    });

    this.communicationService.subscribeDialogCallbackEvent$.subscribe(value => {
      if (value === 'confirm-deletion') {
        this._confirmDeleteClinic();
      }
    });
  }

  /**
   * Update user data and update store with user data without the delete clinic, patients and sessions
   * @private
   */
  private _confirmDeleteClinic() {
    if (this.userData) {
      this.communicationService.openSpinner();
      this.userData = {
        ...this.userData,
        patients: this.userData?.patients.filter((patient: TPatient) => patient.clinicId !== this.newClinicData.clinicId) || [],
        clinics: this.userData?.clinics.filter((clinic: TClinic) => clinic.clinicId !== this.newClinicData.clinicId) || [],
        sessions: this.userData?.sessions.filter((session: TSession) => session.clinicId !== this.newClinicData.clinicId) || []
      };

      this.firestoreQueriesService.saveData(this.appDataService.getUserId(), this.userData)
        .then(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'success',
            message: '¡Clínica eliminada con éxito!',
            clearTimeMs: 3000
          });
        })
        .catch(() => {
          this.communicationService.closeSpinner();
          this.communicationService.emitAlertData({
            id: '',
            type: 'danger',
            message: 'Ha ocurrido un error al eliminar la clínica',
            clearTimeMs: 3000
          });
        })
        .finally(() => this._clearClinicElements());
    }
  }

  /**
   * ----- END OF DELETE CLINIC METHOD -----
   */

  /**
   * Generate new clinic id based on registered clinics
   * @private
   */
  private _generateNewClinicId(): number {
    if (this.userData?.clinics.length) {
      return Math.max(...this.userData.clinics.map(o => o.clinicId)) + 1;
    } else {
      return 1;
    }
  }

  /**
   * Method to update user data object with new clinic
   * @private
   */
  private _updateUserDataObject(): TUserData | undefined {
    if (this.userData) {
      if (this._isUpdateDeleteForm) {
        this.userData = {
          ...this.userData,
          clinics: [
            ...this.userData.clinics.filter((clinic: TClinic) => clinic.clinicId !== this.newClinicData.clinicId)
          ]
        }
      }

      return {
        ...this.userData,
        clinics: [
          ...this.userData.clinics || [],
          {
            ...this.newClinicData,
            clinicId: this._generateNewClinicId()
          }

        ]
      }
    }
    return undefined;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
