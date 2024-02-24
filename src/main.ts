import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {AddSessionComponent} from "./app/pages/add-session/add-session.component";

bootstrapApplication(AddSessionComponent, appConfig)
  .catch((err) => console.error(err));
