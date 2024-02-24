import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import {AddSessionComponent} from "./app/pages/add-session/add-session.component";

const bootstrap = () => bootstrapApplication(AddSessionComponent, config);

export default bootstrap;
