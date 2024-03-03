import {AppComponent} from "./app.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {CommunicationService} from "./services/communication.service";
import {DebugElement, importProvidersFrom} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getStorage, provideStorage} from "@angular/fire/storage";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {FirestoreSubscribeService} from "./services/firestore-subscribe.service";
import {FirestoreQueriesService} from "./services/firestore-queries.service";
import {TGeneralConfig} from "./types/types";
import {AppDataService} from "./services/app-data.service";
import {FirestoreBackupService} from "./services/firestore-backup.service";
import {ErrorHandlerService} from "./services/error-handler.service";

const userData = require('./mocks/userData.json');
const generalConfig = require('./mocks/generalConfig.json') as TGeneralConfig;


describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let communicationService: CommunicationService;
  let firestoreSubscribeService: FirestoreSubscribeService;
  let firestoreQueriesService: FirestoreQueriesService;
  let appDataService: AppDataService;
  let backupService: FirestoreBackupService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
      ],
      providers: [
        CommunicationService,
        AppDataService,
        FirestoreQueriesService,
        FirestoreSubscribeService,
        FirestoreBackupService,
        ErrorHandlerService,
        importProvidersFrom([
          provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideFirestore(() => getFirestore()),
          provideAuth(() => getAuth()),
          provideStorage(() => getStorage()),
          provideFunctions(() => getFunctions()),
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    communicationService = TestBed.inject(CommunicationService);
    firestoreSubscribeService = TestBed.inject(FirestoreSubscribeService);
    firestoreQueriesService = TestBed.inject(FirestoreQueriesService);
    appDataService = TestBed.inject(AppDataService);
    backupService = TestBed.inject(FirestoreBackupService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  }));


  it('should open spinner on load', done => {
    const openSpinnerSpy = spyOn(communicationService, 'openSpinner');
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(openSpinnerSpy).toHaveBeenCalled();
        done();
      })
  });


  it('Should subscribe to login observer if user id does not exist on local storage', done => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {

        communicationService.subscribeLoginSubject$.subscribe(() => {
          done();
        });

        communicationService.emitLoginSuccess();
      });
  });


  describe('Add subscribers', () => {

    beforeEach(() => {
      spyOn(firestoreQueriesService, 'saveData').and.returnValue(Promise.resolve(true));
      spyOn(firestoreSubscribeService, 'subscribeStore').and.returnValue((new Observable(obs => obs.next(JSON.parse(JSON.stringify(userData))))));
      spyOn(firestoreQueriesService, 'getAppConfig').and.returnValue(JSON.parse(JSON.stringify(generalConfig)));
      spyOn(backupService, 'initBackupService').and.returnValue(Promise.resolve());
      spyOn(errorHandlerService, 'handleError').and.callFake(() => {});
      appDataService.setUserId('1234');
    });


    it('should subscribe to user data if userId exists on local storage', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.emitLoginSuccess();
          expect(component.userData).toEqual(userData);
          done();
        });
    });

    it('should emit user data if general config and user data exists', done => {
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.subscribeUserData$.subscribe(data => {
            expect(data).toEqual(userData);
            done();
          });
          communicationService.emitLoginSuccess();
        });
    });

    it('Should initialize backup service', done => {
      backupService.initBackupService = jasmine.createSpy();
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.emitLoginSuccess();
          expect(backupService.initBackupService).toHaveBeenCalled();
          done();
        });
    });

    it('should close spinner', done => {
      const closeSpinnerSpy = spyOn(communicationService, 'closeSpinner');
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(closeSpinnerSpy).toHaveBeenCalled();
          done();
        });
    });

    it('if application general config could not be retrieved session should be closed', done => {
      firestoreQueriesService.getAppConfig = jasmine.createSpy().and.returnValue(Promise.resolve(false));
      errorHandlerService.handleError = jasmine.createSpy().and.returnValue(null);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          communicationService.emitLoginSuccess();
          expect(errorHandlerService.handleError).toHaveBeenCalledWith('close-session');
          done();
        });
    });

    it('If user data could not be retrieved empty user data object should be stored',  done => {
      firestoreSubscribeService.subscribeStore = jasmine.createSpy().and.returnValue((new Observable(obs => obs.error('missing-data'))));
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.resolve(true));
      fixture.detectChanges();

      fixture.whenStable()
        .then(() => {
          expect(firestoreQueriesService.saveData).toHaveBeenCalledWith('1234',
            {
              name: '',
              surname: '',
              sessions: [],
              patients: [],
              clinics: [],
              admConfig: {
                isActive: false
              }
            });
          done();
        });
    });

    it('If any error has occurred while adding subscriber session should be closed', done => {
      firestoreQueriesService.getAppConfig = jasmine.createSpy().and.returnValue(() => {
        throw new Error('error');
      })();
      errorHandlerService.handleError = jasmine.createSpy().and.returnValue(null)
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(errorHandlerService.handleError).toHaveBeenCalledWith('close-session');
          done();
        });
    });

    it('If any error has occurred while adding new user data session should be closed', done => {
      firestoreQueriesService.saveData = jasmine.createSpy().and.returnValue(Promise.reject());
      firestoreSubscribeService.subscribeStore = jasmine.createSpy().and.returnValue((new Observable(obs => obs.error('missing-data'))));
      errorHandlerService.handleError = jasmine.createSpy().and.returnValue(null);
      fixture.detectChanges();
      fixture.whenStable()
        .then(() => {
          expect(errorHandlerService.handleError).toHaveBeenCalledWith('close-session');
          done();
        });
    });
  });




});
