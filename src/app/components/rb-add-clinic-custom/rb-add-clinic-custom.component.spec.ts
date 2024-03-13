import {RbAddClinicCustomComponent} from "./rb-add-clinic-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TClinic, TUserData} from "../../types/types";
import {SimpleChange} from "@angular/core";

const userData: TUserData = JSON.parse(JSON.stringify(require('./userData.json')));
type TClinicNoId = Omit<TClinic, 'clinicId'>;

const initialClinicData: TClinicNoId = {
  clinicName: '',
  address: {
    fullAddress: '',
    number: '',
    additionalInfo: ''
  },
  contactDetails: {
    emailAddress: '',
    mobilePhoneNumber: '',
    phoneNumber: '',
    website: ''
  }
}


describe('RbAddClinicCustomComponent', () => {
  let component: RbAddClinicCustomComponent;
  let fixture: ComponentFixture<RbAddClinicCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RbAddClinicCustomComponent ],
      providers: [ provideAnimations() ]
    }).compileComponents();

    fixture = TestBed.createComponent(RbAddClinicCustomComponent);
    component = fixture.componentInstance;
  }));

  describe('Basic functionality', () => {
    it('If clinicData input property has changed value should be updated', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.clinicData = userData.clinics[0];
          component.ngOnChanges({ clinicData: new SimpleChange(null, userData.clinics[0], false )});
          fixture.detectChanges();
          expect(component.nameInput?.initialValue).not.toEqual('');
          done();
        });
    });

    it('Reset method should reset values', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          if (
            component.nameInput &&
            component.addressInput &&
            component.numberInput &&
            component.additionalInfoInput &&
            component.emailInput &&
            component.mobilePhoneInput &&
            component.phoneInput &&
            component.websiteInput
          ) {
            component.nameInput.clear = jasmine.createSpy();
            component.addressInput.clear = jasmine.createSpy();
            component.numberInput.clear = jasmine.createSpy();
            component.additionalInfoInput.clear = jasmine.createSpy();
            component.emailInput.clear = jasmine.createSpy();
            component.mobilePhoneInput.clear = jasmine.createSpy();
            component.phoneInput.clear = jasmine.createSpy();
            component.websiteInput.clear = jasmine.createSpy();
          }

          component.clearValues();

          expect(component.nameInput?.clear).toHaveBeenCalled();
          expect(component.addressInput?.clear).toHaveBeenCalled();
          expect(component.numberInput?.clear).toHaveBeenCalled();
          expect(component.additionalInfoInput?.clear).toHaveBeenCalled();
          expect(component.emailInput?.clear).toHaveBeenCalled();
          expect(component.mobilePhoneInput?.clear).toHaveBeenCalled();
          expect(component.phoneInput?.clear).toHaveBeenCalled();
          expect(component.websiteInput?.clear).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('Add clinic - basic functionality', () => {
    let emitClinicDataSpy: jasmine.Spy;

    beforeEach(() => {
      component.clinicData = initialClinicData;
      component.ngOnChanges({ clinicData: new SimpleChange(null, initialClinicData, false )});
      emitClinicDataSpy = spyOn(component.onClinicDataChange, 'emit');
      emitClinicDataSpy.calls.reset();
    })


    it('By default add new clinic button should be visible', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.querySelector('div.submit-button-container')).toBeTruthy();
          done();
        });
    });

    it('By default add new clinic button should be disabled', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(document.getElementById('submitButton')?.getAttribute('disabled')).toEqual(null);
          done();
        });
    });

    it('If clinic name change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.nameInput?.onChange.emit('name');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            clinicName: 'name'
          });
          done();
        });
    });

    it('If clinic full address change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.addressInput?.onChange.emit('address');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            address: {
              ...initialClinicData.address,
              fullAddress: 'address'
            }
          });
          done();
        });
    });

    it('If clinic address number change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.numberInput?.onChange.emit('1234');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            address: {
              ...initialClinicData.address,
              number: '1234'
            }
          });
          done();
        });
    });

    it('If clinic additional info change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.additionalInfoInput?.onChange.emit('additionalInfo');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            address: {
              ...initialClinicData.address,
              additionalInfo: 'additionalInfo'
            }
          });
          done();
        });
    });

    it('If clinic email address info change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.emailInput?.onChange.emit('a@a.com');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            contactDetails: {
              ...initialClinicData.contactDetails,
              emailAddress: 'a@a.com'
            }
          });
          done();
        });
    });

    it('If clinic mobile phone number info change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.mobilePhoneInput?.onChange.emit('12345');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            contactDetails: {
              ...initialClinicData.contactDetails,
              mobilePhoneNumber: '12345'
            }
          });
          done();
        });
    });

    it('If clinic phone number info change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.phoneInput?.onChange.emit('12345');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            contactDetails: {
              ...initialClinicData.contactDetails,
              phoneNumber: '12345'
            }
          });
          done();
        });
    });

    it('If clinic website info change value should be emitted', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.websiteInput?.onChange.emit('www.a.com');
          expect(emitClinicDataSpy).toHaveBeenCalledWith({
            ...initialClinicData,
            contactDetails: {
              ...initialClinicData.contactDetails,
              website: 'www.a.com'
            }
          });
          done();
        });
    });

    it('Clicking on submit button should emit event', done => {
      component.onSubmitClinic.emit = jasmine.createSpy();
      component.submitButtonDisabled = false;
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.nameInput?.onChange.emit('name');
          fixture.detectChanges();
          document.getElementById('submitButton')?.click();
          expect(component.onSubmitClinic.emit).toHaveBeenCalled();
          done();
        });
    });
  });
});
