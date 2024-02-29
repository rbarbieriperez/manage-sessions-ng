import {Component, OnDestroy, ViewChild} from "@angular/core";
import {NgbAlert, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {NgIf} from "@angular/common";
import {TAlert} from "../../types/types";
import {CommunicationService} from "../../services/communication.service";
import {Subscription} from "rxjs";


@Component({
  standalone: true,
  selector: 'rb-alert-custom',
  templateUrl: './rb-alert-custom.component.html',
  styleUrl: './rb-alert-custom.component.scss',
  imports: [NgbAlertModule, NgIf]
})

export class RbAlertCustomComponent implements OnDestroy {
  protected alert: TAlert | undefined = undefined;
  private subscription: Subscription;

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined = undefined;

  constructor(private communicationService: CommunicationService) {

    this.subscription = this.communicationService.subscribeAlertData$
      .subscribe((data: TAlert) => {
        console.warn('Opening new alert -', data.type, '-' , data.message);
        this.alert = data;

        setTimeout(() => {
          this._clearAlert();
        }, data.clearTimeMs);
      });
  }

  /**
   * Method to clear alert
   * @private
   */
  private _clearAlert() {
    if (this.alert) {
      this.selfClosingAlert?.close();
      this.alert = undefined;
    }
  }

  /**
   * Method to handle alert close event and emit close event to be subscribed
   * @protected
   */
  protected _onAlertClose() {
    console.log(this.alert);
    if (this.alert) {
      this.communicationService.emitAlertCloseEvent(this.alert);
      this._clearAlert();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
