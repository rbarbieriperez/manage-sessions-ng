import {inject, Injectable} from "@angular/core";
import firebase from "firebase/compat/app";
import {Auth, signInWithPopup} from "@angular/fire/auth";



@Injectable({
  providedIn: 'root'
})

export class FirestoreLoginService {
  afAuth = inject(Auth);


  public async gmailAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    if (this.afAuth) {
      const credential = await signInWithPopup(this.afAuth, provider);
      return credential;
    } else {
      return false;
    }
  }

  public microsoftAuth() {

  }

}
