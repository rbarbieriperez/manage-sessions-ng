import {Component, OnDestroy, ViewChild} from "@angular/core";
import {RbAutocompleteCustomComponent} from "../../components/rb-autocomplete-custom/rb-autocomplete-custom.component";
import {AppDataService} from "../../services/app-data.service";
import {TClinic, TOption, TUserData} from "../../types/types";
import {FirestoreSubscribeService} from "../../services/firestore-subscribe.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {RbAddClinicCustomComponent} from "../../components/rb-add-clinic-custom/rb-add-clinic-custom.component";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {CommunicationService} from "../../services/communication.service";
import {ErrorHandlerService} from "../../services/error-handler.service";

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
    RbAddClinicCustomComponent
  ],
  selector: 'manage-clinics'
})

export class ManageClinicsComponent implements OnDestroy {

  protected registeredClinicsOptions: TOption[] = [];

  protected _clinicInputDisabled: boolean = false;

  protected newClinicData: TClinic = initialClinicData;

  private subscription: Subscription;

  private userData: TUserData | undefined;

  protected _isUpdateDeleteForm: boolean = false;

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
    private errorHandlerService: ErrorHandlerService
  ) {
    this.subscription = this.firestoreSubscribeService.subscribeStore(this.appDataService.getUserId())
      .subscribe((data) => {
        if (data) {
          console.warn('User data has changed at manage-clinics', data);
          this.newClinicData = initialClinicData;
          this.userData = data;
          this.registeredClinicsOptions = this._computeRegisteredClinicsOptions();
          this._validateSubmitNewClinicButtonDisabled();
        }
      });

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
    this._validateSubmitNewClinicButtonDisabled();
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
    this._validateSubmitNewClinicButtonDisabled();
  }

  /**
   * Check if button should be disabled or not
   * @protected
   */
  protected _validateSubmitNewClinicButtonDisabled() {
    if (this.newClinicData.clinicName) {
      this.submitNewClinicBtnDisabled = false;
    } else {
      this.submitNewClinicBtnDisabled = true;
    }
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
        .finally(() => this._clearAddClinicElements());
    }
  }

  /**
   * Clear all add clinic elements
   * @private
   */
  private _clearAddClinicElements() {
    this.addClinicCustomComponent?.clearValues();
    this.autocompleteCustomComponent?.clear();
    this._validateSubmitNewClinicButtonDisabled();
  }

  /**
   * --- END OF ADD NEW CLINIC METHODS ----
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
