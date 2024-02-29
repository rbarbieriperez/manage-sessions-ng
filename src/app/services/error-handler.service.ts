import {Injectable} from "@angular/core";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {
  constructor(
    private router: Router
  ) {
  }

  public handleError(errorCode: string) {

    switch (errorCode) {
      case 'close-session': return this._closeSession();
      default:
        throw new Error('Handle error not configured - error-handler.service.ts');
    }

  }

  private _closeSession() {
    this.router.navigate(['']);
  }
}
