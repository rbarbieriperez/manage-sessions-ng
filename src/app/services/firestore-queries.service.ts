import {inject, Injectable} from "@angular/core";
import {doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {TGeneralConfig, TUserData} from "../types/types";


@Injectable({
  providedIn: 'root'
})

export class FirestoreQueriesService {
  firestore = inject(Firestore);
  constructor() {
  }


  /**
   * Method to get app config from firestore
   * @public
   */
  public async getAppConfig() {
    const res = await getDoc(doc(this.firestore, 'manage-sessions', 'general_config'));

    if (!res.exists()) {
      return false;
  }

    return res.data() as TGeneralConfig;
  }

  /**
   * Method to save user data into firestore
   * @public
   */
  public async saveData(uid: string, userData: TUserData) {
    return await setDoc(doc(this.firestore, 'manage-sessions', uid), userData)
      .then(() => true)
      .catch(() => false);
  }
}
