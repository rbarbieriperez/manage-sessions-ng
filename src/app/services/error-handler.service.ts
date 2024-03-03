import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AppDataService} from "./app-data.service";


@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {
  constructor(
    private router: Router,
    private appDataService: AppDataService
  ) {
  }

  public handleError(errorCode: string) {

    switch (errorCode) {
      case 'close-session': return this._closeSession();
      default:
        throw new Error('Handle error not configured - error-handler.service.ts');
    }

  }

  /**
   * Validate if all the needed data is present after error
   */
  public validateError() {
    if (!this.appDataService.getUserId()) {
      this.handleError('close-session');
    }
  }

  private _closeSession() {
    this.router.navigate(['']);
    window.location.reload();
  }
}
