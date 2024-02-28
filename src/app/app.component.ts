import {Component, OnDestroy, OnInit} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import 'localstorage-polyfill';
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {FirestoreSubscribeService} from "./services/firestore-subscribe.service";
import {TUserData} from "./types/types";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularFirestoreModule],
  providers: [FirestoreSubscribeService],
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  userData: TUserData | undefined;
  subscription: Subscription;
  constructor(private firestoreSubscribe: FirestoreSubscribeService) {
    this.subscription = firestoreSubscribe.subscribeStore().subscribe(data => {
      this.userData = data;
      console.warn(this.userData);
    }, err => {
      console.error('There was an error', err);
      // IMPORTANT: Here should be an error handler in the future
    });
  }

  ngOnInit() {
    //this.subscription.unsubscribe();
  }

}
