import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {TAddress, TOption, TPatientSchooling} from "../../types/types";
import {MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";
import {RbSelectCustomComponent} from "../rb-select-custom/rb-select-custom.component";
import {RbPatientAddressCustomComponent} from "../rb-patient-address-custom/rb-patient-address-custom.component";
import {RbTextareaCustomComponent} from "../rb-textarea-custom/rb-textarea-custom.component";
import * as _ from 'lodash';
import {NgxMaterialTimepickerModule, NgxMaterialTimepickerThemeDirective} from "ngx-material-timepicker";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {RbTimepickerCustomComponent} from "../rb-timepicker-custom/rb-timepicker-custom.component";

const turnSelectOptionsArray: TOption[] = [
  {
    value: 'Matituno',
    viewValue: 'Matutino'
  },
  {
    value: 'Vespertino',
    viewValue: 'Vespertino'
  },
  {
    value: 'Nocturno',
    viewValue: 'Nocturno'
  },
  {
    value: 'Turno completo',
    viewValue: 'Turno completo'
  }
]

const initialSchoolingData: TPatientSchooling = {
  turn: '',
  schedule: {
    since: '',
    to: ''
  },
  institutionName: '',
  institutionContactDetails: {
    emailAddress: '',
    website: '',
    phoneNumber: '',
    mobilePhoneNumber: ''
  },
  institutionObs: '',
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  }
}

@Component({
  standalone: true,
  selector: 'rb-patient-schooling-custom',
  templateUrl: './rb-patient-schooling-custom.component.html',
  imports: [
    MatAccordion,
    MatExpansionModule,
    RbInputCustomComponent,
    RbSelectCustomComponent,
    RbPatientAddressCustomComponent,
    RbTextareaCustomComponent,
    RbTimepickerCustomComponent
  ],
  viewProviders: [MatExpansionPanel],
  styleUrl: './rb-patient-schooling-custom.component.scss'
})

export class RbPatientSchoolingCustomComponent implements OnChanges {


  @Input() schoolingData: TPatientSchooling = initialSchoolingData;
  @Output() emitSchoolingData = new EventEmitter<TPatientSchooling>();

  protected _newSchoolingData: TPatientSchooling = initialSchoolingData;
  protected _turnOptionsArray: TOption[] = turnSelectOptionsArray;


  @ViewChild('institutionName') institutionName: RbInputCustomComponent | undefined;
  @ViewChild('turn') turn: RbSelectCustomComponent | undefined;
  @ViewChild('scheduleSince') scheduleSince: RbTimepickerCustomComponent | undefined;
  @ViewChild('scheduleTo') scheduleTo: RbTimepickerCustomComponent | undefined;
  @ViewChild('address') address: RbPatientAddressCustomComponent | undefined;
  @ViewChild('email') email: RbInputCustomComponent | undefined;
  @ViewChild('mobilePhone') mobilePhone: RbInputCustomComponent | undefined;
  @ViewChild('phone') phone: RbInputCustomComponent | undefined;
  @ViewChild('website') website: RbInputCustomComponent | undefined;
  @ViewChild('obs') obs: RbTextareaCustomComponent | undefined;
  @ViewChildren(MatExpansionPanel) accordion: QueryList<MatExpansionPanel> | undefined;




  ngOnChanges(changes: SimpleChanges) {
    if (changes['schoolingData'] && this.schoolingData) {
      console.log('on change', this.schoolingData);
      this._newSchoolingData = this.schoolingData;
    }
  }

  /**
   * Update patient schooling data object
   * @param value
   * @param property
   * @protected
   */
  protected _onValueChange(value: string | TAddress | Event, propertyPath: string) {
    _.set(this._newSchoolingData, propertyPath, value);
    console.log(this._newSchoolingData);
    this.emitSchoolingData.emit(this._newSchoolingData);
  }

  /**
   * Clear all fields
   */
  public clear() {
    this._newSchoolingData = initialSchoolingData;
    this.institutionName?.clear();
    this.turn?.clear();
    this.scheduleSince?.clear();
    this.scheduleTo?.clear();
    this.address?.clear();
    this.email?.clear();
    this.mobilePhone?.clear();
    this.phone?.clear();
    this.website?.clear();
    this.obs?.clear();
    this.accordion?.forEach(a => a.close());
  }
}
