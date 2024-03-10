import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormsModule} from "@angular/forms";
import dayjs from "dayjs";

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  standalone: true,
  templateUrl: './rb-datepicker-custom.component.html',
  styleUrl: './rb-datepicker-custom.component.scss',
  selector: 'rb-datepicker-custom',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}
  ],
  imports: [MatInputModule, MatFormFieldModule, MatDatepickerModule, FormsModule]
})

export class RbDatepickerCustomComponent implements OnChanges {

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() defaultValue: string = '';
  @Output() dateEmiiter = new EventEmitter<Date>();

  protected _pickerValue: string = '';

  protected _pickerValueDate: Date | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultValue'] && this.defaultValue) {
      this._pickerValueDate = new Date(this.defaultValue);
    }
  }

  protected _onDateSelected(event: MatDatepickerInputEvent<Date>) {
    const { value } = event;

    if (value) {
      this.dateEmiiter.emit(value);
    }
  }

  /**
   * Clear input value
   * @public
   */
  public clear() {
    this._pickerValueDate = undefined;
  }
}
