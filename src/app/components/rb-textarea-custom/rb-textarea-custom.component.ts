import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";


@Component({
  standalone: true,
  selector: 'rb-textarea-custom',
  styleUrl: './rb-textarea-custom.component.scss',
  templateUrl: './rb-textarea-custom.component.html',
  imports: [MatFormFieldModule, MatInputModule, NgIf, MatIcon]
})

export class RbTextareaCustomComponent {
  @Input() label:string = 'label';

  @Input() rows:number = 2;
  @Input() cols:number = 20;

  @Input() maxLength: number = 10;
  @Input() minLength: number = 0;

  @Input() showCharactersCounter: boolean = false;

  /**
   * Right positioned hint properties
   */
  @Input() showHint: boolean = false;
  @Input() hintLabel: string = '';
  @Input() hintIcon: string = '';
  @Output() onHintClick = new EventEmitter<void>();



  @Output() textChange = new EventEmitter<string>();

  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement> | undefined;
  protected _onChange(event: Event) {
    const { value } = event.target as HTMLInputElement;
    if (value) {
      this.textChange.emit(value);
    } else {
      this.textChange.emit('');
    }
  }

  protected _onHintClicked() {
    this.onHintClick.emit();
  }

  /**
   * Clear textarea value
   * @public
   */
  public clear() {
    if (this.textarea) {
      this.textarea.nativeElement.value = '';
    }
  }
}
