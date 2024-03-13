import {RbPatientSchoolingCustomComponent} from "./rb-patient-schooling-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {CommunicationService} from "../../services/communication.service";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {TAddress, TPatient, TPatientSchooling, TUserData} from "../../types/types";
import {provideAnimations} from "@angular/platform-browser/animations";
import {SimpleChange} from "@angular/core";

const userData = require('./userData.json');

const initialSchoolingData: TPatientSchooling = {
  turn: '',
  schedule: {
    since: '',
    to: ''
  },
  institutionName: '',
  institutionContactDetails: {
    emailAddress: '',
    website: '',
    phoneNumber: '',
    mobilePhoneNumber: ''
  },
  institutionObs: '',
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  }
}

const initialAddressData: TAddress = {
  fullAddress: '',
  number: '',
  additionalInfo: ''
}
describe('RbPatientSchoolingCustomComponent', () => {
  let component: RbPatientSchoolingCustomComponent;
  let fixture: ComponentFixture<RbPatientSchoolingCustomComponent>;
  let communicationService: CommunicationService;
  let appDataService: AppDataService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RbPatientSchoolingCustomComponent],
      providers: [
        CommunicationService,
        AppDataService,
        ErrorHandlerService,
        provideAnimations()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RbPatientSchoolingCustomComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
    appDataService = TestBed.inject(AppDataService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  }));

  it('Component loads with initial schoolingData', () => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(component.schoolingData).toEqual(initialSchoolingData);
      })
  });

  it('If schoolingData has changed state should be updated', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.schoolingData = (JSON.parse(JSON.stringify(userData)) as TUserData).patients.find((patient: TPatient) => patient.patientId === 7)?.schooling || initialSchoolingData;
        component.ngOnChanges({ schoolingData: new SimpleChange(null, (JSON.parse(JSON.stringify(userData)) as TUserData).patients.find((patient: TPatient) => patient.patientId === 7)?.schooling, false)});
        fixture.detectChanges();
        expect(component.institutionName?.initialValue).not.toEqual('');
        expect(component.turn?.defaultValue).not.toEqual('');
        expect(component.scheduleSince?.value).not.toEqual('');
        expect(component.scheduleTo?.value).not.toEqual('');
        expect(component.address?.addressData).not.toEqual(initialAddressData);
        expect(component.email?.initialValue).not.toEqual('');
        expect(component.mobilePhone?.initialValue).not.toEqual('');
        expect(component.phone?.initialValue).not.toEqual('');
        expect(component.website?.initialValue).not.toEqual('');
        expect(component.obs?.defaultValue).not.toEqual('');
        done();
      });
  });

  it('Reset method should reset all values', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        if (
          component.institutionName &&
          component.turn &&
          component.scheduleSince &&
          component.scheduleTo &&
          component.address &&
          component.email &&
          component.mobilePhone &&
          component.phone &&
          component.website &&
          component.obs
        ) {
          component.institutionName.clear = jasmine.createSpy();
          component.turn.clear = jasmine.createSpy();
          component.scheduleSince.clear = jasmine.createSpy();
          component.scheduleTo.clear = jasmine.createSpy();
          component.address.clear = jasmine.createSpy();
          component.email.clear = jasmine.createSpy();
          component.mobilePhone.clear = jasmine.createSpy();
          component.phone.clear = jasmine.createSpy();
          component.website.clear = jasmine.createSpy();
          component.obs.clear = jasmine.createSpy();
        }
        component.clear();
        fixture.detectChanges();
        expect(component.institutionName?.clear).toHaveBeenCalled();
        expect(component.turn?.clear).toHaveBeenCalled();
        expect(component.scheduleSince?.clear).toHaveBeenCalled();
        expect(component.scheduleTo?.clear).toHaveBeenCalled();
        expect(component.address?.clear).toHaveBeenCalled();
        expect(component.email?.clear).toHaveBeenCalled();
        expect(component.phone?.clear).toHaveBeenCalled();
        expect(component.mobilePhone?.clear).toHaveBeenCalled();
        expect(component.website?.clear).toHaveBeenCalled();
        expect(component.obs?.clear).toHaveBeenCalled();
        done();
      });
  });

  describe('Test value changes', () => {
    let emitSchoolingDataSpy: jasmine.Spy;
    beforeEach(() => {
      emitSchoolingDataSpy = spyOn(component.emitSchoolingData, 'emit');
      component.schoolingData = initialSchoolingData;
      component.ngOnChanges({ schoolingData: new SimpleChange(null, initialSchoolingData, false)});
      fixture.detectChanges();
      emitSchoolingDataSpy.calls.reset();
    });

    it('Change institution name should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.institutionName?.onChange.emit('institution name');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionName: 'institution name' });
          done();
        });
    });

    it('Change turn should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.turn?.elementSelected.emit('Matutino');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, turn: 'Matutino' });
          done();
        });
    });

    it('Change schedule since should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.scheduleSince?.dateSelected.emit('8:00');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, schedule: { ...initialSchoolingData.schedule, since: '8:00' } });
          done();
        });
    });

    it('Change schedule to should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.scheduleTo?.dateSelected.emit('12:00');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, schedule: { ...initialSchoolingData.schedule, to: '12:00' } });
          done();
        });
    });

    it('Change address should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.address?.onAddressChange.emit({
            number: '1234',
            additionalInfo: 'additionalInfo',
            fullAddress: 'fullAddress'
          });
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, address: { number: '1234', fullAddress: 'fullAddress', additionalInfo: 'additionalInfo' } });
          done();
        });
    });

    it('Change email should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.email?.onChange.emit('a@a.com');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionContactDetails: { ...initialSchoolingData.institutionContactDetails, emailAddress: 'a@a.com' }});
          done();
        });
    });

    it('Change website should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.website?.onChange.emit('www.page.com');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionContactDetails: { ...initialSchoolingData.institutionContactDetails, website: 'www.page.com' }});
          done();
        });
    });

    it('Change phone number should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.phone?.onChange.emit('12345');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionContactDetails: { ...initialSchoolingData.institutionContactDetails, phoneNumber: '12345' }});
          done();
        });
    });

    it('Change mobile phone number should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.mobilePhone?.onChange.emit('1234');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionContactDetails: { ...initialSchoolingData.institutionContactDetails, mobilePhoneNumber: '1234' }});
          done();
        });
    });

    it('Change institution obs should emit new data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.obs?.textChange.emit('institution obs');
          fixture.detectChanges();
          expect(emitSchoolingDataSpy).toHaveBeenCalledWith({ ...initialSchoolingData, institutionObs: 'institution obs' });
          done();
        });
    });
  });
});
