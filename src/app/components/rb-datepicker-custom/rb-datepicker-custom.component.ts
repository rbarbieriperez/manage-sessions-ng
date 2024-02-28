import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";

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
  imports: [MatInputModule, MatFormFieldModule, MatDatepickerModule]
})

export class RbDatepickerCustomComponent {

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() dateEmiiter = new EventEmitter<Date>();

  protected _onDateSelected(event: MatDatepickerInputEvent<Date>) {
    const { value } = event;

    if (value) {
      this.dateEmiiter.emit(value)
    }

  }
}
