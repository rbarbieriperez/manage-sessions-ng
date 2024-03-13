import {RbPatientAddressCustomComponent} from "./rb-patient-address-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TAddress} from "../../types/types";
import {SimpleChange} from "@angular/core";

const initialAddressData: TAddress = {
  fullAddress: '',
  number: '',
  additionalInfo: ''
}

describe('RbPatientAddressCustomComponent', () => {
  let component: RbPatientAddressCustomComponent;
  let fixture: ComponentFixture<RbPatientAddressCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RbPatientAddressCustomComponent ],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RbPatientAddressCustomComponent);
    component = fixture.componentInstance;
  }));

  it('Should set initial data if present', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.addressData = { fullAddress: 'asdf', number: '1234', additionalInfo: 'asdf' };
        component.ngOnChanges({ addressData: new SimpleChange(null, { fullAddress: 'asdf', number: '1234', additionalInfo: 'asdf' }, false )});
        fixture.detectChanges();
        expect(component.fullAddress?.initialValue).toEqual('asdf');
        expect(component.number?.initialValue).toEqual('1234');
        expect(component.additionalInfo?.initialValue).toEqual('asdf');
        done();
      });
  });

  it('Changing full address value should emit data', done => {
    component.onAddressChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.fullAddress?.onChange.emit('fullAddress');
        fixture.detectChanges();
        expect(component.onAddressChange.emit).toHaveBeenCalledWith({
          ...initialAddressData,
          fullAddress: 'fullAddress'
        });
        done();
      });
  });

  it('Changing number value should emit data', done => {
    component.onAddressChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.number?.onChange.emit('1234');
        fixture.detectChanges();
        expect(component.onAddressChange.emit).toHaveBeenCalledWith({
          ...initialAddressData,
          number: '1234'
        });
        done();
      });
  });

  it('Changing additional information value should emit data', done => {
    component.onAddressChange.emit = jasmine.createSpy();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        component.additionalInfo?.onChange.emit('additionalInfo');
        fixture.detectChanges();
        expect(component.onAddressChange.emit).toHaveBeenCalledWith({
          ...initialAddressData,
          additionalInfo: 'additionalInfo'
        });
        done();
      });
  });

  it('Clear method should clear all values', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        if (
          component.fullAddress &&
          component.number &&
          component.additionalInfo
        ) {
          component.fullAddress.clear = jasmine.createSpy();
          component.number.clear = jasmine.createSpy();
          component.additionalInfo.clear = jasmine.createSpy();
        }
        component.clear();
        expect(component.fullAddress?.clear).toHaveBeenCalled();
        expect(component.number?.clear).toHaveBeenCalled();
        expect(component.additionalInfo?.clear).toHaveBeenCalled();
        done();
      });
  });

  it('Clear method should close all panels', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        if (component.panels?.length) {
          component.panels.forEach(panel => panel.close = jasmine.createSpy());
          component.clear();
          component.panels.forEach((panel) => {
            expect(panel.close).toHaveBeenCalled();
          });
          done();
        }
      });
  });
});
