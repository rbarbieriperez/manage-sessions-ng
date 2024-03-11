import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {CommunicationService} from "../../services/communication.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";


@Component({
  standalone: true,
  selector: 'rb-spinner-custom',
  templateUrl: './rb-spinner-custom.component.html',
  imports: [
    MatProgressSpinner,
    NgIf
  ],
  styleUrl: './rb-spinner-custom.component.scss'
})

export class RbSpinnerCustomComponent implements OnDestroy, OnInit {

  private subscription: Subscription;
  protected _spinnerState: boolean = false;

  protected spinnerPos: number = 0;

  constructor(private communicationService: CommunicationService) {
    this.subscription = this.communicationService.subscribeOpenSpinner$
      .subscribe(event => {
        if (event === 'open') {
          this._openSpinner();
        } else {
          this._closeSpinner();
        }
      })
  }

  ngOnInit() {
    window.addEventListener('scroll', e => {
      this.spinnerPos = window.scrollY;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private _openSpinner() {
    console.warn('Open spinner');
    this._spinnerState = true;
  }

  private _closeSpinner() {
    console.warn('Close spinner');
    this._spinnerState = false;
  }

}
