import {Component, inject, OnDestroy, ViewChild, ViewEncapsulation} from "@angular/core";
import {CommunicationService} from "../../services/communication.service";
import {NgbAlert, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {TDialog} from "../../types/types";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

/**
 * Simple dialog modal to handle request
 */

// Properties
// Title
// content
// primaryButtonLabel
// secondaryButtonLabel
// primaryButtonEvent
// secondaryButtonEvent
// modalCloseEvent

@Component({
  standalone: true,
  selector: 'rb-dialog-modal-custom',
  templateUrl: './rb-dialog-modal-custom.component.html',
  styleUrl: './rb-dialog-modal-custom.component.scss',
  imports: [
    NgIf,
    MatButton
  ],
  encapsulation: ViewEncapsulation.None
})

export class RbDialogModalCustomComponent implements OnDestroy {
  private modalService = inject(NgbModal);
  @ViewChild('modal', { static: false }) modal: NgbModal | undefined = undefined;
  private subscription: Subscription;
  protected modalData: TDialog | undefined = undefined;
  constructor(private communicationService: CommunicationService) {
    this.subscription = this.communicationService.subscribeDialogData$
      .subscribe((data: TDialog) => {
        this.modalData = data;
        this.modalService.open(this.modal, { size: data.size, centered: true });
      });

  }

  protected _onPrimaryButtonClick() {
    if (this.modalData?.primaryButtonLabel && this.modalData.primaryButtonEvent) {
      this.modalService.dismissAll();
      this.communicationService.emitDialogCallbackEvent(this.modalData?.primaryButtonEvent);
    }
  }

  protected _onSecondaryButtonClick() {
    if (this.modalData?.secondaryButtonLabel && this.modalData.secondaryButtonEvent) {
      this.modalService.dismissAll();
      this.communicationService.emitDialogCallbackEvent(this.modalData?.secondaryButtonEvent);
    }
  }

  protected _onModalClose() {
    this.modalService.dismissAll();
    this.communicationService.emitDialogCallbackEvent('modal-close');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
