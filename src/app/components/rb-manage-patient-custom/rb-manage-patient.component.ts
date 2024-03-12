import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {TAddress, TClinic, TFamily, TOption, TPatient, TPatientSchooling} from "../../types/types";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";
import {RbSelectCustomComponent} from "../rb-select-custom/rb-select-custom.component";
import {RbDatepickerCustomComponent} from "../rb-datepicker-custom/rb-datepicker-custom.component";
import {RbTextareaCustomComponent} from "../rb-textarea-custom/rb-textarea-custom.component";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import dayjs from "dayjs";
import {RbPatientAddressCustomComponent} from "../rb-patient-address-custom/rb-patient-address-custom.component";
import {
  RbPatientFamilyContactDetailsCustomComponent
} from "../rb-patient-family-contact-details-custom/rb-patient-family-contact-details-custom.component";
import {RbPatientSchoolingCustomComponent} from "../rb-patient-schooling-custom/rb-patient-schooling-custom.component";


type TPatientNoId = Omit<TPatient, 'patientId'>;

const initialPatientData: TPatientNoId = {
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
      number: '',
      additionalInfo: ''
    }
  }

}

@Component({
  standalone: true,
  selector: 'rb-manage-patient',
  templateUrl: './rb-manage-patient.component.html',
  imports: [
    RbInputCustomComponent,
    RbSelectCustomComponent,
    RbDatepickerCustomComponent,
    RbTextareaCustomComponent,
    MatButton,
    NgIf,
    RbPatientAddressCustomComponent,
    RbPatientFamilyContactDetailsCustomComponent,
    RbPatientSchoolingCustomComponent
  ],
  styleUrl: './rb-manage-patient.component.scss'
})
export class RbManagePatientComponent implements OnChanges {

  @Input() patientData: TPatientNoId | undefined;
  @Input() clinics: TClinic[] | undefined;
  @Input() submitButtonDisabled: boolean = true;
  @Input() isUpdateDeleteForm: boolean = false;

  @Output() emitPatientData = new EventEmitter<TPatientNoId>();
  @Output() onSubmitBtnClick = new EventEmitter<void>();
  @Output() onUpdateBtnClick = new EventEmitter<void>();
  @Output() onDeleteBtnClick = new EventEmitter<void>();

  @ViewChild('clinic') clinic: RbInputCustomComponent | undefined;
  @ViewChild('names') names: RbInputCustomComponent | undefined;
  @ViewChild('surnames') surnames: RbInputCustomComponent | undefined;
  @ViewChild('bornDate') bornDate: RbDatepickerCustomComponent | undefined;
  @ViewChild('sessionAmount') sessionAmount: RbInputCustomComponent | undefined;
  @ViewChild('sessionTime') sessionTime: RbInputCustomComponent | undefined;
  @ViewChild('observations') observations: RbTextareaCustomComponent | undefined;
  @ViewChild('addressCustomComponent') address: RbPatientAddressCustomComponent | undefined;
  @ViewChild('familyCustomComponent') family: RbPatientFamilyContactDetailsCustomComponent | undefined;
  @ViewChild('patientSchoolingCustomComponent') schooling: RbPatientSchoolingCustomComponent | undefined;

  protected clinicsOptionsArray: TOption[] = [];
  protected _newPatientData: TPatientNoId = initialPatientData;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinics'] && this.clinics) {
      this.clinicsOptionsArray = this._generateClinicsOptionsArray();
    }

    if(changes['patientData'] && this.patientData) {
      console.log('patient data has changed', this.patientData);
      this._newPatientData = this.patientData;
    }
  }

  /**
   * Method to generate clinics option array to show in select
   * @private
   */
  private _generateClinicsOptionsArray(): TOption[] {
    const _options: TOption[] = [];

    this.clinics?.forEach((clinic: TClinic) => {
      _options.push({
        value: clinic.clinicId.toString(),
        viewValue: clinic.clinicName
      })
    });

    return _options.sort((a, b) => a.viewValue.localeCompare(b.viewValue));
  }

  /**
   * Handle clinic select change event and emit data
   * @param value
   * @protected
   */
 protected _onClinicSelected(value: string) {
  this._newPatientData = {
    ...this._newPatientData,
    clinicId: Number(value)
  };

  this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient name change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientNameChange(value: string) {
    this._newPatientData = {
      ...this._newPatientData,
      names: value
    };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient surname change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientSurnameChange(value: string) {
    this._newPatientData = {
      ...this._newPatientData,
      surnames: value
    };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient born date change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientBornDateChanged(value: Date) {
    const _date = dayjs(value);
    this._newPatientData = {
      ...this._newPatientData,
      bornDate: _date.format('YYYY-MM-DD')
    };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient session value change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientSessionValueChanged(value: string) {
    this._newPatientData = {
      ...this._newPatientData,
      sessionValue: Number(value)
    };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient session time change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientSessionTimeChanged(value: string) {
    this._newPatientData = {
      ...this._newPatientData,
      sessionTime: Number(value)
    };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient observations change event and emit data
   * @param value
   * @protected
   */
 protected _onPatientObsChanged(value: string) {
    this._newPatientData = {
      ...this._newPatientData,
      observations: value
    };
    this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient address information change event and emit data
   * @param address
   * @protected
   */
 protected _onPatientAddressInformationChanged(address: TAddress) {
   this._newPatientData = {
     ...this._newPatientData,
     address
   };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient family contact details information change event and emit data
   * @param family
   * @protected
   */
 protected _onPatientFamilyContactDetailsDataChanged(family: TFamily[]) {
   this._newPatientData = {
     ...this._newPatientData,
     family
   };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle patient schooling information change event and emit data
   * @param schooling
   * @protected
   */
 protected _onPatientSchoolingDataChanged(schooling: TPatientSchooling) {
   this._newPatientData = {
     ...this._newPatientData,
     schooling
   };
   this.emitPatientData.emit(this._newPatientData);
 }

  /**
   * Handle submit button click
   * @protected
   */
 protected _onSubmitButtonClick() {
    this.onSubmitBtnClick.emit();
 }

  /**
   * Handle update button click
   * @protected
   */
 protected _onUpdateButtonClick() {
    this.onUpdateBtnClick.emit();
 }

  /**
   * Handle delete button click
   * @protected
   */
 protected _onDeleteButtonClick() {
    this.onDeleteBtnClick.emit();
 }

  /**
   * Clear all form fields
   * @public
   */
 public clearFields() {
    this.clinic?.clear();
    this.names?.clear();
    this.surnames?.clear();
    this.bornDate?.clear();
    this.sessionAmount?.clear();
    this.sessionTime?.clear();
    this.observations?.clear();
    this.address?.clear();
    this.family?.clear();
    this.schooling?.clear();

 }

 protected _getClinicDefaultValue(clinicId: number) {
   return this.clinicsOptionsArray.find((option: TOption) => option.value === clinicId.toString())?.value || '';
 }

}
