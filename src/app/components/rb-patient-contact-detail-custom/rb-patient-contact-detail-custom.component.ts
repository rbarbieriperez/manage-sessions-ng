import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {TFamily, TOption} from "../../types/types";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {RbSelectCustomComponent} from "../rb-select-custom/rb-select-custom.component";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";

const initialContactDetailData: TFamily = {
  relationType: '',
  contactDetail: '',
  surnames: '',
  contactType: '',
  names: ''
}

const relationTypeOptions: TOption[] = [
  {
    value: 'Madre',
    viewValue: 'Madre'
  },
  {
    value: 'Padre',
    viewValue: 'Padre'
  },
  {
    value: 'Tutor',
    viewValue: 'Tutor'
  },
  {
    value: 'Maestro/Profesor',
    viewValue: 'Maestro/Profesor'
  }
];

const contactTypeOptions: TOption[] = [
  {
    value: 'Celular',
    viewValue: 'Celular'
  },
  {
    value: 'Teléfono fijo',
    viewValue: 'Teléfono fijo'
  },
  {
    value: 'Correo',
    viewValue: 'Correo'
  },
  {
    value: 'Sitio web',
    viewValue: 'Sitio web'
  }

];

@Component({
  standalone: true,
  selector: 'rb-patient-contact-detail-custom',
  templateUrl: './rb-patient-contact-detail-custom.component.html',
  imports: [
    MatIcon,
    MatIconButton,
    RbSelectCustomComponent,
    RbInputCustomComponent
  ],
  styleUrl: './rb-patient-contact-detail-custom.component.scss'
})
export class RbPatientContactDetailCustomComponent implements OnChanges {

  @Input() contactDetailData: TFamily | undefined;
  @Input() elementIndex: number = 0;
  @Input() hidden: boolean = true;
  @Output() onContactDetailDataChange = new EventEmitter<{ index: number, data: TFamily}>();
  @Output() onContactDetailDelete = new EventEmitter<number>();

  protected _newContactDetailData: TFamily = initialContactDetailData;
  protected relationTypeOptionsArray: TOption[] = relationTypeOptions;
  protected contactTypeOptionsArray: TOption[] = contactTypeOptions;

  @ViewChild('relationType') relationType: RbSelectCustomComponent | undefined;
  @ViewChild('names') names: RbInputCustomComponent | undefined;
  @ViewChild('surnames') surnames: RbInputCustomComponent | undefined;
  @ViewChild('contactType') contactType: RbSelectCustomComponent | undefined;
  @ViewChild('contactDetail') contactDetail: RbInputCustomComponent | undefined;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactDetailData'] && this.contactDetailData) {
      this._newContactDetailData = this.contactDetailData;
    }
  }

  /**
   * Handle relation type select change and emit data
   * @param value
   * @protected
   */
  protected _onSelectedRelationChange(value: string) {
    this._newContactDetailData = {
      ...this._newContactDetailData,
      relationType: value
    };
    this.onContactDetailDataChange.emit({ index: this.elementIndex, data: this._newContactDetailData });
  }

  /**
   * Handle names input change and emit data
   * @param value
   * @protected
   */
  protected _onNameChanged(value: string) {
    this._newContactDetailData = {
      ...this._newContactDetailData,
      names: value
    };
    this.onContactDetailDataChange.emit({ index: this.elementIndex, data: this._newContactDetailData });
  }

  /**
   * Handle surnames input change and emit data
   * @param value
   * @protected
   */
  protected _onSurnameChanged(value: string) {
    this._newContactDetailData = {
      ...this._newContactDetailData,
      surnames: value
    };
    this.onContactDetailDataChange.emit({ index: this.elementIndex, data: this._newContactDetailData });
  }

  /**
   * Handle contact type select change and emit data
   * @param value
   * @protected
   */
  protected _onSelectedContactTypeChange(value: string) {
    this._newContactDetailData = {
      ...this._newContactDetailData,
      contactType: value
    };
    this.onContactDetailDataChange.emit({ index: this.elementIndex, data: this._newContactDetailData });
  }

  /**
   * Handle detail input change and emit data
   * @param value
   * @protected
   */
  protected _onDetailChanged(value: string) {
    this._newContactDetailData = {
      ...this._newContactDetailData,
      contactDetail: value
    };
    this.onContactDetailDataChange.emit({ index: this.elementIndex, data: this._newContactDetailData });
  }


  /**
   * Handle delete contact detail button click
   * @protected
   */
  protected _onDeleteContactDetail() {
    this.onContactDetailDelete.emit(this.elementIndex);
  }


  /**
   * Clear all form fields
   */
  public clear() {
    this._newContactDetailData = initialContactDetailData;
    this.names?.clear();
    this.surnames?.clear();
    this.relationType?.clear();
    this.contactType?.clear();
    this.contactDetail?.clear();
  }

}
