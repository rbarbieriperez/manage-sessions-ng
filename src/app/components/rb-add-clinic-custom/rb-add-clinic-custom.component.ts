import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {TClinic} from "../../types/types";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import * as _ from 'lodash';

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
  protected _clinicData: TClinicNoId = { ... initialClinicData};

  @ViewChild('name') nameInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('address') addressInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('number') numberInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('additionalInfo') additionalInfoInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('email') emailInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('mobilePhone') mobilePhoneInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('phone') phoneInput: RbInputCustomComponent | undefined = undefined;
  @ViewChild('website') websiteInput: RbInputCustomComponent | undefined = undefined;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['clinicData'] && this.clinicData) {
      this._clinicData = this.clinicData;
    }
  }

  /**
   * Handle all values update
   * @param value
   * @param propertyPath
   * @protected
   */
  protected _handleClinicValueChange(value: string, propertyPath: string) {
    _.set(this._clinicData, propertyPath, value);
    this.onClinicDataChange.emit(this._clinicData);
  }

  public clearValues() {
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
