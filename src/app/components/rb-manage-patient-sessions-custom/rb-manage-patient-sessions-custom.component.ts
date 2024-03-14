import {Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren} from "@angular/core";
import {TClinic, TOption, TPatient, TSession} from "../../types/types";
import * as _ from 'lodash';
import {initialClinicData, initialPatientData, monthsArray} from "../../utils/data";
import {RbSelectCustomComponent} from "../rb-select-custom/rb-select-custom.component";
import {NgForOf, NgIf} from "@angular/common";
import {RbPatientSessionCustomComponent} from "../rb-patient-session-custom/rb-patient-session-custom.component";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  standalone: true,
  selector: 'rb-manage-patient-sessions-custom',
  templateUrl: './rb-manage-patient-sessions-custom.component.html',
  imports: [
    RbSelectCustomComponent,
    NgIf,
    RbPatientSessionCustomComponent,
    NgForOf,
    MatSlideToggle
  ],
  styleUrl: './rb-manage-patient-sessions-custom.component.scss'
})



export class RbManagePatientSessionsCustomComponent implements OnChanges, OnInit {
  /**
   * Store all selected patient data
   * @public
   */
  @Input() patientData: TPatient = _.cloneDeep(initialPatientData);

  /**
   * Store all the patient sessions
   * @public
   */
  @Input() patientSessions: TSession[] = [];

  /**
   * Store selected patient's related clinic data
   * @public
   */
  @Input() patientClinic: TClinic = _.cloneDeep(initialClinicData);

  protected _yearsOptionArray: TOption[] = [];
  protected _monthsOptionArray: TOption[] = [];
  protected _patientNameLabel: string = '';
  protected _filteredSessions: TSession[] = [];
  protected _monthSelectDisabled: boolean = true;

  private _selectedYear: string = '';
  private _selectedMonth: string = '';

  @ViewChildren(RbPatientSessionCustomComponent) patientSessionsEls: QueryList<RbPatientSessionCustomComponent> | undefined;


  ngOnChanges(changes: SimpleChanges) {
    if ((changes['patientData'] || changes['patientClinic']) && this.patientData.patientId && this.patientClinic.clinicId) {
      this._patientNameLabel = `Paciente: ${this.patientData.names} ${this.patientData.surnames} de ${this.patientClinic.clinicName}`;
    }

    if(changes['patientSessions'] && this.patientSessions) {
      this._yearsOptionArray = this._generateYearsOptionArray();
      this._monthsOptionArray = this._generateMonthsOptionArray();
      this._filteredSessions = this.patientSessions;
      console.log(this.patientSessions);
    }

    if(changes['patientClinic'] && this.patientClinic) {

    }
  }

  ngOnInit() {
    this._monthSelectDisabled = true;
    console.log('entramos a on init', this._monthSelectDisabled);
  }


  /**
   * Generate years option array based on patient's registered session with no repeated values
   * @private
   */
  private _generateYearsOptionArray(): TOption[] {
    const filteredYears = Array.from(new Set(this.patientSessions.map((session: TSession) => session.sessionDate.split('-')[0])));
    const options: TOption[] = [{ value: '', viewValue: '-- NO FILTRAR --'}];

    filteredYears.forEach((item: string) => {
      options.push({
        value: item,
        viewValue: item
      });
    });

    return options;
  }

  /**
   * Generate months option array based on patient's registered session with no repeated values
   * @private
   */
  private _generateMonthsOptionArray(): TOption[] {
    const filteredMonths = Array.from(
      new Set(
        this.patientSessions.reduce((acc: string[], curr: TSession) => {
          if (curr.sessionDate.includes(`${this._selectedYear}-`)) {
            acc.push(monthsArray[Number(curr.sessionDate.split('-')[1]) -1]);
          }
          return acc;
        }, [])));

    const options: TOption[] = [{ value: '', viewValue: '-- NO FILTRAR --' }];

    filteredMonths.forEach((value: string) => {
      options.push({
        value: (monthsArray.findIndex(val => val === value) + 1).toString(),
        viewValue: value
      });
    });

    return options;
  }

  /**
   * Handle year change value
   * @param value
   * @protected
   */
  protected _onYearChange(value: string) {
    this._selectedYear = value;
    this._monthsOptionArray = this._generateMonthsOptionArray();
    this._filterSessions();
  }

  /**
   * Handle month change value
   * @param value
   * @protected
   */
  protected _onMonthChange(value: string) {
    this._selectedMonth = value;
    this._filterSessions();
  }

  /**
   * Filter sessions based on the selected year or month
   * If year and month are truthy filter by year and month
   * If year is truthy but month not filter by year
   * Disable month select otherwise
   * @param year
   * @param month
   * @private
   */
  private _filterSessions() {
    console.log(this._selectedYear, this._selectedMonth);
    this._monthSelectDisabled = false;
    if (this._selectedYear && this._selectedMonth) {
      this._filteredSessions =
        this.patientSessions.filter((session: TSession) => session.sessionDate.includes(`${this._selectedYear}-${this._selectedMonth}`));
      return;
    }

    if (this._selectedYear && !this._selectedMonth) {
      this._filteredSessions =
        this.patientSessions.filter((session: TSession) => session.sessionDate.includes(`${this._selectedYear}-`));
      return;
    }

    if (!this._selectedYear && this._selectedMonth) {
      this._selectedMonth = '';
      this._filteredSessions = this.patientSessions;
    }

    if(!this._selectedYear && !this._selectedMonth) {
      this._filteredSessions = this.patientSessions;
    }

    this._monthSelectDisabled = true;
  }

  /**
   * Should expand all the sessions or collapse them
   * @param event
   * @protected
   */
  protected _expandOrCollapsePanels(event: MatSlideToggleChange) {
    if (event.checked) {
      this.patientSessionsEls?.forEach(el => el.expand());
    } else {
      this.patientSessionsEls?.forEach(el => el.collapse());
    }
  }

  /**
   * Get session element track by
   * @param sessionId
   * @protected
   */
  protected _getSessionTrackBy(sessionId: number) {
    return `session-${sessionId}`;
  }
}
