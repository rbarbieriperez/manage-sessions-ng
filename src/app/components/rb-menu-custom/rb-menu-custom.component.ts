import {Component, inject, Input, ViewChild} from "@angular/core";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {CommunicationService} from "../../services/communication.service";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";

interface IMenuCustom {
  title: string;
  options: Array<{
    icon?: string,
    text?: string,
    redirectTo?: string
  }>
}

@Component({
  standalone: true,
  templateUrl: './rb-menu-custom.component.html',
  styleUrl: './rb-menu-custom.component.scss',
  imports: [
    NgForOf,
    MatIcon
  ],
  selector: 'rb-menu-custom'
})

export class RbMenuCustomComponent {
  protected configuration: IMenuCustom | undefined;

  private offCanvasService = inject(NgbOffcanvas);
  @ViewChild('templateRef') menuRef = undefined;

  constructor(private router: Router, private  communicationService: CommunicationService) {

    this.communicationService.subscribeOpenMenu$.subscribe((data) => {
      if (data.action === 'open' && this.menuRef && data.configuration) {
        this.configuration = data.configuration;
        this.offCanvasService.open(this.menuRef, { ariaLabelledBy: 'offcanvas-basic-title' });
      } else {
        this.offCanvasService.dismiss();
      }
    })
  }

  /**
   * Handle redirection when option is selected
   * @param redirectTo
   * @protected
   */
  protected async _onMenuOptionSelected(redirectTo: string | undefined) {
    if (redirectTo) {
      this.offCanvasService.dismiss();
      await this.router.navigate([ redirectTo ]);
    }
  }
}
