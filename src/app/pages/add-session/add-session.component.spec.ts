import {AddSessionComponent} from "./add-session.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {CommunicationService} from "../../services/communication.service";
import {FirestoreLoginService} from "../../services/firestore-login.service";
import {AppDataService} from "../../services/app-data.service";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {FirestoreQueriesService} from "../../services/firestore-queries.service";
import {importProvidersFrom} from "@angular/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../../../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {TGeneralConfig, TUserData} from "../../types/types";
import {provideAnimations} from "@angular/platform-browser/animations";

const userData = require('../../mocks/userData.json');
const generalConfig = require('../../mocks/generalConfig.json') as TGeneralConfig;

describe('AddSessionComponent', () => {
  let component: AddSessionComponent;
  let fixture: ComponentFixture<AddSessionComponent>;
  let communicationService: CommunicationService;
  let loginService: FirestoreLoginService;
  let appDataService: AppDataService;
  let errorHandlerService: ErrorHandlerService;
  let firestoreQueriesService: FirestoreQueriesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ AddSessionComponent ],
      providers: [
        CommunicationService,
        AppDataService,
        FirestoreQueriesService,
        FirestoreLoginService,
        ErrorHandlerService,
        provideAnimations(),
        importProvidersFrom([
          provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
          provideStorage(() => getStorage()),
          provideFunctions(() => getFunctions()),
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSessionComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
    loginService = TestBed.inject(FirestoreLoginService);
    appDataService = TestBed.inject(AppDataService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    firestoreQueriesService = TestBed.inject(FirestoreQueriesService);

    appDataService.clearLocalStorage();
    communicationService.emitNewUserData(userData);


    spyOn(firestoreQueriesService, 'saveData').and.returnValue(Promise.resolve(true));
  }));

  describe('On component mount', () => {
    it('Subscribe user data', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.subscribeUserData$.subscribe((data) => {
            expect(data).toEqual(userData);
            done();
          })
        });
    });

    it('Should set clinics on select', done => {
      const select = document.getElementById('selectClinicsCustomComponentId');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(select?.children.length).toBeGreaterThan(0);
          done();
        });
    });

    it('Should set patients on select', done => {
      const select = document.getElementById('selectPatientsCustomComponentId');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(select?.children.length).toBeGreaterThan(0);
          done();
        });
    });

    it('Submit button should be disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(button?.getAttribute('disabled')).toBe("true");
          done();
        });
    });
  });

  describe('Basic functionality', () => {

    it('Clinics select value can be changed and submit button will remain disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('test');
          expect(button?.getAttribute('disabled')).toBe("true");
          done();
        });
    });

    it('Patients select value can be changed and submit button will remain disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectPatientsElement?.elementSelected.emit('test');
          expect(button?.getAttribute('disabled')).toBe("true");
          done();
        });
    });

    it('Date value can be changed and submit button will remain disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.datepickerElement?.dateEmiiter.emit(new Date);
          expect(button?.getAttribute('disabled')).toBe("true");
          done();
        });
    });

    it('Observations value can be changed and submit button will remain disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.textareaElement?.textChange.emit('test');
          expect(button?.getAttribute('disabled')).toBe("true");
          done();
        });
    });

    it('Submit button should be enabled when clinic, patient and date are selected', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          expect(button?.getAttribute('disabled')).toBe(null);
          done();
        });
    });

    it('Clicking on submit button should open spinner', done => {
      const button = document.getElementById('submitButton');
      communicationService.openSpinner = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          expect(communicationService.openSpinner).toHaveBeenCalled();
          done();
        });
    });

    it('If data has been saved correctly spinner should be closed', done => {
      const button = document.getElementById('submitButton');
      communicationService.closeSpinner = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
          })
          done();
        });
    });

    it('If data has been saved correctly alert should be opened', done => {
      const button = document.getElementById('submitButton');
      communicationService.emitAlertData = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'success',
              message: 'Sesión agregada con éxito!',
              clearTimeMs: 3000
            });
          })
          done();
        });
    });

    it('If an error has occurred while saving data spinner should be closed', done => {
      const button = document.getElementById('submitButton');
      communicationService.closeSpinner = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(communicationService.closeSpinner).toHaveBeenCalled();
          })
          done();
        });
    });

    it('If an error has occurred while saving data error alert should be opened', done => {
      const button = document.getElementById('submitButton');
      communicationService.emitAlertData = jasmine.createSpy();
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(communicationService.emitAlertData).toHaveBeenCalledWith({
              id: '',
              type: 'danger',
              message: 'Error al agregar la sesión',
              clearTimeMs: 3000
            });
          })
          done();
        });
    });

    it('If an error has occurred while saving data validateError method should be called', done => {
      const button = document.getElementById('submitButton');
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      errorHandlerService.validateError = jasmine.createSpy().and.callFake(() => {});
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(errorHandlerService.validateError).toHaveBeenCalled();
          })
          done();
        });
    });

    it('After saving data all button should be disabled', done => {
      const button = document.getElementById('submitButton');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(button?.getAttribute('disabled')).toBe("true");
          }, 2000);
          done();
        });
    });

    it('If there is no sessions new session id will be 1', done => {
      const button = document.getElementById('submitButton');
      appDataService.setUserId('1234');
      const _userData: TUserData = {
        ...JSON.parse(JSON.stringify(userData)),
        sessions: []
      }
      communicationService.emitNewUserData(_userData);
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve());
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.selectClinicsElement?.elementSelected.emit('1');
          component.selectPatientsElement?.elementSelected.emit('1');
          component.datepickerElement?.dateEmiiter.emit(new Date);
          fixture.detectChanges();
          button?.click();
          setTimeout(() => {
            expect(firestoreQueriesService.saveData).toHaveBeenCalledWith('1234', {
              ..._userData,
              sessions: [ { sessionId: 1, clinicId: 1, patientId: 1, sessionDate: '2024-3-3', sessionObs: '', sessionValue: 350 }]
            });
            done();
          });
        });
    });

    it('Modal service should be opened by clicking the textarea label', done => {
      component.modalService.open = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          component.textareaElement?.onHintClick.emit();
          expect(component.modalService.open).toHaveBeenCalled();
          done();
        });
    });
  });
});
