import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from "@angular/core";
import {TSession} from "../../types/types";
import {initialSessionData} from "../../utils/data";
import * as _ from 'lodash';
import {MatAccordion, MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {RbToggleValueCustomComponent} from "../rb-toggle-value-custom/rb-toggle-value-custom.component";
import {NgIf} from "@angular/common";

dayjs.locale('es');

/**
 *
 * Component to show accordion with session information
 * Opens a modal to update session information and emits updated data
 * Emits event to delete session
 *
 */

@Component({
  standalone: true,
  selector: 'rb-patient-session-custom',
  templateUrl: './rb-patient-session-custom.component.html',
  styleUrl: './rb-patient-session-custom.component.scss',
  imports: [
    MatAccordion,
    MatExpansionModule,
    MatIconButton,
    MatIcon,
    RbToggleValueCustomComponent,
    NgIf,
  ],
  viewProviders: [MatExpansionPanel]
})

export class RbPatientSessionCustomComponent implements OnChanges {

  /**
   * Current session data
   */
  @Input() sessionData: TSession = initialSessionData;

  /**
   * Emit event with new session information
   */
  @Output() onSessionDataChange = new EventEmitter<TSession>();

  /**
   * Emit event to delete a session with selected session id
   */
  @Output() onSessionDelete = new EventEmitter<number>();

  @ViewChild('panel') panel: MatExpansionPanel | undefined;

  /**
   * Store current session data to be modified
   * @protected
   */
  protected _newSessionData: TSession = initialSessionData;

  /**
   * Store selected session data to compare with the newer
   * @protected
   */
  protected _currentSessionData: TSession = initialSessionData;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sessionData'] && this.sessionData) {
      this._newSessionData = this.sessionData;
      this._currentSessionData = this.sessionData;
    }
  }

  /**
   * Expand panel
   * @public
   */
  public expand() {
    if (this.panel) {
      this.panel.open();
    }
  }

  /**
   * Collapse panel
   * @public
   */
  public collapse() {
    if(this.panel) {
      this.panel.close();
    }
  }

  /**
   * Compute date to text format
   * @param date {string}
   */
  protected _formatDateToNatural(date: string): string {
    const formatDate = dayjs(date, 'DD/MM/YYYY').format('dddd, D [de] MMMM [del] YYYY');
    return formatDate.charAt(0).toUpperCase() + formatDate.slice(1, formatDate.length);
  }

  /**
   * Format date to DD/MM/YYYY
   * @param date
   * @protected
   */
  protected _formatDate(date: string): string {
    return dayjs(date).format('DD/MM/YYYY').toString();
  }

  /**
   * Emit event with session id
   * @protected
   */
  protected _onDeleteSessionButtonClick() {
    this.onSessionDelete.emit(this._newSessionData.sessionId);
  }

  /**
   * Emit new session data
   * @protected
   */
  protected _onUpdateSessionButtonClick() {
    this.onSessionDataChange.emit(this._newSessionData);
  }
}
