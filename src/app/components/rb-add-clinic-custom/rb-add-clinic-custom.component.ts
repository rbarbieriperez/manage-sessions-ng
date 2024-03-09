import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {TClinic} from "../../types/types";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

type TClinicNoId = Omit<TClinic, 'clinicId'>;

const initialClinicData: TClinicNoId = {
  clinicName: '',
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  contactDetails: {
    emailAddress: '',
    mobilePhoneNumber: '',
    phoneNumber: '',
    website: ''
  }
}


@Component({
  standalone: true,
  templateUrl: './rb-add-clinic-custom.component.html',
  styleUrl: './rb-add-clinic-custom.component.scss',
  imports: [
    RbInputCustomComponent,
    MatButton,
    NgIf
  ],
  selector: 'rb-add-clinic-custom'
})

export class RbAddClinicCustomComponent implements OnChanges {

  @Output() onClinicDataChange = new EventEmitter<TClinicNoId>();
  @Output() onSubmitClinic = new EventEmitter<void>();
  @Output() onUpdateClinic = new EventEmitter<void>();
  @Output() onDeleteClinic = new EventEmitter<void>();
  @Input() clinicData: TClinicNoId | undefined;

  @Input() submitButtonDisabled: boolean = false;
  @Input() updateDeleteForm: boolean = false;
  protected _clinicData: TClinicNoId = initialClinicData;

  @ViewChild('name') nameInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('address') addressInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('number') numberInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('additionalInfo') additionalInfoInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('email') emailInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('mobilePhone') mobilePhoneInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('phone') phoneInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('website') websiteInput: RbInputCustomComponent | undefined = undefined;


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinicData'] && this.clinicData) {
      this._clinicData = this.clinicData;
    }
  }

  protected _onClinicNameChanges(value: string) {
    this._clinicData = {
      ...this._clinicData,
      clinicName: value
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onFullAddressChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      address: {
        ...this._clinicData.address,
        fullAddress: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onNumberChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      address: {
        ...this._clinicData.address,
        number: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onAdditionalDetailsChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      address: {
        ...this._clinicData.address,
        additionalInfo: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onEmailAddressChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      contactDetails: {
        ...this._clinicData.contactDetails,
        emailAddress: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onMobilePhoneNumberChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      contactDetails: {
        ...this._clinicData.contactDetails,
        mobilePhoneNumber: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  protected _onPhoneNumberChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      contactDetails: {
        ...this._clinicData.contactDetails,
        phoneNumber: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }


  protected _onWebSiteChange(value: string) {
    this._clinicData = {
      ...this._clinicData,
      contactDetails: {
        ...this._clinicData.contactDetails,
        website: value
      }
    }

    this.onClinicDataChange.emit(this._clinicData);
  }

  public clearValues() {
    this._clinicData = initialClinicData;

    if (
      this.nameInput &&
      this.addressInput &&
      this.numberInput &&
      this.additionalInfoInput &&
      this.emailInput &&
      this.mobilePhoneInput &&
      this.phoneInput &&
      this.websiteInput
    ) {
      this.nameInput.clear();
      this.addressInput.clear();
      this.numberInput.clear();
      this.additionalInfoInput.clear();
      this.emailInput.clear();
      this.mobilePhoneInput.clear();
      this.phoneInput.clear();
      this.websiteInput.clear();
    }
  }

  protected _onSubmitClinicButtonClick() {
    this.onSubmitClinic.emit();
  }

  protected _onUpdateClinicButtonClick() {
    this.onUpdateClinic.emit();
  }

  protected _onDeleteButtonClick() {
    this.onDeleteClinic.emit();
  }
}
