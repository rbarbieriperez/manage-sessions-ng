import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class AppDataService {
  uid: string;
  userName: string;
  generalConfig: any;

  constructor() {
    this.uid = 'thelolomc@gmail.com';
    this.userName = 'Rodrigo Barbieri';
    this.generalConfig = {};
  }
}
