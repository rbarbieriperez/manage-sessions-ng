import {RbPatientFamilyContactDetailsCustomComponent} from "./rb-patient-family-contact-details-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TFamily, TPatient, TUserData} from "../../types/types";
import {SimpleChange} from "@angular/core";
import {CommunicationService} from "../../services/communication.service";

const userData: TUserData = JSON.parse(JSON.stringify(require('./userData.json')));

describe('RbPatientFamilyContactDetailsCustomComponent', () => {
  let component: RbPatientFamilyContactDetailsCustomComponent;
  let fixture: ComponentFixture<RbPatientFamilyContactDetailsCustomComponent>;
  let communicationService: CommunicationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RbPatientFamilyContactDetailsCustomComponent ],
      providers: [
        CommunicationService,
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RbPatientFamilyContactDetailsCustomComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
  }));

  describe('Component setup - there are contact details elements', () => {
    let patientFamily: TFamily[];
    beforeEach( () => {
      patientFamily = userData.patients.find((patient: TPatient) => patient.patientId === 7)?.family || [];
      component.familyContactDetailsData = patientFamily;
      component.ngOnChanges({ familyContactDetailsData: new SimpleChange(null, patientFamily, false)});
    });

    it('Contact details element should be rendered if family contact details data exists', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const familyContactDetailsEls = document.querySelectorAll('rb-patient-contact-detail-custom');
          expect(familyContactDetailsEls.length).toEqual(3);
          done();
        });
    });

    it('Navigation buttons should be rendered if family contact details data exists', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const buttonsEls = document.querySelectorAll('#indexButtons');
          expect(buttonsEls.length).toEqual(3);
          done();
        });
    });

    it('If existing elements are 3, add new contact detail elements button should be disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const addBtn = document.getElementById('addNewContactDetailButton');
          expect(addBtn?.getAttribute('disabled')).toEqual('true');
          done();
        });
    });

    it('If there are multiple elements, by default selected should be the first one', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const detailEls = document.querySelectorAll('rb-patient-contact-detail-custom');
          expect(detailEls[0]?.querySelector('div.patient-contact-detail-container')?.getAttribute('hidden')).toEqual(null);
          done();
        });
    });

    it('If there are multiple elements, others apart from the first one should be hidden', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const detailEls = document.querySelectorAll('rb-patient-contact-detail-custom');
          detailEls.forEach((el, index) => {
            if (index) {
              expect(el.querySelector('div.patient-contact-detail-container')?.getAttribute('hidden')).not.toEqual(null);
            }
          });
          done();
        });
    });

    it('Updating third contact detail element contact name should emit data', done => {
      component.onFamilyContactDetailsChange.emit = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (component.contactDetailsEls?.length) {
           component.contactDetailsEls.get(component.contactDetailsEls.length -1)?.onContactDetailDataChange.emit({
             index: component.contactDetailsEls.length -1,
             data: {
               names: 'names',
               contactDetail: 'contactDetail',
               surnames: 'surnames',
               contactType: 'contactType',
               relationType: 'relationType'
             }
           });

           expect(component.onFamilyContactDetailsChange.emit).toHaveBeenCalledWith([
             ...patientFamily.slice(0, component.contactDetailsEls.length -1),
             {
               names: 'names',
               surnames: 'surnames',
               contactType: 'contactType',
               contactDetail: 'contactDetail',
               relationType: 'relationType'
             }
           ]);
           done();
          } else {
            fail('Contact detail elements does not exists.');
          }
        });
    });

    it('Updating third contact detail element contact name should emit data', done => {
      component.onFamilyContactDetailsChange.emit = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (component.contactDetailsEls?.length) {
            component.contactDetailsEls.get(0)?.onContactDetailDataChange.emit({
              index: 0,
              data: {
                names: 'names',
                contactDetail: 'contactDetail',
                surnames: 'surnames',
                contactType: 'contactType',
                relationType: 'relationType'
              }
            });

            expect(component.onFamilyContactDetailsChange.emit).toHaveBeenCalledWith([
              {
                names: 'names',
                surnames: 'surnames',
                contactType: 'contactType',
                contactDetail: 'contactDetail',
                relationType: 'relationType'
              },
              ...patientFamily.slice(1)
            ]);
            done();
          } else {
            fail('Contact detail elements does not exists.');
          }
        });
    });

    it('Clicking on delete button should open dialog', done => {
      communicationService.emitDialogData = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.contactDetailsEls?.get(2)?.onContactDetailDelete.emit(2);
          fixture.detectChanges();
          expect(communicationService.emitDialogData).toHaveBeenCalledWith({
            title: 'Confirmar eliminación',
            content: 'Los cambios no se verán reflejados hasta que confirmes el envío del formulario principal.',
            size: 'sm',
            primaryButtonLabel: 'Confirmar',
            primaryButtonEvent: 'confirm-delete-contact-detail',
            secondaryButtonLabel: 'Cancelar',
            secondaryButtonEvent: 'cancel',
          });
          done();
        });
    });

    it('Accepting confirm delete dialog should delete the item', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.contactDetailsEls?.get(2)?.onContactDetailDelete.emit(2);
          fixture.detectChanges();
          communicationService.emitDialogCallbackEvent('confirm-delete-contact-detail');
          fixture.detectChanges();
          expect(component.contactDetailsEls?.length).toEqual(2);
          done();
        });
    });

    it('If contact details was added and then removed no dialog should be opened', done => {
      communicationService.emitDialogData = jasmine.createSpy();
      component.familyContactDetailsData = [];
      component.ngOnChanges({ familyContactDetailsData: new SimpleChange(null, [], false)});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          document.getElementById('addNewContactDetailButton')?.click();
          fixture.detectChanges();
          component.contactDetailsEls?.get(0)?.onContactDetailDelete.emit(0);
          fixture.detectChanges();
          expect(communicationService.emitDialogData).not.toHaveBeenCalled();
          done();
        });
    });

    it('Clicking on contact detail index button should change the visible element', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const indexButtons = document.querySelectorAll('#indexButtons');
          (indexButtons[2] as HTMLButtonElement)?.click();
          fixture.detectChanges();
          const element = document.querySelectorAll('rb-patient-contact-detail-custom')[2].querySelector('div.patient-contact-detail-container');
          expect(element?.getAttribute('disabled')).toEqual(null);
          done();
        });
    });

    it('Calling clear method should remove all elements', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.clear();
          fixture.detectChanges();
          expect(component.contactDetailsEls?.length).toEqual(0);
          done();
        });
    });
  });

  describe('Component setup - there are no contact details elements', () => {
    it ('No elements should be rendered initially', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(component.contactDetailsEls?.length).toEqual(0);
          done();
        });
    });

    it('Add new contact detail button should be enabled by default', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.getElementById('addNewContactDetailButton')?.getAttribute('disabled')).toEqual(null);
          done();
        });
    });

    it('There no should be index buttons displayed', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.querySelectorAll('#indexButtons').length).toEqual(0);
          done();
        });
    });

    it('Clicking on add new contact detail button should add the element', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          document.getElementById('addNewContactDetailButton')?.click();
          fixture.detectChanges();
          expect(component.contactDetailsEls?.length).toEqual(1);
          done();
        });
    });

    it('If the maximum length of 3 contact details elements is reached add button should be disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const addBtn = document.getElementById('addNewContactDetailButton');
          addBtn?.click();
          addBtn?.click();
          addBtn?.click();
          fixture.detectChanges();
          expect(addBtn?.getAttribute('disabled')).toEqual('true');
          done();
        });
    });

    it('Deleting a element should enable de add button again', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const addBtn = document.getElementById('addNewContactDetailButton');
          addBtn?.click();
          addBtn?.click();
          addBtn?.click();
          fixture.detectChanges();
          component.contactDetailsEls?.get(2)?.onContactDetailDelete.emit(2);
          fixture.detectChanges();
          expect(addBtn?.getAttribute('disabled')).toEqual(null);
          done();
        });
    });

    it('Deleting a element should decrease the index button elements', done => {
      const addBtn = document.getElementById('addNewContactDetailButton');
      addBtn?.click();
      addBtn?.click();
      fixture.detectChanges();
      component.contactDetailsEls?.get(1)?.onContactDetailDelete.emit(1);
      fixture.detectChanges();
      expect(document.querySelectorAll('#indexButtons').length).toEqual(1);
      done();
    });
  });
});
