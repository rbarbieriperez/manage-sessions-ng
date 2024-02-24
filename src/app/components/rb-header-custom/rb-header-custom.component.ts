import {Component, Input, Output} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { EventEmitter} from "@angular/core";

@Component({
  selector: 'rb-header-custom',
  standalone: true,
  templateUrl: './rb-header-custom.component.html',
  styleUrl: './rb-header-custom.component.scss',
  imports: [MatIconModule]
})

export class RbHeaderCustomComponent {

  /**
   * Header main title
   * @public
   */
  @Input() headerTitle: string = '';

  /**
   * Flag to indicate if menu icon should be shown
   * @public
   */
  @Input() showMenuIcon: boolean = true;

  /**
   * Emitter to send event when menu icon was clicked
   * @public
   */
  @Output() menuIconClicked = new EventEmitter();


  /**
   * Handle menu icon click and emit event
   * @protected
   */
  protected _onMenuIconClicked() {
    this.menuIconClicked.emit();
  }
}
