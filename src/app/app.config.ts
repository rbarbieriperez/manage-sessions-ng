import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {provideNativeDateAdapter} from "@angular/material/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {CommunicationService} from "./services/communication.service";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideMomentDateAdapter(),
    provideNativeDateAdapter(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      provideStorage(() => getStorage()),
      provideFunctions(() => getFunctions()),
    ]),
  ],
};
