import {inject, Injectable, Output} from "@angular/core";
import {catchError, map, Observable, throwError} from "rxjs";
import {doc, docSnapshots, Firestore, getFirestore, onSnapshot} from "@angular/fire/firestore";
import {environment} from "../../environments/environment";
import {TUserData} from "../types/types";


@Injectable({
  providedIn: 'root'
})

export  class FirestoreSubscribeService {
  firestore = inject(Firestore)
  userData:TUserData | undefined;
  constructor() {
    this._printEnv();
  }

  private _printEnv() {
    if (environment.production) {
      console.warn('ENVIRONMENT: PRODUCTION');
    } else {
      console.warn('ENVIRONMENT: DEVELOPMENT');
    }
  }

  public subscribeStore(): Observable<TUserData | undefined> {
    //const userId = localStorage.getItem('uid');
    const userId = 'thelolomc@gmail.com';

    if (!userId) {
      return throwError(() => 'Missing user id');
    } else {
        return new Observable<TUserData>((observable) => {
          return onSnapshot(doc(this.firestore, 'manage-sessions', userId), (doc) => {
            if (doc.exists()) {
              this.userData = doc.data() as TUserData;
              return observable.next(doc.data() as TUserData)
            } else {
              return throwError(() => 'Missing data');
            }
          }, () => {
            return throwError(() => 'Error retrieving data')
          });


        });
    }
  }

}

