import {RbPatientAddressCustomComponent} from "./rb-patient-address-custom.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {provideAnimations} from "@angular/platform-browser/animations";

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


});
