import {RbPatientContactDetailCustomComponent} from "./rb-patient-contact-detail-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TFamily, TPatient, TUserData} from "../../types/types";
import {SimpleChange} from "@angular/core";
const userData = require('./userData.json');

const _userData = JSON.parse(JSON.stringify(userData)) as TUserData;

const initialContactDetailData: TFamily = {
  relationType: '',
  contactDetail: '',
  surnames: '',
  contactType: '',
  names: ''
}

describe('RbPatientContactDetailCustomComponent', () => {
  let component: RbPatientContactDetailCustomComponent;
  let fixture: ComponentFixture<RbPatientContactDetailCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RbPatientContactDetailCustomComponent],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RbPatientContactDetailCustomComponent);
    component = fixture.componentInstance;
  }));

  it('Values should me mapped if contactDetailData is not empty', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.contactDetailData = _userData.patients.find((patient: TPatient) => patient.patientId === 7)?.family[0];
        component.ngOnChanges({ contactDetailData: new SimpleChange(null, _userData.patients.find((patient: TPatient) => patient.patientId === 7)?.family[0], false )});
        fixture.detectChanges();
        expect(component.names?.initialValue).not.toEqual('');
        expect(component.surnames?.initialValue).not.toEqual('');
        expect(component.relationType?.defaultValue).not.toEqual('');
        expect(component.contactDetail?.initialValue).not.toEqual('');
        expect(component.contactType?.defaultValue).not.toEqual('');
        done();
      });
  });

  it('Select relation type should emit value', done => {
    component.onContactDetailDataChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.relationType?.elementSelected.emit('Madre');
        fixture.detectChanges();
        expect(component.onContactDetailDataChange.emit).toHaveBeenCalledWith({
          data: { ...initialContactDetailData, relationType: 'Madre' },
          index: 0
        });
        done();
      });
  });

  it('Changing name should emit value', done => {
    component.onContactDetailDataChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.names?.onChange.emit('name');
        fixture.detectChanges();
        expect(component.onContactDetailDataChange.emit).toHaveBeenCalledWith({
          data: { ...initialContactDetailData, names: 'name' },
          index: 0
        });
        done();
      });
  });

  it('Changing surnames should emit value', done => {
    component.onContactDetailDataChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.surnames?.onChange.emit('surnames');
        fixture.detectChanges();
        expect(component.onContactDetailDataChange.emit).toHaveBeenCalledWith({
          data: { ...initialContactDetailData, surnames: 'surnames' },
          index: 0
        });
        done();
      });
  });

  it('Selecting contact type should emit value', done => {
    component.onContactDetailDataChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.contactType?.elementSelected.emit('Celular');
        fixture.detectChanges();
        expect(component.onContactDetailDataChange.emit).toHaveBeenCalledWith({
          data: { ...initialContactDetailData, contactType: 'Celular' },
          index: 0
        });
        done();
      });
  });

  it('Changing contact detail should emit value', done => {
    component.onContactDetailDataChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.contactDetail?.onChange.emit('09999999');
        fixture.detectChanges();
        expect(component.onContactDetailDataChange.emit).toHaveBeenCalledWith({
          data: { ...initialContactDetailData, contactDetail: '09999999' },
          index: 0
        });
        done();
      });
  });

  it('Clicking on delete element should emit event', done => {
    component.onContactDetailDelete.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        document.getElementById('delete-contact-detail-button')?.click();
        fixture.detectChanges();
        expect(component.onContactDetailDelete.emit).toHaveBeenCalledWith(0);
        done();
      });
  });

  it('Clear method should clear all values', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        if (
          component.names &&
          component.surnames &&
          component.relationType &&
          component.contactType &&
          component.contactDetail
        ) {
          component.names.clear = jasmine.createSpy();
          component.surnames.clear = jasmine.createSpy();
          component.relationType.clear = jasmine.createSpy();
          component.contactType.clear = jasmine.createSpy();
          component.contactDetail.clear = jasmine.createSpy();
        }
        component.clear();
        expect(component.names?.clear).toHaveBeenCalled();
        expect(component.surnames?.clear).toHaveBeenCalled();
        expect(component.contactDetail?.clear).toHaveBeenCalled();
        expect(component.contactType?.clear).toHaveBeenCalled();
        expect(component.relationType?.clear).toHaveBeenCalled();
        done();
      });
  });
})
