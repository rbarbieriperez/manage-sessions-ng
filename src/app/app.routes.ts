import { Routes } from '@angular/router';
import {AddSessionComponent} from "./pages/add-session/add-session.component";

export const routes: Routes = [
  { path: '', redirectTo: '/add-session', pathMatch: "full" },
  { path: 'add-session', component: AddSessionComponent }
];
