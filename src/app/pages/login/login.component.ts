import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {CommunicationService} from "../../services/communication.service";
import {FirestoreLoginService} from "../../services/firestore-login.service";
import {AppDataService} from "../../services/app-data.service";


@Component({
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    NgOptimizedImage,
  ],
  providers: [ FirestoreLoginService ],
  selector: 'rb-login-component'
})

export class LoginComponent {
  constructor(
    private communicationService: CommunicationService,
    private loginService: FirestoreLoginService,
    private appDataService: AppDataService
  ) {
  }

  protected async _loginWithGmailClick() {
    const res = await  this.loginService.gmailAuth();

    if (res && res.user) {
      const { displayName, email } = res.user;

      if (displayName && email) {
        this.appDataService.uid = email;
        this.appDataService.userName = displayName;
        this.communicationService.emitLoginSuccess();
      }
    }
  }
}
