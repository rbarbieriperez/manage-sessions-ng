import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {CommunicationService} from "../../services/communication.service";
import {FirestoreLoginService} from "../../services/firestore-login.service";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";


@Component({
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    NgOptimizedImage,
  ],
  providers: [ ],
  selector: 'rb-login-component'
})

export class LoginComponent {
  constructor(
    private communicationService: CommunicationService,
    private loginService: FirestoreLoginService,
    private appDataService: AppDataService,
    private errorHandlerService: ErrorHandlerService
  ) {
  }

  protected async _loginWithGmailClick() {
    this.communicationService.openSpinner();
    const res = await this.loginService.gmailAuth();
    console.log(res);
    if (res && res.user) {
      const { displayName, email } = res.user;

      if (displayName && email) {
        this.appDataService.setUserId(email);
        this.appDataService.setUserName(displayName);
        this.communicationService.emitLoginSuccess();
        return;
      }
    }

    this.errorHandlerService.handleError('close-session');
  }
}
