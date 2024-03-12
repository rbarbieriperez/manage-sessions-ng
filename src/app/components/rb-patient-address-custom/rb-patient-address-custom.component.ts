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
import {TAddress} from "../../types/types";
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";


const initialAddressData: TAddress = {
  fullAddress: '',
  number: '',
  additionalInfo: ''
}

@Component({
  standalone: true,
  selector: 'rb-patient-address-custom',
  templateUrl: './rb-patient-address-custom.component.html',
  imports: [
    MatAccordion,
    MatExpansionModule,
    RbInputCustomComponent
  ],
  viewProviders: [MatExpansionPanel],
  styleUrl: './rb-patient-address-custom.component.scss'
})

export class RbPatientAddressCustomComponent implements OnChanges {


  @Input() addressData: TAddress | undefined;
  @Input() title: string = '';
  @Output() onAddressChange = new EventEmitter<TAddress>();

  @ViewChild('fullAddress') fullAddress: RbInputCustomComponent | undefined;
  @ViewChild('number') number: RbInputCustomComponent | undefined;
  @ViewChild('additionalInfo') additionalInfo: RbInputCustomComponent | undefined;

  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel> | undefined;

  protected _newAddressData: TAddress = initialAddressData;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['addressData'] && this.addressData) {
      this._newAddressData = this.addressData;
    }
  }


  /**
   * Handle data change and emit new data
   * @param value
   * @param property
   * @protected
   */
  protected _onDataChange(value: string, property: keyof TAddress) {
    this._newAddressData = {
      ...this._newAddressData,
      [property]: value
    };

    this.onAddressChange.emit(this._newAddressData);
  }

  /**
   * Clear all form fields
   */
  public clear() {
    this._newAddressData = initialAddressData;
    this.fullAddress?.clear();
    this.additionalInfo?.clear();
    this.number?.clear();

    this.panels?.forEach(panel => panel.close());
  }
}
