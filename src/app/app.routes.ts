import { Routes } from '@angular/router';
import {AddSessionComponent} from "./pages/add-session/add-session.component";
import {LoginComponent} from "./pages/login/login.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: "full",  },
  { path: 'login', component: LoginComponent },
  { path: 'add-session', component: AddSessionComponent },

];
