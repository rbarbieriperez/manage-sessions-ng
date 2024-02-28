import {Component} from "@angular/core";
import {RbHeaderCustomComponent} from "../../components/rb-header-custom/rb-header-custom.component";
import {RbInputCustomComponent} from "../../components/rb-input-custom/rb-input-custom.component";
import {RbSelectCustomComponent} from "../../components/rb-select-custom/rb-select-custom.component";
import {RbDatepickerCustomComponent} from "../../components/rb-datepicker-custom/rb-datepicker-custom.component";
import {RbTextareaCustomComponent} from "../../components/rb-textarea-custom/rb-textarea-custom.component";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'add-session',
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.scss',
  standalone: true,
  imports: [
    RbHeaderCustomComponent,
    RbInputCustomComponent,
    RbSelectCustomComponent,
    RbDatepickerCustomComponent,
    RbTextareaCustomComponent,
    MatButton
  ]
})
export  class AddSessionComponent {

}
