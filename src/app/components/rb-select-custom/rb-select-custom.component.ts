import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef, ViewChildren
} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelect, MatSelectChange, MatSelectModule} from "@angular/material/select";
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

export class RbSelectCustomComponent implements OnChanges {

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

  @Input() defaultValue: string = '';

    /**
   * Emits an event when selection has changed
   * @public
   */
  @Output() elementSelected = new EventEmitter<string>();


  @ViewChildren(MatSelect) select: MatSelect | undefined;

  protected _selectValue: string = '';


  ngOnChanges(changes: SimpleChanges) {
    if(changes['elements'] && this.select) {
      this.select.disabled = !this.elements.length;
    }

    if(changes['defaultValue'] && this.defaultValue) {
      this._selectValue = this.defaultValue;
    }

    if (changes['disabled'] && this.disabled && this.select) {
      this.select.disabled = this.disabled;
    }
  }

  /**
   * Emits event when element was selected with element's value
   * @param event
   * @protected
   */
  protected _onElementSelected(event: MatSelectChange) {
    const { value } = event;
    this.elementSelected.emit(value);
  }

  protected _onNativeSelectElementSelected(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.elementSelected.emit(value);
  }

  /**
   * Clear select value
   * @public
   */
  public clear() {
    this._selectValue = '';
  }

}
