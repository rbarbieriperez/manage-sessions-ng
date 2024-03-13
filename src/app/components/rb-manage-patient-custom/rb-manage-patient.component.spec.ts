import {RbManagePatientComponent} from "./rb-manage-patient.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TPatient, TPatientSchooling, TUserData} from "../../types/types";
import dayjs from "dayjs";
import {SimpleChange} from "@angular/core";

const userData: TUserData = JSON.parse(JSON.stringify(require('./userData.json')));

type TPatientNoId = Omit<TPatient, 'patientId'>;

const initialPatientData: TPatientNoId = {
  clinicId: 0,
  names: '',
  surnames: '',
  sessionValue: 0,
  observations: '',
  bornDate: '',
  sessionTime: 0,
  family: [],
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  schooling: {
    turn: '',
    schedule: {
      since: '',
      to: ''
    },
    institutionObs: '',
    institutionName: '',
    institutionContactDetails: {
      emailAddress: '',
      website: '',
      phoneNumber: '',
      mobilePhoneNumber: ''
    },
    address: {
      fullAddress: '',
      number: '',
      additionalInfo: ''
    }
  }

}

describe('RbManagePatientComponent', () => {
  let component: RbManagePatientComponent;
  let fixture: ComponentFixture<RbManagePatientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RbManagePatientComponent ],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RbManagePatientComponent);
    component = fixture.componentInstance;
  }));

  describe('Component setup - basic functionality', () => {
    it('By default all inputs should be empty', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(component.names?.initialValue).toEqual('');
          expect(component.surnames?.initialValue).toEqual('');
          expect(component.bornDate?.defaultValue).toEqual('');
          expect(component.sessionAmount?.initialValue).toEqual('0');
          expect(component.sessionTime?.initialValue).toEqual('0');
          expect(component.observations?.defaultValue).toEqual('');
          expect(component.address?.addressData).toEqual({ number: '', additionalInfo: '', fullAddress: '' });
          expect(component.family?.familyContactDetailsData).toEqual([]);
          expect(component.schooling?.schoolingData).toEqual(initialPatientData.schooling);
          done();
        });
    });

    it('By default submit button should be visible', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.querySelector('section.submit-button-container')).toBeTruthy();
          done();
        });
    });

    it('By default submit button should be disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.getElementById('submitButton')?.getAttribute('disabled')).toEqual('true');
          done();
        });
    });

    it('By default update/delete buttons should not be visible', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.querySelector('section.update-delete-buttons-container')).not.toBeTruthy();
          done();
        });
    });

    it('Clear method should clear all values', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (
            component.clinic &&
            component.names &&
            component.surnames &&
            component.bornDate &&
            component.sessionAmount &&
            component.sessionTime &&
            component.observations &&
            component.address &&
            component.family &&
            component.schooling
          ) {
            component.clinic.clear = jasmine.createSpy();
            component.names.clear = jasmine.createSpy();
            component.surnames.clear = jasmine.createSpy();
            component.bornDate.clear = jasmine.createSpy();
            component.sessionAmount.clear = jasmine.createSpy();
            component.sessionTime.clear = jasmine.createSpy();
            component.observations.clear = jasmine.createSpy();
            component.address.clear = jasmine.createSpy();
            component.family.clear = jasmine.createSpy();
            component.schooling.clear = jasmine.createSpy();
          }

          component.clearFields();

          expect(component.clinic?.clear).toHaveBeenCalled();
          expect(component.names?.clear).toHaveBeenCalled();
          expect(component.surnames?.clear).toHaveBeenCalled();
          expect(component.bornDate?.clear).toHaveBeenCalled();
          expect(component.sessionAmount?.clear).toHaveBeenCalled();
          expect(component.sessionTime?.clear).toHaveBeenCalled();
          expect(component.observations?.clear).toHaveBeenCalled();
          expect(component.address?.clear).toHaveBeenCalled();
          expect(component.family?.clear).toHaveBeenCalled();
          expect(component.schooling?.clear).toHaveBeenCalled();
          done();
        });
    });

    it('If clinics input property has changed options array should be updated', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.clinics = userData.clinics;
          component.ngOnChanges({ clinics: new SimpleChange(null, userData.clinics, false )});
          fixture.detectChanges();
          expect(component.clinic?.elements).not.toEqual([]);
          done();
        });
    });

    it('If patient data input property has changed value should be reflected', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const patientDataNoId: TPatientNoId = {
            names: 'names',
            surnames: 'surnames',
            family: [],
            address: { fullAddress: '', number: '', additionalInfo: ''},
            bornDate: '',
            clinicId: 1,
            observations: '',
            schooling: {
              turn: '',
              address: { fullAddress: '', additionalInfo: '', number: '' },
              institutionObs: '',
              schedule: { since: '', to: '' },
              institutionName: '',
              institutionContactDetails: {
                emailAddress: '',
                phoneNumber: '',
                mobilePhoneNumber: '',
                website: ''
              }
            },
            sessionTime: 0,
            sessionValue: 0
          }
          component.patientData = patientDataNoId;
          component.ngOnChanges({ patientData: new SimpleChange(null, patientDataNoId, false )});
          fixture.detectChanges();
          expect(component.names?.initialValue).not.toEqual('');
          done();
        });
    });
  });

  describe('Add new patient - basic functionality', () => {
    let emitPatientDataSpy: jasmine.Spy;
    beforeEach(() => {
      emitPatientDataSpy = spyOn(component.emitPatientData, 'emit');
      emitPatientDataSpy.calls.reset();
    });

    it('Change clinic should emit patient data with the selected clinicId', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.clinic?.elementSelected.emit('1');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            clinicId: 1
          });
          done();
        });
    });

    it('Change patient names should emit data with the patient name', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.names?.onChange.emit('names');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            names: 'names'
          });
          done();
        });
    });

    it('Change patient surnames should emit data with the patient surname', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.surnames?.onChange.emit('surnames');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            surnames: 'surnames'
          });
          done();
        });
    });

    it('Change patient born date should emit data with the patient born date', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.bornDate?.dateEmiiter.emit(new Date);
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            bornDate: dayjs(new Date()).format('YYYY-MM-DD')
          });
          done();
        });
    });

    it('Change patient session value should emit data with the patient session value', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.sessionAmount?.onChange.emit('1000');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            sessionValue: 1000
          });
          done();
        });
    });

    it('Change patient session time should emit data with the patient session time value', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.sessionTime?.onChange.emit('60');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            sessionTime: 60
          });
          done();
        });
    });

    it('Change patient observations should emit data with the observations value', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.observations?.textChange.emit('obs');
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            observations: 'obs'
          });
          done();
        });
    });

    it('Change patient address information should emit data with the new address info', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.address?.onAddressChange.emit({
            number: '1234',
            fullAddress: 'fullAddress',
            additionalInfo: 'additionalInfo'
          });
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            address: {
              number: '1234',
              fullAddress: 'fullAddress',
              additionalInfo: 'additionalInfo'
            }
          });
          done();
        })
    });

    it('Change patient family contact details should emit patient data new new contact details', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.family?.onFamilyContactDetailsChange.emit([
            {
              surnames: 'surnames',
              names: 'names',
              relationType: 'relationType',
              contactType: 'contactType',
              contactDetail: 'contactDetail'
            }
          ]);
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            family: [
              {
                surnames: 'surnames',
                names: 'names',
                relationType: 'relationType',
                contactType: 'contactType',
                contactDetail: 'contactDetail'
              }
            ]
          });
          done();
        });
    });

    it('Change patient schooling information should emit patient data with new patient schooling information', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          const schooling: TPatientSchooling = {
            address: {
              fullAddress: 'fullAddress',
              additionalInfo: 'additionalInfo',
              number: '1234'
            },
            institutionContactDetails: {
              emailAddress: 'emailAddress',
              website: 'website',
              mobilePhoneNumber: 'mobilePhoneNumber',
              phoneNumber: 'phoneNumber'
            },
            institutionName: 'institutionName',
            turn: 'turn',
            schedule: { since: 'since', to: 'to' },
            institutionObs: 'institutionObs'
          };

          component.schooling?.emitSchoolingData.emit(schooling);
          expect(emitPatientDataSpy).toHaveBeenCalledWith({
            ...initialPatientData,
            schooling
          });
          done();
        });
    });

    it('Clicking submit button should emit event', done => {
      component.onSubmitBtnClick.emit = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.submitButtonDisabled = false;
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          expect(component.onSubmitBtnClick.emit).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('Update/Delete patient - basic functionality', () => {
    beforeEach(() => {
      component.isUpdateDeleteForm = true;
    });

    it('Update and delete button should be shown', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.querySelector('section.update-delete-buttons-container')).toBeTruthy();
          done();
        });
    });

    it('Update button should start disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.getElementById('updateButton')?.getAttribute('disabled')).not.toEqual(null);
          done();
        });
    });

    it('Delete button should start enabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.getElementById('deleteButton')?.getAttribute('disabled')).toEqual(null);
          done();
        });
    });

    it('Clicking update button should emit event', done => {
      component.onUpdateBtnClick.emit = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.submitButtonDisabled = false;
          fixture.detectChanges();
          document.getElementById('updateButton')?.click();
          expect(component.onUpdateBtnClick.emit).toHaveBeenCalled();
          done();
        });
    });

    it('Clicking on delete button should emit event', done => {
      component.onDeleteBtnClick.emit = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          document.getElementById('deleteButton')?.click();
          expect(component.onDeleteBtnClick.emit).toHaveBeenCalled();
          done();
        });
    });
  });
});
