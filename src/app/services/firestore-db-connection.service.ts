import {Injectable} from "@angular/core";
import firebase from 'firebase/app';
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})

export class FirestoreDbConnectionService {

  constructor() {
    this.printEnvironment();
  }
  private printEnvironment() {
    if (environment.production) {
      console.warn('ENVIRONMENT: PRODUCTION');
    } else {
      console.warn('ENVIRONMENT: DEVELOPMENT');
    }
  }

  public connectFirestore() {
   // return AngularFireModule.initializeApp(environment.firebaseConfig, 'manage-sessions');
  }
}
