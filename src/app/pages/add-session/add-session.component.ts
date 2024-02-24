import {Component} from "@angular/core";
import {RbHeaderCustomComponent} from "../../components/rb-header-custom/rb-header-custom.component";
import {RbInputCustomComponent} from "../../components/rb-input-custom/rb-input-custom.component";


@Component({
  selector: 'add-session',
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.scss',
  standalone: true,
  imports: [RbHeaderCustomComponent, RbInputCustomComponent]
})
export  class AddSessionComponent {

}
