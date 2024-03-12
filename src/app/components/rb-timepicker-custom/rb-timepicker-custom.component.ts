import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatLabel} from "@angular/material/input";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";


@Component({
  standalone: true,
  selector: 'rb-timepicker-custom',
  styleUrl: './rb-timepicker-custom.component.scss',
  imports: [
    MatFormField,
    MatLabel,
    NgxMaterialTimepickerModule,
    MatInput
  ],
  templateUrl: './rb-timepicker-custom.component.html'
})

export class RbTimepickerCustomComponent implements OnChanges {


  @Input() value: string = '';
  @Input() format: number = 0;
  @Input() min: string = '';
  @Input() max: string = '';
  @Input() label: string = '';

  @Output() dateSelected = new EventEmitter<string>();

  protected _value: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.value) {
      this._value = this.value;
    }
  }

  /**
   * Emit selected time
   * @param value
   * @protected
   */
  protected _handleTimeSet(value: string) {
    this.dateSelected.emit(value);
  }

  /**
   * Clear value
   */
  public clear() {
    this._value = '';
  }



}
