import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {TOption} from "../../types/types";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  standalone: true,
  selector: 'rb-autocomplete-custom',
  templateUrl: './rb-autocomplete-custom.component.html',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatLabel,
    NgForOf,
    MatOption,
    MatIcon,
    MatSuffix,
    MatIconButton,
    MatHint,
    NgIf,
    FormsModule
  ],
  styleUrl: './rb-autocomplete-custom.component.scss'
})

export class RbAutocompleteCustomComponent implements OnChanges {
  protected formControl = new FormControl('');
  protected _selectedViewValue: string = '';

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: TOption[] = [];
  @Input() inputDisabled: boolean = false;
  @Input() showHint: boolean = false;
  @Input() hintText: string = '';
  @Input() searchMode: boolean = true;
  @Input() forceValue: string = '';

  @Output() selectedValue = new EventEmitter<string>();
  @Output() textChange = new EventEmitter<string>();
  @Output() clearBtnClick = new EventEmitter<void>();

  @ViewChild(MatAutocompleteTrigger) selectComponent: MatAutocompleteTrigger | undefined;

  protected _searchOptions: TOption[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['options'] && this.options) {
      this._searchOptions = this.options;
    }

    if(changes['forceValue'] && this.forceValue) {
      this._selectedViewValue = this.forceValue;
    }
  }


  /**
   * Emit selected value
   * @param event
   * @protected
   */
  protected _onAutocompleteValueSelected(event: MatAutocompleteSelectedEvent) {
    const { value } = event.option;

    if (value) {
      this._selectedViewValue = this.options.find((option: TOption) => option.value === value)?.viewValue || '';
      this.selectedValue.emit(value);
    }
  }

  /**
   * Emit input text value
   * @param event
   * @protected
   */
  protected _onInputChangeValue(event: Event) {
    const { value } = event.target as HTMLInputElement;
    if (value) {
      this.textChange.emit(value);
    } else {
      this.textChange.emit('');
    }

    if (this.searchMode) {
      if (value) {
        this._searchOptions = this.options.filter((option: TOption) => option.viewValue.toLowerCase().includes(value.toLowerCase()));
      } else {
        this._searchOptions = this.options;
      }
    }
  }

  protected _onClearIconClick() {
    this.clearBtnClick.emit();
    this._selectedViewValue = '';
    this.textChange.emit('');
    this.selectedValue.emit('');
    this.formControl.setValue('');
    this.formControl.reset();
    this._searchOptions = this.options;
  }

  public clear() {
    this._onClearIconClick();
  }




}
