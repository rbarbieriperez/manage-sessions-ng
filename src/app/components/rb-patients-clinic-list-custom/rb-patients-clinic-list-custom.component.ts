import {Component, Input} from "@angular/core";
import {TPatient} from "../../types/types";
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";
import {RbToggleValueCustomComponent} from "../rb-toggle-value-custom/rb-toggle-value-custom.component";
import dayjs from "dayjs";


@Component({
  standalone: true,
  selector: 'rb-patients-clinic-list-custom',
  templateUrl: './rb-patients-clinic-list-custom.component.html',
  imports: [
    MatAccordion,
    NgForOf,
    NgIf,
    MatExpansionModule,
    RbToggleValueCustomComponent,
  ],
  viewProviders: [MatExpansionPanel],
  styleUrl: './rb-patients-clinic-list-custom.component.scss'
})

export class RbPatientsClinicListCustomComponent {

  @Input() patients: TPatient[] = [];


  protected readonly dayjs = dayjs;
}
