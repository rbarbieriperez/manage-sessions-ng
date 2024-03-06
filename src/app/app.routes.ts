import { Routes } from '@angular/router';
import {AddSessionComponent} from "./pages/add-session/add-session.component";
import {LoginComponent} from "./pages/login/login.component";
import {ManageClinicsComponent} from "./pages/manage-clinics/manage-clinics.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: "full",  },
  { path: 'login', component: LoginComponent },
  { path: 'add-session', component: AddSessionComponent },
  { path: 'manage-clinics', component: ManageClinicsComponent }

];
