import {Component, Input} from "@angular/core";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSuffix} from "@angular/material/form-field";


@Component({
  standalone: true,
  selector: 'rb-toggle-value-custom',
  templateUrl: './rb-toggle-value-custom.component.html',
  imports: [
    NgIf,
    MatIcon,
    MatIconButton,
    MatSuffix
  ],
  styleUrl: './rb-toggle-value-custom.component.scss'
})

export class RbToggleValueCustomComponent {


  @Input() value:string = '';

  protected _isMasked: boolean = true;

  protected _getChars(value: string): string {
    return '*'.repeat(value.length);
  }
}
