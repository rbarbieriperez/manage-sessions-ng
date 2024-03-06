import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {MatFormField, MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'rb-input-custom',
  templateUrl: './rb-input-custom.component.html',
  styleUrl: './rb-input-custom.component.scss',
  imports: [MatInputModule, MatFormField, MatIconModule]
})

export class RbInputCustomComponent implements  OnChanges {

  @Input() label: string = 'test';
  @Input() required: boolean = false;
  @Input() minLength: number = 0;
  @Input() maxLength: number = 10;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() initialValue: string = '';

  @Output() onChange = new EventEmitter<string>();

  @ViewChild('input') inputElement: ElementRef | undefined;

  /**
   * Current input value stored
   * @protected
   */
  protected _currentInputValue:string = '';


  ngOnChanges(changes: SimpleChanges) {
    console.log('input change', changes);
    if (changes['initialValue'] && this.initialValue) {
      this._currentInputValue = this.initialValue;
    }
  }

  /**
   * Emits an event when input value changes and store it on component
   * @param e
   * @protected
   */
  protected _onTextChange(e: Event) {
    const { value } = e.target as HTMLInputElement;
    if (value) {
      this._currentInputValue = value;
      this.onChange.emit(value);
    } else {
      this._currentInputValue = '';
      this.onChange.emit('');
    }
  }

  protected _onClearInput() {
    this._currentInputValue = '';
    this.onChange.emit('');
  }

  /**
   * Clear input value
   * @public
   */
  public clear() {
    if (this.inputElement) {
      this._currentInputValue = '';
      this.onChange.emit('');
      this.inputElement.nativeElement.value = '';
    }
  }
}
