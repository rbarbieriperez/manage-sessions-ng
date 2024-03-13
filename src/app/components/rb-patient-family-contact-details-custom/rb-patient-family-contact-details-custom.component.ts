import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output, QueryList,
  SimpleChanges,
  ViewChild, ViewChildren
} from "@angular/core";
import {TFamily} from "../../types/types";
import {MatAccordion, MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {RbInputCustomComponent} from "../rb-input-custom/rb-input-custom.component";
import {
  RbPatientContactDetailCustomComponent
} from "../rb-patient-contact-detail-custom/rb-patient-contact-detail-custom.component";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {CommunicationService} from "../../services/communication.service";


@Component({
  standalone: true,
  selector: 'rb-patient-family-contact-details-custom',
  templateUrl: './rb-patient-family-contact-details-custom.component.html',
  styleUrl: './rb-patient-family-contact-details-custom.component.scss',
  imports: [
    MatAccordion,
    MatExpansionModule,
    RbInputCustomComponent,
    RbPatientContactDetailCustomComponent,
    MatIcon,
    MatMiniFabButton,
    NgForOf,
  ],
  viewProviders: [MatExpansionPanel],
})

export class RbPatientFamilyContactDetailsCustomComponent implements OnChanges {

  @Input() familyContactDetailsData: TFamily[] | undefined;
  @Output() onFamilyContactDetailsChange = new EventEmitter<TFamily[]>();


  @ViewChild('indexButtons') indexButtons: ElementRef[] | undefined;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel> | undefined;
  @ViewChildren(RbPatientContactDetailCustomComponent) contactDetailsEls: QueryList<RbPatientContactDetailCustomComponent> | undefined;
  protected _newFamilyContactDetailsData: TFamily[] = [];
  protected _contactDetailSelectedIndex: number = -1;

  private _initForm: boolean = false;

  constructor(
    private communicationService: CommunicationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['familyContactDetailsData'] && this.familyContactDetailsData) {
      this._newFamilyContactDetailsData = this.familyContactDetailsData;

      if (!this._initForm) {
        this._contactDetailSelectedIndex = this._newFamilyContactDetailsData.length && 0;
        this._initForm = true;
      }

    }
  }

  protected _onFamilyContactDetailsChange({ index, data }: { index: number, data: TFamily }) {
    this._newFamilyContactDetailsData = [
      ...this._newFamilyContactDetailsData.slice(0, index),
      { ...this._newFamilyContactDetailsData[index], ...data },
      ...this._newFamilyContactDetailsData.slice(index + 1)
    ];
    this.onFamilyContactDetailsChange.emit(this._newFamilyContactDetailsData);
  }

  /**
   * Add new empty contact details element to array
   * @protected
   */
  protected _addNewFamilyContactDetails() {
    this._newFamilyContactDetailsData = [
      ...this._newFamilyContactDetailsData,
      {
        names: '',
        surnames: '',
        relationType: '',
        contactDetail: '',
        contactType: ''
      }
    ];

    if (this._newFamilyContactDetailsData.length) {
      this._contactDetailSelectedIndex = this._newFamilyContactDetailsData.length -1;
    }
  }

  /**
   * Delete contact detail element
   * @param index
   * @protected
   */
  protected _onContactDetailsDeleteElement(index: number) {
    const selectedContactDetail = this._newFamilyContactDetailsData[index];
    if (Object.values(selectedContactDetail).some(value => value)) {
      this.communicationService.emitDialogData({
        title: 'Confirmar eliminación',
        content: 'Los cambios no se verán reflejados hasta que confirmes el envío del formulario principal.',
        size: 'sm',
        primaryButtonLabel: 'Confirmar',
        primaryButtonEvent: 'confirm-delete-contact-detail',
        secondaryButtonLabel: 'Cancelar',
        secondaryButtonEvent: 'cancel',
      });

      this.communicationService.subscribeDialogCallbackEvent$.subscribe(ev => {
        if (ev === 'confirm-delete-contact-detail') {
          this._deleteContactDetail(index);
        }
      });
    } else {
     this._deleteContactDetail(index);
    }
  }

  private _deleteContactDetail(index:number) {
    this._newFamilyContactDetailsData = [
      ...this._newFamilyContactDetailsData.filter((el, i) => i !== index)
    ];

    this._contactDetailSelectedIndex = this._newFamilyContactDetailsData.length -1;
    this.onFamilyContactDetailsChange.emit(this._newFamilyContactDetailsData);
  }

  /**
   * Set the current contact detail element to be shown
   * @param index
   * @protected
   */
  protected _onContactDetailIndexBtnClick(index: number) {
    this._contactDetailSelectedIndex = index;
  }

  protected trackFamilyContactDetail(index: number, family: TFamily) {
    return `${index}-contact-detail`;
  }

  protected trackButtonListElement(index: number) {
    return `${index}-button`;
  }


  public clear() {
    this._contactDetailSelectedIndex = -1;
    this._newFamilyContactDetailsData = [];
    this._initForm = false;
    this.panels?.forEach(panel => panel.close());
  }
}
