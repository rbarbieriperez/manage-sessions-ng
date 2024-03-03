import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TOption} from "../../types/types";


@Component({
  standalone: true,
  selector: 'rb-select-custom',
  templateUrl: './rb-select-custom.component.html',
  styleUrl: './rb-select-custom.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, NgIf, NgForOf]
})

export class RbSelectCustomComponent implements OnInit, OnChanges {

  /**
   * Array of elements
   * @public
   */
  @Input() elements:TOption[] = [];

  /**
   * Flag to use native select
   * @public
   */
  @Input() isNativeSelect:boolean = false;

  /**
   * Select label
   * @public
   */
  @Input() label: string = '';

  @Input() disabled: boolean = false;

  @Input() id: string = '';

  /**
   * Emits an event when selection has changed
   * @public
   */
  @Output() elementSelected = new EventEmitter<string>();


  protected _selectValue: string = '';

  ngOnInit() {

    if (!this.elements.length) {
      this.disabled = true;
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['elements']?.currentValue?.length) {
      this.disabled = false;
    }
  }

  /**
   * Emits event when element was selected with element's value
   * @param event
   * @protected
   */
  protected _onElementSelected(event: MatSelectChange) {
    const { value } = event;

    if (value) {
      this.elementSelected.emit(value);
    } else {
      throw new Error('Selected element value could not be retrieved');
    }
  }

  protected _onNativeSelectElementSelected(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    if (value) {
      this.elementSelected.emit(value);
    } else {
      throw new Error('Selected element value could not be retrieved');
    }
  }

  /**
   * Clear select value
   * @public
   */
  public clear() {
    this._selectValue = '';
  }

}
